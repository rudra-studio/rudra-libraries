// utils/spacingTokens.ts

export const SPACING_UNIT = 8;

export const spacingTokens = {
  none: 0,
  xxs: SPACING_UNIT * 0.25,
  xs: SPACING_UNIT * 0.5,
  sm: SPACING_UNIT,
  md: SPACING_UNIT * 1.5,
  lg: SPACING_UNIT * 2,
  xl: SPACING_UNIT * 2.5,
  xxl: SPACING_UNIT * 3,
} as const;

export type SpacingToken = keyof typeof spacingTokens;