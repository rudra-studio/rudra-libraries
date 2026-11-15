import { css } from '@emotion/react';

// Framework-neutral design-token constants for typography
export const typographyTokens = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  lineHeight: {
    xs: '1.2',
    sm: '1.4',
    md: '1.6',
    lg: '1.8',
    xl: '2.0',
  },
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    info: '#17a2b8',
    warning: '#ffc107',
    danger: '#dc3545',
    light: '#f8f9fa',
    dark: '#343a40',
  },
};

// Helper function to generate typography styles based on tokens
export const generateTypographyStyles = (tokenKey: string, subKey?: string) => {
  const tokens = typographyTokens;
  const value = subKey ? tokens[tokenKey][subKey] : tokens[tokenKey];
  return css`
    font-family: ${tokens.fontFamily};
    font-size: ${value};
    font-weight: ${tokens.fontWeight.regular};
    line-height: ${tokens.lineHeight.md};
  `;
};

// Helper function to generate color styles based on tokens
export const generateColorStyles = (colorKey: string) => {
  const tokens = typographyTokens.colors;
  return css`
    color: ${tokens[colorKey]};
  `;
};