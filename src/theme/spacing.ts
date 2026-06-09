/** Spacing and radii aligned with the AATOS and Auria web design system. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  card: 16,
  panel: 28,
  hero: 24,
  pill: 999,
} as const;

export type Spacing = typeof spacing;
export type Radius = typeof radius;
