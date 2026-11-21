import React from 'react';
import { Badge as MuiBadge } from '@mui/material';
import styles from './styles.module.scss';

export interface BadgeProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  badgeContent?: number;
  /** @translate */
  label?: string;
  /** @select|primary|secondary|error|info|success|warning */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export function Badge({
  themeMode = 'dark',
  badgeContent = 4,
  label = 'Updates',
  color = 'primary',
}: BadgeProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiBadge badgeContent={badgeContent} color={color}>
        <span style={{ padding: '4px 10px', fontSize: '0.875rem' }}>{label}</span>
      </MuiBadge>
    </span>
  );
}
export default Badge;
