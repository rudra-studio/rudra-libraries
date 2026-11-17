// constants.ts

import { css } from 'styled-components';

// Export only framework-neutral utility-owned constants, types, and functions.

// Example constants
export const SPACE_TOKENS = {
  micro: '0.5rem',
  small: '1rem',
  medium: '1.5rem',
  large: '2rem',
  xlarge: '3rem',
} as const;

// Example types
type SpaceToken = keyof typeof SPACE_TOKENS;

// Example utility function
const createSpacingStyle = (token: SpaceToken) => {
  return css`
    margin: ${SPACE_TOKENS[token]};
  `;
};

// Export utility functions
export { createSpacingStyle };