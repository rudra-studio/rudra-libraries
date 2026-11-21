import React from 'react';
import { Fab as MuiFab } from '@mui/material';
import styles from './styles.module.scss';

export interface FabProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @select|circular|extended */
  variant?: 'circular' | 'extended';
  /** @select|primary|secondary|success|error|info|warning */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /** @select|small|medium|large */
  size?: 'small' | 'medium' | 'large';
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onClick?: () => void;
}

export function Fab({
  themeMode = 'dark',
  label = '+',
  variant = 'circular',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
}: FabProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiFab
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        onClick={() => onClick?.()}
      >
        {label}
      </MuiFab>
    </span>
  );
}
export default Fab;
