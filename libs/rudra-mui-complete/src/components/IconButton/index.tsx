import React from 'react';
import { IconButton as MuiIconButton } from '@mui/material';
import styles from './styles.module.scss';

export interface IconButtonProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  iconText?: string;
  /** @translate */
  ariaLabel?: string;
  /** @select|default|primary|secondary|error|info|success|warning */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /** @select|small|medium|large */
  size?: 'small' | 'medium' | 'large';
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onClick?: () => void;
}

export function IconButton({
  themeMode = 'dark',
  iconText = '★',
  ariaLabel = 'Action',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
}: IconButtonProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiIconButton
        color={color}
        size={size}
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={() => onClick?.()}
      >
        <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{iconText}</span>
      </MuiIconButton>
    </span>
  );
}
export default IconButton;
