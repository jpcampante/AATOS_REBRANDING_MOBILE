import { ReactNode, useMemo } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { auriaTypography, liquidGlassTokens, useTheme } from '../../theme';
import { LiquidGlassSurface } from '../ui/LiquidGlassSurface';
import { AuriaIcon, AURIA_ICON_SIZE, AURIA_ICON_STROKE_NAV } from '../icons';
import { AURIA_CONTENT_HORIZONTAL_INSET, AURIA_PANEL_SCROLL_END_PADDING } from './auriaLayout';

export function AuriaPanelScroll({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {children}
    </ScrollView>
  );
}

export function AuriaPanelHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actions}
    </View>
  );
}

export function AuriaSegmentedControl<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: ReadonlyArray<{ id: T; label: string }>;
  onChange: (value: T) => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.segmentRow}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <Pressable
            key={item.id}
            onPress={() => onChange(item.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function AuriaSearchField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  const { ds, theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <LiquidGlassSurface
      variant="input"
      elevated={false}
      borderRadius={theme.radius.md}
      style={styles.searchField}
    >
      <AuriaIcon
        name="search"
        size={AURIA_ICON_SIZE.sm}
        color={ds.gray500}
        strokeWidth={AURIA_ICON_STROKE_NAV}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={ds.gray400}
        style={styles.searchInput}
        returnKeyType="search"
      />
    </LiquidGlassSurface>
  );
}

export function AuriaPanelCard({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  const body = (
    <LiquidGlassSurface
      borderRadius={theme.radius.card}
      elevationLevel="card"
      style={[stylesStatic.card, style]}
    >
      {children}
    </LiquidGlassSurface>
  );
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button">
      {body}
    </Pressable>
  ) : (
    body
  );
}

export function AuriaEmptyState({ title, message }: { title: string; message: string }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const glass = liquidGlassTokens(theme);
  return StyleSheet.create({
    scroll: {
      paddingHorizontal: AURIA_CONTENT_HORIZONTAL_INSET,
      paddingTop: 8,
      paddingBottom: AURIA_PANEL_SCROLL_END_PADDING,
      gap: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    },
    headerCopy: {
      flex: 1,
      gap: 3,
    },
    title: {
      ...auriaTypography.title,
      fontSize: 26,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    subtitle: {
      ...auriaTypography.body,
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },
    segmentRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    segment: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: theme.radius.pill,
      backgroundColor: glass.fill,
    },
    segmentActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    segmentText: {
      ...auriaTypography.body,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.textSecondary,
    },
    segmentTextActive: {
      color: theme.colors.surface,
    },
    searchField: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
    },
    searchInput: {
      ...auriaTypography.body,
      flex: 1,
      fontSize: 15,
      color: theme.colors.text,
      backgroundColor: 'transparent',
      ...(Platform.OS === 'web'
        ? ({ outlineWidth: 0, outlineStyle: 'none', boxShadow: 'none' } as object)
        : null),
    },
    empty: {
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 48,
      gap: 6,
    },
    emptyTitle: {
      ...auriaTypography.body,
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    emptyMessage: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },
  });
}

const stylesStatic = StyleSheet.create({
  card: {
    padding: 14,
  },
});
