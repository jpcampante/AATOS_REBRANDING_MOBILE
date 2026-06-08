/** Auria design tokens — warm light palette (from web-reference). */
/** Surfaces use thin border + fill only — no drop shadows. */
export const DS = {
  pageSurface: '#FAFAF9',
  white: '#FFFFFF',
  gray900: '#15191C',
  gray800: '#252421',
  gray700: '#393833',
  gray600: '#55534E',
  gray500: '#77756F',
  gray400: '#A8A6A0',
  gray100: '#F2F2F0',
  gray50: '#FAFAF9',
  gray200: '#E8E7E3',
  gray300: '#D5D3CE',
  inputFill: '#F1F1EF',
  inputFillHover: '#EBEBE8',
  sectionFill: '#F7F7F7',
  btnPrimary: '#252B2F',
  btnPrimaryHover: '#393833',
  danger: '#DC2626',
  dangerSurface: '#FEF2F2',
  positive: '#2CB34A',
  auriaBlue: '#2B7CD8',
  composerShadow: 'none',
  composerBorderRest: 'transparent',
  composerBorderFocus: 'transparent',
  composerBgFocus: '#FFFFFF',
  shadowSm: 'none',
  shadowMd: 'none',
  menuRing: '0 0 0 1px rgba(21,25,28,0.12)',
  menuShadow: '0 0 0 1px rgba(21,25,28,0.12)',
  menuBorderColor: 'rgba(21,25,28,0.14)',
  suggestionLine: 'rgba(21,25,28,0.07)',
  submitComposer: '#C8C8C4',
  submitComposerHover: '#B5B5B0',
} as const;

/** Semantic aliases for screens and components. */
export const C = {
  bg: DS.white,
  text: DS.gray900,
  muted: DS.gray500,
  surface: DS.inputFill,
  section: DS.sectionFill,
  border: DS.menuBorderColor,
  rail: DS.white,
  panel: DS.gray50,
  sidebarBg: DS.white,
} as const;

/** React Native hairline border — replaces web box-shadow rings. */
export const hairlineBorder = {
  borderWidth: 1,
  borderColor: DS.menuBorderColor,
} as const;

export type AuriaDesignTokens = typeof DS;
