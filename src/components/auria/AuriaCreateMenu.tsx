import { useEffect, useMemo, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { auriaTypography, liquidGlassTokens, useTheme } from '../../theme';
import { AuriaIcon, AuriaIconName, AURIA_ICON_SIZE } from '../icons';
import { LiquidGlassSurface } from '../ui/LiquidGlassSurface';

type CreateMode = 'home' | 'document' | 'image' | 'teammate';
type DocumentType = 'Document' | 'Presentation' | 'Spreadsheet' | 'Report';
type ImageRatio = '1:1' | '4:3' | '3:4' | '16:9' | '9:16';

type AuriaCreateMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSendRequest: (request: string) => void;
};

const ACTIONS: Array<{
  id: Exclude<CreateMode, 'home'> | 'files';
  label: string;
  description: string;
  icon: AuriaIconName;
}> = [
  {
    id: 'files',
    label: 'Add files',
    description: 'Attach documents, images, or data for Auria to analyze.',
    icon: 'upload',
  },
  {
    id: 'document',
    label: 'Create document',
    description: 'Draft, rewrite, summarize, and structure editable content.',
    icon: 'document',
  },
  {
    id: 'image',
    label: 'Create image',
    description: 'Describe an image and choose its output proportion.',
    icon: 'photo',
  },
  {
    id: 'teammate',
    label: 'Talk to teammate AI',
    description: 'Bring another employee AI and their workspace context into the chat.',
    icon: 'users',
  },
];

const DOCUMENT_TYPES: DocumentType[] = ['Document', 'Presentation', 'Spreadsheet', 'Report'];
const DOCUMENT_TASKS = ['Draft from scratch', 'Rewrite', 'Summarize', 'Create outline'] as const;
const IMAGE_RATIOS: ImageRatio[] = ['1:1', '4:3', '3:4', '16:9', '9:16'];
const TEAMMATES = [
  { name: 'Maya Chen', role: 'Finance AI', context: 'Budgets, forecasts, and board reporting' },
  { name: 'Noah Williams', role: 'Sales AI', context: 'Pipeline, accounts, and follow-ups' },
  { name: 'Sofia Martins', role: 'Legal AI', context: 'Contracts, policies, and compliance' },
] as const;

export function AuriaCreateMenu({ visible, onClose, onSendRequest }: AuriaCreateMenuProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [mode, setMode] = useState<CreateMode>('home');
  const [prompt, setPrompt] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('Document');
  const [documentTask, setDocumentTask] =
    useState<(typeof DOCUMENT_TASKS)[number]>('Draft from scratch');
  const [imageRatio, setImageRatio] = useState<ImageRatio>('1:1');
  const [teammate, setTeammate] = useState<(typeof TEAMMATES)[number]>(TEAMMATES[0]);

  useEffect(() => {
    if (!visible) {
      setMode('home');
      setPrompt('');
    }
  }, [visible]);

  const finish = (request: string) => {
    onSendRequest(request);
    onClose();
  };

  const addFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const names = result.assets.map((asset) => asset.name).join(', ');
    finish(`Analyze the attached files: ${names}. Ask me what outcome I need before starting.`);
  };

  const openAction = (id: (typeof ACTIONS)[number]['id']) => {
    if (id === 'files') {
      void addFiles();
      return;
    }
    setMode(id);
  };

  const submit = () => {
    const detail = prompt.trim() || 'Ask me for the missing details before starting.';
    if (mode === 'document') {
      finish(`Create a ${documentType.toLowerCase()}. Task: ${documentTask}. Brief: ${detail}`);
    } else if (mode === 'image') {
      finish(`Create an image with aspect ratio ${imageRatio}. Image brief: ${detail}`);
    } else if (mode === 'teammate') {
      finish(`Start a shared conversation with ${teammate.name}, ${teammate.role}. Topic: ${detail}`);
    }
  };

  const title =
    mode === 'home'
      ? 'Create with Auria'
      : mode === 'document'
        ? 'Create document'
        : mode === 'image'
          ? 'Create image'
          : 'Talk to teammate AI';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close create menu"
        />
        <LiquidGlassSurface
          strong
          elevationLevel="modal"
          borderRadius={theme.radius.panel}
          style={styles.sheet}
        >
          <View style={styles.header}>
            {mode !== 'home' ? (
              <Pressable
                onPress={() => setMode('home')}
                style={styles.headerButton}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <AuriaIcon name="arrowLeft" size={AURIA_ICON_SIZE.sm} />
              </Pressable>
            ) : (
              <View style={styles.headerButton} />
            )}
            <Text style={styles.title}>{title}</Text>
            <Pressable
              onPress={onClose}
              style={styles.headerButton}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <AuriaIcon name="moreHorizontal" size={AURIA_ICON_SIZE.sm} />
            </Pressable>
          </View>

          <ScrollView
            key={mode}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {mode === 'home' ? (
              ACTIONS.map((action) => (
                <Pressable
                  key={action.id}
                  onPress={() => openAction(action.id)}
                  style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
                  accessibilityRole="button"
                >
                  <View style={styles.actionIcon}>
                    <AuriaIcon name={action.icon} size={AURIA_ICON_SIZE.md} />
                  </View>
                  <View style={styles.actionCopy}>
                    <Text style={styles.actionTitle}>{action.label}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <>
                {mode === 'document' ? (
                  <>
                    <OptionSection
                      label="Format"
                      options={DOCUMENT_TYPES}
                      value={documentType}
                      onChange={setDocumentType}
                    />
                    <OptionSection
                      label="Action"
                      options={DOCUMENT_TASKS}
                      value={documentTask}
                      onChange={setDocumentTask}
                    />
                  </>
                ) : null}

                {mode === 'image' ? (
                  <OptionSection
                    label="Proportion"
                    options={IMAGE_RATIOS}
                    value={imageRatio}
                    onChange={setImageRatio}
                  />
                ) : null}

                {mode === 'teammate' ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Employee AI</Text>
                    {TEAMMATES.map((person) => {
                      const active = teammate.name === person.name;
                      return (
                        <Pressable
                          key={person.name}
                          onPress={() => setTeammate(person)}
                          style={[styles.personRow, active && styles.personRowActive]}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                        >
                          <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                              {person.name
                                .split(' ')
                                .map((part) => part[0])
                                .join('')}
                            </Text>
                          </View>
                          <View style={styles.actionCopy}>
                            <Text style={styles.actionTitle}>{person.name}</Text>
                            <Text style={styles.actionDescription}>
                              {person.role} {'\u00B7'} {person.context}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>
                    {mode === 'image' ? 'Describe the image' : 'Brief'}
                  </Text>
                  <LiquidGlassSurface
                    variant="input"
                    elevated={false}
                    borderRadius={theme.radius.md}
                    style={styles.promptSurface}
                  >
                    <TextInput
                      value={prompt}
                      onChangeText={setPrompt}
                      placeholder={
                        mode === 'image'
                          ? 'A minimal campaign image with soft natural light...'
                          : 'Describe what Auria should create or discuss...'
                      }
                      placeholderTextColor={theme.colors.textHint}
                      multiline
                      style={styles.prompt}
                    />
                  </LiquidGlassSurface>
                </View>

                <Pressable onPress={submit} style={styles.submit} accessibilityRole="button">
                  <AuriaIcon
                    name="sparkles"
                    color={theme.colors.surface}
                    size={AURIA_ICON_SIZE.sm}
                  />
                  <Text style={styles.submitText}>
                    {mode === 'teammate' ? 'Start conversation' : 'Create'}
                  </Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </LiquidGlassSurface>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function OptionSection<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const active = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const glass = liquidGlassTokens(theme);
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 12,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.offBlackOverlay,
      zIndex: 0,
    },
    sheet: {
      maxHeight: '82%',
      padding: 14,
      gap: 8,
      zIndex: 1,
    },
    header: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerButton: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 19,
    },
    title: {
      ...auriaTypography.title,
      color: theme.colors.text,
      fontSize: 17,
      fontWeight: theme.typography.fontWeight.bold,
    },
    scroll: {
      flexGrow: 0,
    },
    scrollContent: {
      gap: 10,
      paddingBottom: 4,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: theme.radius.md,
    },
    pressed: {
      backgroundColor: glass.pressed,
    },
    actionIcon: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
      backgroundColor: glass.fill,
      borderWidth: 1,
      borderColor: glass.borderSubtle,
    },
    actionCopy: {
      flex: 1,
      gap: 3,
    },
    actionTitle: {
      ...auriaTypography.body,
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    actionDescription: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 12,
      lineHeight: 17,
    },
    section: {
      gap: 8,
    },
    sectionLabel: {
      ...auriaTypography.label,
      color: theme.colors.textTertiary,
      fontSize: 11,
      fontWeight: theme.typography.fontWeight.bold,
      textTransform: 'uppercase',
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
    },
    chip: {
      paddingHorizontal: 11,
      paddingVertical: 8,
      borderRadius: theme.radius.pill,
      backgroundColor: glass.fill,
      borderWidth: 1,
      borderColor: glass.borderSubtle,
    },
    chipActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    chipText: {
      ...auriaTypography.body,
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: theme.typography.fontWeight.medium,
    },
    chipTextActive: {
      color: theme.colors.surface,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    personRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 10,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: glass.borderSubtle,
    },
    personRowActive: {
      backgroundColor: glass.fillStrong,
      borderColor: glass.border,
    },
    avatar: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 19,
      backgroundColor: theme.colors.accent,
    },
    avatarText: {
      ...auriaTypography.label,
      color: theme.colors.surface,
      fontSize: 11,
      fontWeight: theme.typography.fontWeight.bold,
    },
    promptSurface: {
      minHeight: 92,
      padding: 12,
    },
    prompt: {
      ...auriaTypography.body,
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 20,
      minHeight: 68,
      textAlignVertical: 'top',
      ...(Platform.OS === 'web'
        ? ({ outlineWidth: 0, outlineStyle: 'none' } as object)
        : null),
    },
    submit: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.accent,
      marginTop: 2,
    },
    submitText: {
      ...auriaTypography.body,
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: theme.typography.fontWeight.bold,
    },
  });
}
