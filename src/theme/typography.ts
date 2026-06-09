/** Mobile typography scale using the web `--t-font-size` 14px base. */
export const typography = {
  fontSize: {
    xs: 11,
    sm: 12,
    md: 13,
    base: 14,
    lg: 15,
    xl: 17,
    xxl: 22,
    display: 28,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  letterSpacing: {
    tight: -0.4,
    snug: -0.3,
    label: 0.6,
  },
} as const;

export type Typography = typeof typography;
