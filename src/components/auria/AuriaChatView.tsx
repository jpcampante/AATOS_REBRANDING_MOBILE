import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { auriaGlassBorder, auriaGlassTokens } from './auriaGlass';
import { AURIA_CHAT_SCROLL_END_PADDING, AURIA_CONTENT_HORIZONTAL_INSET } from './auriaLayout';
import { useTheme } from '../../theme';

export type AuriaChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

type AuriaChatViewProps = {
  messages: AuriaChatMessage[];
};

export function AuriaChatView({ messages }: AuriaChatViewProps) {
  const { ds, theme } = useTheme();
  const styles = useMemo(() => createStyles(ds, theme), [ds, theme]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {messages.map((message) => {
        const isUser = message.role === 'user';
        return (
          <View
            key={message.id}
            style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}
          >
            <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
              <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>
                {message.text}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

function createStyles(
  ds: ReturnType<typeof useTheme>['ds'],
  theme: ReturnType<typeof useTheme>['theme'],
) {
  const glass = auriaGlassTokens(theme.mode);
  const rim = auriaGlassBorder(theme.mode);

  return StyleSheet.create({
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: AURIA_CONTENT_HORIZONTAL_INSET,
      paddingTop: 12,
      paddingBottom: AURIA_CHAT_SCROLL_END_PADDING,
      gap: 12,
    },
    row: {
      width: '100%',
    },
    rowUser: {
      alignItems: 'flex-end',
    },
    rowAssistant: {
      alignItems: 'flex-start',
    },
    bubble: {
      maxWidth: '88%',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    bubbleUser: {
      backgroundColor: ds.offBlack,
    },
    bubbleAssistant: {
      backgroundColor: glass.fill,
      ...rim,
      ...glass.webBlur,
    },
    text: {
      fontSize: 15,
      lineHeight: 22,
    },
    textUser: {
      color: ds.white,
    },
    textAssistant: {
      color: ds.gray900,
    },
  });
}
