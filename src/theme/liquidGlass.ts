import { Platform, ViewStyle } from 'react-native';
import type { GlassColorScheme } from 'expo-glass-effect';
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { AatosTheme } from './aatosTheme';

export type LiquidGlassElevation = 'dock' | 'input' | 'card' | 'modal';

export type LiquidGlassTokens = {
  fill: string;
  fillStrong: string;
  inputFill: string;
  tintColor: string;
  border: string;
  borderSubtle: string;
  pressed: string;
  webBlur: ViewStyle;
  inputWebBlur: ViewStyle;
};

export function isNativeLiquidGlassAvailable(): boolean {
  return Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
}

export function liquidGlassColorScheme(theme: AatosTheme): GlassColorScheme {
  return theme.mode === 'dark' ? 'dark' : 'light';
}

export function liquidGlassTokens(theme: AatosTheme): LiquidGlassTokens {
  const webBlur =
    Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(22px) saturate(190%)',
          WebkitBackdropFilter: 'blur(22px) saturate(190%)',
        } as ViewStyle)
      : {};

  const inputWebBlur =
    Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(24px) saturate(195%)',
          WebkitBackdropFilter: 'blur(24px) saturate(195%)',
        } as ViewStyle)
      : {};

  return {
    fill: theme.colors.glassFill,
    fillStrong: theme.colors.glassFillStrong,
    inputFill: theme.colors.glassInputFill,
    tintColor: theme.colors.glassTint,
    border: theme.colors.glassBorder,
    borderSubtle: theme.colors.glassBorderSubtle,
    pressed: theme.colors.glassPressed,
    webBlur,
    inputWebBlur,
  };
}

export function liquidGlassBorder(theme: AatosTheme, subtle = false): ViewStyle {
  return {
    borderWidth: 1,
    borderColor: subtle ? theme.colors.glassBorderSubtle : theme.colors.glassBorder,
  };
}

export function liquidGlassElevation(
  theme: AatosTheme,
  level: LiquidGlassElevation = 'dock',
): ViewStyle {
  if (Platform.OS === 'web') {
    return {};
  }

  const presets =
    theme.mode === 'dark'
      ? {
          dock: { shadowOpacity: 0.34, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
          input: { shadowOpacity: 0.26, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
          card: { shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
          modal: { shadowOpacity: 0.42, shadowRadius: 28, shadowOffset: { width: 0, height: 14 } },
        }
      : {
          dock: { shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 7 } },
          input: { shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
          card: { shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
          modal: { shadowOpacity: 0.32, shadowRadius: 28, shadowOffset: { width: 0, height: 14 } },
        };

  return {
    shadowColor: theme.mode === 'dark' ? '#000000' : theme.colors.offBlack,
    ...presets[level],
    elevation: level === 'modal' ? 14 : level === 'dock' ? 10 : 6,
  };
}

export function liquidGlassElevationWeb(
  theme: AatosTheme,
  level: LiquidGlassElevation = 'dock',
): ViewStyle {
  if (Platform.OS !== 'web') return {};

  const light = {
    dock: '0 7px 24px rgba(37, 43, 47, 0.1), 0 2px 7px rgba(37, 43, 47, 0.06)',
    input: '0 3px 12px rgba(37, 43, 47, 0.07), 0 1px 3px rgba(37, 43, 47, 0.04)',
    card: '0 4px 16px rgba(37, 43, 47, 0.07), 0 1px 5px rgba(37, 43, 47, 0.05)',
    modal: '0 18px 52px rgba(0, 0, 0, 0.34), 0 6px 18px rgba(0, 0, 0, 0.2)',
  } as const;
  const dark = {
    dock: '0 10px 32px rgba(0, 0, 0, 0.34), 0 2px 10px rgba(0, 0, 0, 0.22)',
    input: '0 6px 18px rgba(0, 0, 0, 0.28), 0 1px 6px rgba(0, 0, 0, 0.18)',
    card: '0 8px 24px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
    modal: '0 18px 48px rgba(0, 0, 0, 0.42), 0 4px 16px rgba(0, 0, 0, 0.28)',
  } as const;

  return { boxShadow: theme.mode === 'dark' ? dark[level] : light[level] };
}
