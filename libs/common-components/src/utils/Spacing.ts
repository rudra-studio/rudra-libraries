export const spacingTokens = {
  small: '8px',
  medium: '16px',
  large: '24px',
  xlarge: '32px',
};

export type SpacingValue = 'small' | 'medium' | 'large' | 'xlarge';

export const getSpacing = (value: SpacingValue): string => spacingTokens[value];

export const applySpacing = (value: SpacingValue, property: string): string => `${property}: ${getSpacing(value)};`