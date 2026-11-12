// Typography.ts

export const Typography = {
  fontSize: {
    small: '12px',
    medium: '16px',
    large: '20px',
  },
  fontFamily: {
    primary: 'Arial, sans-serif',
    secondary: 'Georgia, serif',
  },
  color: {
    primary: '#333333',
    secondary: '#666666',
    accent: '#007bff',
  },
  lineHeight: {
    normal: '1.5',
    tight: '1.2',
    loose: '2',
  },
};

export type TypographyKeys = keyof typeof Typography;

export function getFontSize(key: TypographyKeys): string {
  return Typography.fontSize[key];
}

export function getFontFamily(key: TypographyKeys): string {
  return Typography.fontFamily[key];
}

export function getColor(key: TypographyKeys): string {
  return Typography.color[key];
}

export function getLineHeight(key: TypographyKeys): string {
  return Typography.lineHeight[key];
}