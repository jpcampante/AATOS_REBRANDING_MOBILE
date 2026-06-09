import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  GlassContainer,
  GlassView,
} from 'expo-glass-effect';
import { LiquidGlassSurface } from '../ui/LiquidGlassSurface';
import { PRODUCT_TABS, ProductTabId } from '../../data/productNavigation';
import {
  liquidGlassBorder,
  liquidGlassColorScheme,
  liquidGlassTokens,
  isNativeLiquidGlassAvailable,
  useTheme,
} from '../../theme';

type ProductNavBarProps = {
  activeTab: ProductTabId;
  onTabChange: (tab: ProductTabId) => void;
};

export const PRODUCT_NAV_BAR_HEIGHT = 64;
/** wrap padding (6+4) + inner bar min (48) + inner vertical padding (12). */
export const PRODUCT_NAV_FLOATING_HEIGHT = 70;

function TabRail({
  activeTab,
  onTabChange,
  glassActiveTab,
}: ProductNavBarProps & { glassActiveTab?: boolean }) {
  const { theme, setPreference, preference } = useTheme();
  const styles = useMemo(
    () => createStyles(theme, activeTab === 'auria'),
    [activeTab, theme],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.railInner}>
        {PRODUCT_TABS.map((tab) => {
          const active = activeTab === tab.id;

          const label = (
            <Pressable
              style={[styles.tab, active && !glassActiveTab && styles.tabActiveFallback]}
              onPress={() => onTabChange(tab.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          );

          if (glassActiveTab && active) {
            return (
              <GlassView
                key={tab.id}
                style={styles.glassTabPill}
                glassEffectStyle="regular"
                isInteractive
              >
                {label}
              </GlassView>
            );
          }

          return (
            <View key={tab.id} style={styles.tabWrap}>
              {label}
            </View>
          );
        })}

        <Pressable
          style={styles.themeToggle}
          onPress={() => setPreference(preference === 'dark' ? 'light' : 'dark')}
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${theme.mode === 'dark' ? 'light' : 'dark'} theme`}
        >
          <Text style={styles.themeToggleText}>{theme.mode === 'dark' ? '☀' : '☾'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export function ProductNavBar({ activeTab, onTabChange }: ProductNavBarProps) {
  const { theme } = useTheme();
  const isAuria = activeTab === 'auria';
  const styles = useMemo(
    () => createStyles(theme, isAuria),
    [isAuria, theme],
  );
  const glass = isAuria ? liquidGlassTokens(theme) : null;
  const nativeScheme = liquidGlassColorScheme(theme);

  if (isNativeLiquidGlassAvailable()) {
    return (
      <View style={styles.wrap}>
        <GlassContainer spacing={10} style={styles.glassContainer}>
          <GlassView
            style={styles.glassBar}
            glassEffectStyle="regular"
            colorScheme={nativeScheme}
          >
            <TabRail activeTab={activeTab} onTabChange={onTabChange} glassActiveTab />
          </GlassView>
        </GlassContainer>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <LiquidGlassSurface
        elevationLevel="dock"
        borderRadius={theme.radius.panel}
        style={styles.fallbackBar}
      >
        <TabRail activeTab={activeTab} onTabChange={onTabChange} />
      </LiquidGlassSurface>
    </View>
  );
}

function createStyles(
  theme: ReturnType<typeof useTheme>['theme'],
  isAuria = false,
) {
  const { colors, radius, shadow } = theme;
  const glass = isAuria ? liquidGlassTokens(theme) : null;
  const rimSubtle = isAuria ? liquidGlassBorder(theme, true) : null;

  return StyleSheet.create({
    wrap: {
      paddingHorizontal: 12,
      paddingTop: 6,
      paddingBottom: 4,
    },
    glassContainer: {
      borderRadius: radius.panel,
    },
    glassBar: {
      borderRadius: radius.panel,
      paddingHorizontal: 6,
      paddingVertical: 6,
      minHeight: PRODUCT_NAV_BAR_HEIGHT - 16,
    },
    fallbackBar: {
      borderRadius: radius.panel,
      paddingHorizontal: 4,
      paddingVertical: 4,
      minHeight: PRODUCT_NAV_BAR_HEIGHT - 16,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
    },
    railInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 2,
    },
    tabWrap: {
      borderRadius: radius.pill,
    },
    glassTabPill: {
      borderRadius: radius.pill,
    },
    tab: {
      paddingHorizontal: 13,
      paddingVertical: 9,
      borderRadius: radius.pill,
    },
    tabActiveFallback: {
      backgroundColor: glass?.fillStrong ?? colors.navActiveSurface,
      ...(glass ? rimSubtle : shadow.navActive),
    },
    tabText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    tabTextActive: {
      fontWeight: '600',
      color: colors.text,
    },
    themeToggle: {
      marginLeft: 4,
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: glass?.fill ?? colors.input,
      ...(rimSubtle ?? {}),
    },
    themeToggleText: {
      fontSize: 15,
    },
  });
}
