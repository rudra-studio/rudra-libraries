import { css } from 'styled-components';

export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
  },
  fonts: {
    primary: 'Arial, sans-serif',
    secondary: 'Helvetica, sans-serif',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};

export const breakpoints = {
  mobile: '576px',
  tablet: '768px',
  laptop: '992px',
  desktop: '1200px',
};

export const mediaQuery = (breakpoint: string) => css`
  @media (max-width: ${breakpoint}) {
    ${css}
  }
`;