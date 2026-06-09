import { createElement, ReactNode, useMemo } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { GlassContainer, GlassView } from 'expo-glass-effect';
import {
  isNativeLiquidGlassAvailable,
  liquidGlassBorder,
  liquidGlassColorScheme,
  liquidGlassElevation,
  liquidGlassElevationWeb,
  liquidGlassTokens,
  LiquidGlassElevation,
} from '../../theme/liquidGlass';
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
  elevationLevel?: LiquidGlassElevation;
  /** Wrap sibling glass elements in GlassContainer (iOS Liquid Glass performance + morphing). */
  grouped?: boolean;
  groupSpacing?: number;
};

function toWebStyle(style: StyleProp<ViewStyle>) {
  const flattened = { ...StyleSheet.flatten(style) } as Record<string, unknown>;
  const horizontal = flattened.paddingHorizontal;
  const vertical = flattened.paddingVertical;

  if (horizontal !== undefined) {
    flattened.paddingLeft = horizontal;
    flattened.paddingRight = horizontal;
    delete flattened.paddingHorizontal;
  }
  if (vertical !== undefined) {
    flattened.paddingTop = vertical;
    flattened.paddingBottom = vertical;
    delete flattened.paddingVertical;
  }

  return flattened;
}

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
  const glass = useMemo(() => liquidGlassTokens(theme), [theme]);
  const rim = useMemo(
    () => liquidGlassBorder(theme, variant === 'input'),
    [theme, variant],
  );
  const level = elevationLevel ?? (variant === 'input' ? 'input' : 'dock');
  const elevation = useMemo(
    () => liquidGlassElevation(theme, level),
    [level, theme],
  );
  const elevationWeb = useMemo(
    () => liquidGlassElevationWeb(theme, level),
    [level, theme],
  );
  const colorScheme = liquidGlassColorScheme(theme);
  const useNativeGlass = isNativeLiquidGlassAvailable();
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
  ) : Platform.OS === 'web' ? (
    createElement(
      'div',
      {
        style: {
          ...toWebStyle(fallbackStyle),
          borderStyle: 'solid',
          ...toWebStyle(style),
        },
      },
      children,
    )
  ) : (
    <View style={[fallbackStyle, style]}>{children}</View>
  );

  if (!elevated) {
    return body;
  }

  return (
    <View style={[styles.elevationWrap, { borderRadius: radius }, elevation, elevationWeb]}>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  elevationWrap: {
    overflow: 'visible',
  },
});
