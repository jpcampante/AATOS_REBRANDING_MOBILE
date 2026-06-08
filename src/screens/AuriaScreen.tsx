import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  AuriaComposer,
  AuriaComposerHandle,
} from '../components/auria/AuriaComposer';
import {
  AuriaGalleryPanel,
  AuriaNewsPanel,
  AuriaProjectsPanel,
  AuriaSearchPanel,
} from '../components/auria/AuriaPanels';
import {
  getAuriaComposerOverlayHeight,
  getContentMaxWidth,
  getSidebarWidth,
  getWelcomeContentTopPadding,
} from '../components/auria/auriaLayout';
import { AuriaChatMessage, AuriaChatView } from '../components/auria/AuriaChatView';
import { AuriaNewProjectModal, AuriaNewProjectInput } from '../components/auria/AuriaNewProjectModal';
import { AuriaSidebar } from '../components/auria/AuriaSidebar';
import { AuriaWelcomeView } from '../components/auria/AuriaWelcomeView';
import { AuriaWorkspaceHeader, WORKSPACE_HEADER_HEIGHT } from '../components/auria/AuriaWorkspaceHeader';
import { APP_SHELL_BOTTOM_INSET } from '../components/navigation/AppShell';
import {
  AuriaPanel,
  auriaProjects as defaultProjects,
  auriaSidebarProjects as defaultSidebarProjects,
  PROJECT_ACCENT_PALETTE,
  AuriaProject,
  AuriaSidebarProjectRow,
} from '../data/auriaMockData';
import { useKeyboardInset } from '../hooks/useKeyboardInset';
import { useTheme } from '../theme';

const SLIDE_DURATION = 280;
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export function AuriaScreen() {
  const { ds, theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const keyboardInset = useKeyboardInset(APP_SHELL_BOTTOM_INSET);
  const composerRef = useRef<AuriaComposerHandle>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panel, setPanel] = useState<AuriaPanel>('chat');
  const [showWelcome, setShowWelcome] = useState(true);
  const [composerText, setComposerText] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [projects, setProjects] = useState<AuriaProject[]>(() => [...defaultProjects]);
  const [sidebarProjectRows, setSidebarProjectRows] = useState<AuriaSidebarProjectRow[]>(() => [
    ...defaultSidebarProjects,
  ]);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [messages, setMessages] = useState<AuriaChatMessage[]>([]);

  const slideProgress = useRef(new Animated.Value(0)).current;
  const [panelKey, setPanelKey] = useState(0);
  const panelAnim = useRef(new Animated.Value(1)).current;
  const panelTransitionId = useRef(0);
  const panelTransitionRef = useRef<Animated.CompositeAnimation | null>(null);

  const styles = useMemo(() => createStyles(ds, theme), [ds, theme]);
  const sidebarWidth = useMemo(() => getSidebarWidth(screenWidth), [screenWidth]);
  const contentMaxWidth = useMemo(() => getContentMaxWidth(screenWidth), [screenWidth]);
  const isWelcomeHome = showWelcome && panel === 'chat' && messages.length === 0;
  const showComposer = panel === 'chat';
  const composerOverlayHeight = getAuriaComposerOverlayHeight(keyboardInset);
  const welcomeTopPadding = useMemo(
    () =>
      getWelcomeContentTopPadding(
        screenHeight,
        WORKSPACE_HEADER_HEIGHT,
        composerOverlayHeight,
        APP_SHELL_BOTTOM_INSET,
      ),
    [composerOverlayHeight, screenHeight],
  );

  const dismissKeyboard = () => {
    composerRef.current?.blur();
    Keyboard.dismiss();
  };

  useEffect(() => {
    slideProgress.stopAnimation();
    Animated.timing(slideProgress, {
      toValue: sidebarOpen ? 1 : 0,
      duration: SLIDE_DURATION,
      easing: sidebarOpen ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [sidebarOpen, slideProgress]);

  const mainTranslateX = slideProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, sidebarWidth],
  });

  useEffect(() => {
    if (sidebarOpen) {
      dismissKeyboard();
    }
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  const handleContentTap = () => {
    if (sidebarOpen) {
      closeSidebar();
      return;
    }
    dismissKeyboard();
  };

  const transitionPanel = (next: AuriaPanel) => {
    dismissKeyboard();
    closeSidebar();

    if (next === panel) {
      return;
    }

    const transitionId = panelTransitionId.current + 1;
    panelTransitionId.current = transitionId;

    panelTransitionRef.current?.stop();
    panelAnim.stopAnimation();

    panelTransitionRef.current = Animated.timing(panelAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: USE_NATIVE_DRIVER,
    });

    panelTransitionRef.current.start(() => {
      if (panelTransitionId.current !== transitionId) {
        return;
      }

      setPanel(next);
      setShowWelcome(next === 'chat');
      panelAnim.setValue(0);

      panelTransitionRef.current = Animated.timing(panelAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      });
      panelTransitionRef.current.start();
    });
  };

  const appendUserMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const id = Date.now();
    setMessages((current) => [
      ...current,
      { id: `m-${id}`, role: 'user', text: trimmed },
      {
        id: `m-${id}-a`,
        role: 'assistant',
        text: 'Got it — this is a mock reply while the chat backend is not wired yet.',
      },
    ]);
    setShowWelcome(false);
  };

  const handleNewChat = () => {
    dismissKeyboard();
    setShowWelcome(true);
    setPanel('chat');
    setComposerText('');
    setMessages([]);
    setActiveConversationId(null);
    setPanelKey((key) => key + 1);
    panelAnim.setValue(1);
    closeSidebar();
  };

  const handleSuggestion = (text: string) => {
    dismissKeyboard();
    setComposerText('');
    appendUserMessage(text);
  };

  const handleSend = () => {
    appendUserMessage(composerText);
    setComposerText('');
    dismissKeyboard();
  };

  const openNewProjectModal = () => {
    dismissKeyboard();
    setNewProjectOpen(true);
  };

  const handleCreateProject = ({ name, visibility }: AuriaNewProjectInput) => {
    const id = `p-${Date.now()}`;
    const emoji = name.charAt(0).toUpperCase() || 'P';
    const accent = PROJECT_ACCENT_PALETTE[projects.length % PROJECT_ACCENT_PALETTE.length];

    const project: AuriaProject = {
      id,
      name,
      owner: name,
      emoji,
      accent,
      visibility,
      updatedLabel: 'Created just now',
      fileCount: 0,
      chatCount: 0,
    };

    setProjects((current) => [...current, project]);
    setSidebarProjectRows((current) => {
      const moreIndex = current.findIndex((row) => row.kind === 'more');
      const row: AuriaSidebarProjectRow = { id, name, kind: 'folder' };
      if (moreIndex === -1) return [...current, row];
      return [...current.slice(0, moreIndex), row, ...current.slice(moreIndex)];
    });

    setNewProjectOpen(false);
    closeSidebar();
    setPanel('projects');
    setShowWelcome(false);
    setPanelKey((key) => key + 1);
    panelAnim.setValue(1);
  };

  const panelTranslateX = panelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  const renderMain = () => {
    if (isWelcomeHome) {
      return (
        <AuriaWelcomeView
          contentMaxWidth={contentMaxWidth}
          contentTopPadding={welcomeTopPadding}
          onSuggestion={handleSuggestion}
          onRefreshSuggestions={() => setShowWelcome(true)}
        />
      );
    }

    if (panel === 'news') return <AuriaNewsPanel />;
    if (panel === 'gallery') return <AuriaGalleryPanel />;
    if (panel === 'search') return <AuriaSearchPanel />;
    if (panel === 'projects') {
      return (
        <AuriaProjectsPanel projects={projects} onCreateProject={openNewProjectModal} />
      );
    }

    return <AuriaChatView messages={messages} />;
  };

  return (
    <View style={styles.root}>
      <AuriaSidebar
        open={sidebarOpen}
        width={sidebarWidth}
        revealProgress={slideProgress}
        activePanel={panel}
        activeConversationId={activeConversationId}
        projectRows={sidebarProjectRows}
        projects={projects}
        onNewChat={handleNewChat}
        onSelectPanel={transitionPanel}
        onCreateProject={openNewProjectModal}
        onSelectConversation={(id) => {
          dismissKeyboard();
          setShowWelcome(false);
          setPanel('chat');
          setActiveConversationId(id);
          setMessages([
            {
              id: `h-${id}`,
              role: 'assistant',
              text: 'Conversation loaded — mock history for this thread.',
            },
          ]);
          setPanelKey((key) => key + 1);
          panelAnim.setValue(1);
          closeSidebar();
        }}
      />

      <Animated.View
        style={[
          styles.pushShell,
          {
            transform: [{ translateX: mainTranslateX }],
          },
        ]}
      >
        <View style={styles.pushSurface}>
          <View style={styles.headerBar}>
            <AuriaWorkspaceHeader
              onToggleSidebar={() => setSidebarOpen((open) => !open)}
              onNewChat={handleNewChat}
            />
          </View>

          <View style={styles.main}>
            <Pressable style={styles.contentTapArea} onPress={handleContentTap} accessible={false}>
              <Animated.View
                key={panelKey}
                style={[
                  styles.content,
                  showComposer ? { paddingBottom: composerOverlayHeight } : null,
                  {
                    transform: [{ translateX: panelTranslateX }],
                  },
                ]}
                pointerEvents="box-none"
              >
                {renderMain()}
              </Animated.View>
            </Pressable>

            {showComposer ? (
              <View style={styles.composerOverlay} pointerEvents="box-none">
                <AuriaComposer
                  ref={composerRef}
                  value={composerText}
                  onChangeText={setComposerText}
                  onSend={handleSend}
                  bottomInset={keyboardInset}
                />
              </View>
            ) : null}
          </View>
        </View>
      </Animated.View>

      <AuriaNewProjectModal
        visible={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreateProject}
      />
    </View>
  );
}

function createStyles(
  ds: ReturnType<typeof useTheme>['ds'],
  theme: ReturnType<typeof useTheme>['theme'],
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: ds.gray50,
      overflow: 'hidden',
    },
    pushShell: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 2,
    },
    pushSurface: {
      flex: 1,
      backgroundColor: ds.gray50,
    },
    main: {
      flex: 1,
    },
    headerBar: {
      height: WORKSPACE_HEADER_HEIGHT,
    },
    contentTapArea: {
      flex: 1,
      overflow: 'hidden',
    },
    content: {
      flex: 1,
    },
    composerOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
  });
}
