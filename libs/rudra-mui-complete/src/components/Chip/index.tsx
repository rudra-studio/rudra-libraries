import React from 'react';
import { Chip as MuiChip } from '@mui/material';
import styles from './styles.module.scss';

export interface ChipProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @select|filled|outlined */
  variant?: 'filled' | 'outlined';
  /** @select|default|primary|secondary|error|info|success|warning */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /** @schema {"type":"boolean"} */
  clickable?: boolean;
  /** @type|function */
  onClick?: () => void;
}

export function Chip({
  themeMode = 'dark',
  label = 'Tag',
  variant = 'filled',
  color = 'default',
  clickable = true,
  onClick,
}: ChipProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiChip
        label={label}
        variant={variant}
        color={color}
        clickable={clickable}
        onClick={() => onClick?.()}
      />
    </span>
  );
}
export default Chip;
