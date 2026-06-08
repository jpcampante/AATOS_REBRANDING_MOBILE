import { ReactNode, useMemo } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { GlassContainer, GlassView } from 'expo-glass-effect';
import {
  auriaGlassBorder,
  auriaGlassColorScheme,
  auriaGlassElevation,
  auriaGlassElevationWeb,
  auriaGlassTokens,
  AuriaGlassElevation,
  isAuriaNativeGlassAvailable,
} from '../auria/auriaGlass';
import { useTheme } from '../../theme';

type LiquidGlassSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  interactive?: boolean;
  strong?: boolean;
  variant?: 'surface' | 'input';
  /** Drop shadow below the glass container — never use opacity on GlassView parents. */
  elevated?: boolean;
  elevationLevel?: AuriaGlassElevation;
  /** Wrap sibling glass elements in GlassContainer (iOS Liquid Glass performance + morphing). */
  grouped?: boolean;
  groupSpacing?: number;
};

export function LiquidGlassSurface({
  children,
  style,
  borderRadius,
  interactive = false,
  strong = false,
  variant = 'surface',
  elevated = true,
  elevationLevel,
  grouped = false,
  groupSpacing = 10,
}: LiquidGlassSurfaceProps) {
  const { theme } = useTheme();
  const radius = borderRadius ?? theme.radius.panel;
  const glass = useMemo(() => auriaGlassTokens(theme.mode), [theme.mode]);
  const rim = useMemo(
    () => auriaGlassBorder(theme.mode, variant === 'input'),
    [theme.mode, variant],
  );
  const level = elevationLevel ?? (variant === 'input' ? 'input' : 'dock');
  const elevation = useMemo(
    () => auriaGlassElevation(theme.mode, level),
    [level, theme.mode],
  );
  const elevationWeb = useMemo(
    () => auriaGlassElevationWeb(theme.mode, level),
    [level, theme.mode],
  );
  const colorScheme = auriaGlassColorScheme(theme.mode);
  const useNativeGlass = isAuriaNativeGlassAvailable();
  const useInteractiveGlass = interactive || variant === 'input';
  const nativeGlassStyle = variant === 'input' ? 'clear' : 'regular';

  const fallbackStyle = useMemo(() => {
    if (variant === 'input') {
      return {
        borderRadius: radius,
        overflow: 'hidden' as const,
        backgroundColor: glass.inputFill,
        ...rim,
        ...glass.inputWebBlur,
      };
    }

    return {
      borderRadius: radius,
      overflow: 'hidden' as const,
      backgroundColor: strong ? glass.fillStrong : glass.fill,
      ...rim,
      ...glass.webBlur,
    };
  }, [glass, radius, rim, strong, variant]);

  const nativeGlassBody = (
    <GlassView
      style={[fallbackStyle, style, { borderWidth: 0, backgroundColor: 'transparent' }]}
      glassEffectStyle={nativeGlassStyle}
      isInteractive={useInteractiveGlass}
      tintColor={glass.tintColor}
      colorScheme={colorScheme}
    >
      {children}
    </GlassView>
  );

  const body = useNativeGlass ? (
    grouped ? (
      <GlassContainer spacing={groupSpacing} style={{ borderRadius: radius, overflow: 'hidden' }}>
        {nativeGlassBody}
      </GlassContainer>
    ) : (
      nativeGlassBody
    )
  ) : (
    <View style={[fallbackStyle, style]}>{children}</View>
  );

  if (!elevated) {
    return body;
  }

  return <View style={[styles.elevationWrap, elevation, elevationWeb]}>{body}</View>;
}

const styles = StyleSheet.create({
  elevationWrap: {
    overflow: 'visible',
  },
});
