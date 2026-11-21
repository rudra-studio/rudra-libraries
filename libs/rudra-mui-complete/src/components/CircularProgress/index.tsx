import React from 'react';
import { CircularProgress as MuiCircularProgress } from '@mui/material';
import styles from './styles.module.scss';

export interface CircularProgressProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  size?: number;
  /** @select|primary|secondary|error|info|success|warning */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export function CircularProgress({
  themeMode = 'dark',
  size = 36,
  color = 'primary',
}: CircularProgressProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiCircularProgress size={size} color={color} />
    </span>
  );
}
export default CircularProgress;
