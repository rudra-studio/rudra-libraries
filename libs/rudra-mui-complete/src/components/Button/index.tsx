import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import styles from './styles.module.scss';

export interface ButtonProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @select|contained|outlined|text */
  variant?: 'contained' | 'outlined' | 'text';
  /** @select|primary|secondary|success|error|warning|info */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  /** @select|small|medium|large */
  size?: 'small' | 'medium' | 'large';
  /** @schema {"type":"boolean"} */
  loading?: boolean;
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onClick?: () => void;
}

export function Button({
  themeMode = 'dark',
  label = 'Submit',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiButton
        variant={variant}
        color={color}
        size={size}
        disabled={disabled || loading}
        onClick={() => onClick?.()}
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
      >
        {label}
      </MuiButton>
    </span>
  );
}
export default Button;
