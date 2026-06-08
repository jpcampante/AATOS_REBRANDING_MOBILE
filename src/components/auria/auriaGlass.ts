import { Platform, ViewStyle } from 'react-native';
import type { GlassColorScheme } from 'expo-glass-effect';
import { isGlassEffectAPIAvailable } from 'expo-glass-effect';
import type { ThemeMode } from '../../theme/aatosTheme';

export type AuriaGlassElevation = 'dock' | 'input' | 'card' | 'modal';

export type AuriaGlassTokens = {
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

/** iOS 26+ Liquid Glass via UIVisualEffectView (expo-glass-effect). */
export function isAuriaNativeGlassAvailable(): boolean {
  return Platform.OS === 'ios' && isGlassEffectAPIAvailable();
}

export function auriaGlassColorScheme(mode: ThemeMode): GlassColorScheme {
  return mode === 'dark' ? 'dark' : 'light';
}

export function auriaGlassTokens(mode: ThemeMode): AuriaGlassTokens {
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
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.78), 0 4px 14px rgba(37, 43, 47, 0.1), 0 1px 4px rgba(37, 43, 47, 0.06)',
        } as ViewStyle)
      : {};

  if (mode === 'dark') {
    return {
      fill: 'rgba(36, 40, 48, 0.62)',
      fillStrong: 'rgba(36, 40, 48, 0.78)',
      inputFill: 'rgba(255, 255, 255, 0.14)',
      tintColor: 'rgba(36, 40, 48, 0.72)',
      border: 'rgba(255, 255, 255, 0.28)',
      borderSubtle: 'rgba(255, 255, 255, 0.16)',
      pressed: 'rgba(255, 255, 255, 0.12)',
      webBlur,
      inputWebBlur,
    };
  }

  return {
    fill: 'rgba(255, 255, 255, 0.72)',
    fillStrong: 'rgba(255, 255, 255, 0.88)',
    inputFill: 'rgba(255, 255, 255, 0.62)',
    tintColor: 'rgba(255, 255, 255, 0.82)',
    border: 'rgba(21, 25, 28, 0.14)',
    borderSubtle: 'rgba(21, 25, 28, 0.09)',
    pressed: 'rgba(21, 25, 28, 0.07)',
    webBlur,
    inputWebBlur,
  };
}

export function auriaGlassBorder(mode: ThemeMode, subtle = false): ViewStyle {
  const glass = auriaGlassTokens(mode);
  return {
    borderWidth: 1,
    borderColor: subtle ? glass.borderSubtle : glass.border,
  };
}

/** Adaptive drop shadow below floating glass surfaces (Apple HIG: depth via shadow, not opacity on glass). */
export function auriaGlassElevation(
  mode: ThemeMode,
  level: AuriaGlassElevation = 'dock',
): ViewStyle {
  if (mode === 'dark') {
    const dark = {
      dock: { shadowOpacity: 0.34, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
      input: { shadowOpacity: 0.26, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      card: { shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
      modal: { shadowOpacity: 0.42, shadowRadius: 28, shadowOffset: { width: 0, height: 14 } },
    } as const;

    const preset = dark[level];
    return {
      shadowColor: '#000000',
      ...preset,
      elevation: level === 'modal' ? 14 : level === 'dock' ? 10 : 6,
    };
  }

  const light = {
    dock: { shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 7 } },
    input: { shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
    card: { shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    modal: { shadowOpacity: 0.18, shadowRadius: 26, shadowOffset: { width: 0, height: 12 } },
  } as const;

  const preset = light[level];
  return {
    shadowColor: '#252B2F',
    ...preset,
    elevation: level === 'modal' ? 14 : level === 'dock' ? 10 : 6,
  };
}

export function auriaGlassElevationWeb(
  mode: ThemeMode,
  level: AuriaGlassElevation = 'dock',
): ViewStyle {
  if (Platform.OS !== 'web') return {};

  const light = {
    dock: '0 7px 24px rgba(37, 43, 47, 0.1), 0 2px 7px rgba(37, 43, 47, 0.06)',
    input: '0 3px 12px rgba(37, 43, 47, 0.07), 0 1px 3px rgba(37, 43, 47, 0.04)',
    card: '0 4px 16px rgba(37, 43, 47, 0.07), 0 1px 5px rgba(37, 43, 47, 0.05)',
    modal: '0 16px 44px rgba(37, 43, 47, 0.18), 0 4px 14px rgba(37, 43, 47, 0.1)',
  } as const;

  const dark = {
    dock: '0 10px 32px rgba(0, 0, 0, 0.34), 0 2px 10px rgba(0, 0, 0, 0.22)',
    input: '0 6px 18px rgba(0, 0, 0, 0.28), 0 1px 6px rgba(0, 0, 0, 0.18)',
    card: '0 8px 24px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
    modal: '0 18px 48px rgba(0, 0, 0, 0.42), 0 4px 16px rgba(0, 0, 0, 0.28)',
  } as const;

  return {
    boxShadow: mode === 'dark' ? dark[level] : light[level],
  };
}
