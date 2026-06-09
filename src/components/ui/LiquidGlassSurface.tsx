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
  if (flattened.flexDirection !== undefined) {
    flattened.display = 'flex';
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
  const nativeGlassStyle = useInteractiveGlass ? 'clear' : 'regular';
  const fallbackRim = theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.24)'
    : 'rgba(255, 255, 255, 0.88)';
  const fallbackSheen = theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.3)'
    : 'rgba(255, 255, 255, 0.96)';

  const fallbackStyle = useMemo(() => {
    const iosFallback = Platform.OS === 'ios';
    if (variant === 'input') {
      return {
        position: 'relative' as const,
        borderRadius: radius,
        overflow: 'hidden' as const,
        backgroundColor: iosFallback
          ? theme.mode === 'dark'
            ? 'rgba(44, 47, 53, 0.7)'
            : 'rgba(255, 255, 255, 0.68)'
          : glass.inputFill,
        ...rim,
        ...glass.inputWebBlur,
      };
    }

    return {
      position: 'relative' as const,
      borderRadius: radius,
      overflow: 'hidden' as const,
      backgroundColor: iosFallback
        ? theme.mode === 'dark'
          ? strong
            ? 'rgba(44, 47, 53, 0.8)'
            : 'rgba(44, 47, 53, 0.66)'
          : strong
            ? 'rgba(255, 255, 255, 0.78)'
            : 'rgba(255, 255, 255, 0.62)'
        : strong
          ? glass.fillStrong
          : glass.fill,
      ...rim,
      ...glass.webBlur,
    };
  }, [glass, radius, rim, strong, theme.mode, variant]);

  const nativeFallbackRim = (
    <>
      <View
        pointerEvents="none"
        style={[
          styles.rim,
          {
            borderRadius: radius,
            borderColor: fallbackRim,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.sheen,
          {
            backgroundColor: fallbackSheen,
            borderRadius: 1,
          },
        ]}
      />
    </>
  );

  const nativeGlassBody = (
    <GlassView
      style={[{ borderRadius: radius, backgroundColor: 'transparent' }, style]}
      glassEffectStyle={nativeGlassStyle}
      isInteractive={useInteractiveGlass}
      colorScheme={colorScheme}
    >
      {children}
    </GlassView>
  );

  const body = useNativeGlass ? (
    grouped ? (
      <GlassContainer spacing={groupSpacing} style={{ borderRadius: radius }}>
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
          boxShadow: `inset 0 1px 0 ${fallbackSheen}, inset 0 0 0 1px ${fallbackRim}`,
          ...toWebStyle(style),
        },
      },
      children,
    )
  ) : (
    <View style={[fallbackStyle, style]}>
      {children}
      {nativeFallbackRim}
    </View>
  );

  if (!elevated || useNativeGlass) {
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
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: StyleSheet.hairlineWidth,
  },
});
