import React from 'react';
import { Alert as MuiAlert, AlertTitle } from '@mui/material';
import styles from './styles.module.scss';

export interface AlertProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  message?: string;
  /** @select|info|success|warning|error */
  severity?: 'info' | 'success' | 'warning' | 'error';
  /** @select|standard|filled|outlined */
  variant?: 'standard' | 'filled' | 'outlined';
}

export function Alert({
  themeMode = 'dark',
  title = 'Notice',
  message = 'Alert message content.',
  severity = 'info',
  variant = 'standard',
}: AlertProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiAlert severity={severity} variant={variant}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </MuiAlert>
    </div>
  );
}
export default Alert;
