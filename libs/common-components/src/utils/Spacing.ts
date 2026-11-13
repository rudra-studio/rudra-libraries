// Spacing.ts

import { CSSProperties } from '@emotion/react';

export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '2.5rem',
  xxl: '3rem',
} as const;

export type SpacingKey = keyof typeof spacing;

export const spacingStyles = (key: SpacingKey): CSSProperties => ({
  margin: spacing[key],
  padding: spacing[key],
});

export const useSpacing = (key: SpacingKey): CSSProperties => {
  return spacingStyles(key);
};