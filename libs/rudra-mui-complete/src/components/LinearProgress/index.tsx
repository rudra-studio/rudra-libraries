import React from 'react';
import { LinearProgress as MuiLinearProgress } from '@mui/material';
import styles from './styles.module.scss';

export interface LinearProgressProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  value?: number;
  /** @select|primary|secondary|error|info|success|warning */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export function LinearProgress({
  themeMode = 'dark',
  value = 60,
  color = 'primary',
}: LinearProgressProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiLinearProgress variant="determinate" value={value} color={color} />
    </div>
  );
}
export default LinearProgress;
