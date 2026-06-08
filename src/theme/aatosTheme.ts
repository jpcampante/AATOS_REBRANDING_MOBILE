import { ViewStyle } from 'react-native';
import { radius, spacing } from './spacing';
import { typography } from './typography';

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  page: string;
  surface: string;
  sidebar: string;
  hover: string;
  input: string;
  headerGlass: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textHint: string;
  border: string;
  borderInput: string;
  divider: string;
  accent: string;
  accentBg: string;
  accentHover: string;
  pill: string;
  pillText: string;
  success: string;
  error: string;
  onAccent: string;
  heroShell: string;
  heroSearchBg: string;
  filterBarBg: string;
  navRail: string;
  navActiveSurface: string;
  chipSurface: string;
  submitComposer: string;
  statusBar: 'light' | 'dark';
  offBlack: string;
  offBlackSoft: string;
  offBlackOverlay: string;
  auriaBlue: string;
};

export type ThemeShadows = {
  card: ViewStyle;
  navActive: ViewStyle;
  heroSearch: ViewStyle;
};

export type AatosTheme = {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadow: ThemeShadows;
};

const lightColors: ThemeColors = {
  page: '#FAFAF9',
  surface: '#FFFFFF',
  sidebar: '#FFFFFF',
  hover: '#F2F2F0',
  input: '#F1F1EF',
  headerGlass: 'rgba(250, 250, 249, 0.82)',
  text: '#15191C',
  textSecondary: '#55534E',
  textTertiary: '#77756F',
  textHint: '#A8A6A0',
  border: 'rgba(21, 25, 28, 0.14)',
  borderInput: '#D5D3CE',
  divider: '#E8E7E3',
  accent: '#252B2F',
  accentBg: '#F2F2F0',
  accentHover: '#393833',
  pill: '#E8E7E3',
  pillText: '#15191C',
  success: '#2CB34A',
  error: '#DC2626',
  onAccent: '#FFFFFF',
  heroShell: '#D4EDFC',
  heroSearchBg: '#FFFFFF',
  filterBarBg: '#F1F1EF',
  navRail: '#F2F2F0',
  navActiveSurface: '#FFFFFF',
  chipSurface: 'rgba(255, 255, 255, 0.75)',
  submitComposer: '#C8C8C4',
  statusBar: 'dark',
  offBlack: '#252B2F',
  offBlackSoft: '#393833',
  offBlackOverlay: 'rgba(37, 43, 47, 0.52)',
  auriaBlue: '#2B7CD8',
};

const darkColors: ThemeColors = {
  page: '#111318',
  surface: '#1E2128',
  sidebar: '#1A1D24',
  hover: '#262A33',
  input: '#262A33',
  headerGlass: 'rgba(17, 19, 24, 0.82)',
  text: '#E3E3E3',
  textSecondary: '#C4C6D0',
  textTertiary: '#8E9099',
  textHint: '#6B6F76',
  border: 'rgba(68, 71, 79, 0.65)',
  borderInput: '#3D4149',
  divider: '#2D3139',
  accent: '#6BA8FF',
  accentBg: '#123D72',
  accentHover: '#85B8FF',
  pill: '#1565C0',
  pillText: '#E8F2FF',
  success: '#4ADE80',
  error: '#FFB4AB',
  onAccent: '#102851',
  heroShell: '#152238',
  heroSearchBg: '#262A33',
  filterBarBg: '#262A33',
  navRail: '#262A33',
  navActiveSurface: '#1E2128',
  chipSurface: 'rgba(30, 33, 40, 0.85)',
  submitComposer: '#55534E',
  statusBar: 'light',
  offBlack: '#C4C6D0',
  offBlackSoft: '#8E9099',
  offBlackOverlay: 'rgba(10, 12, 16, 0.62)',
  auriaBlue: '#6BA8FF',
};

const lightShadow: ThemeShadows = {
  card: {
    shadowColor: '#252B2F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  navActive: {
    shadowColor: '#252B2F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroSearch: {
    shadowColor: '#252B2F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
};

const darkShadow: ThemeShadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
  },
  navActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  heroSearch: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
};

export const lightTheme: AatosTheme = {
  mode: 'light',
  colors: lightColors,
  spacing,
  radius,
  typography,
  shadow: lightShadow,
};

export const darkTheme: AatosTheme = {
  mode: 'dark',
  colors: darkColors,
  spacing,
  radius,
  typography,
  shadow: darkShadow,
};

export function insightsFromTheme(theme: AatosTheme) {
  return {
    surface: theme.colors.surface,
    page: theme.colors.page,
    hover: theme.colors.hover,
    text: theme.colors.text,
    textMuted: theme.colors.textSecondary,
    textHint: theme.colors.textHint,
    border: theme.colors.border,
    divider: theme.colors.divider,
    accent: theme.colors.accent,
    accentBg: theme.colors.accentBg,
    heroShell: theme.colors.heroShell,
    heroSearchBg: theme.colors.heroSearchBg,
    filterBarBg: theme.colors.filterBarBg,
    positive: theme.colors.success,
  } as const;
}

export function dsFromTheme(theme: AatosTheme) {
  const c = theme.colors;
  return {
    pageSurface: c.page,
    white: c.surface,
    gray900: c.text,
    gray800: theme.mode === 'light' ? '#252421' : '#E3E3E3',
    gray700: theme.mode === 'light' ? '#393833' : '#C4C6D0',
    gray600: c.textSecondary,
    gray500: c.textTertiary,
    gray400: c.textHint,
    gray100: c.hover,
    gray50: c.page,
    gray200: c.divider,
    gray300: c.borderInput,
    inputFill: c.input,
    inputFillHover: c.hover,
    sectionFill: c.hover,
    btnPrimary: c.accent,
    btnPrimaryHover: c.accentHover,
    offBlack: c.offBlack,
    offBlackSoft: c.offBlackSoft,
    offBlackOverlay: c.offBlackOverlay,
    auriaBlue: c.auriaBlue,
    danger: c.error,
    dangerSurface: theme.mode === 'light' ? '#FEF2F2' : '#3A2020',
    positive: c.success,
    submitComposer: c.submitComposer,
    menuBorderColor: c.border,
  } as const;
}
