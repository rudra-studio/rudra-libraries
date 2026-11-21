import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import styles from './styles.module.scss';

export interface SnackbarProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"boolean"} */
  open?: boolean;
  /** @translate */
  message?: string;
  /** @select|info|success|warning|error */
  severity?: 'info' | 'success' | 'warning' | 'error';
  /** @type|function */
  onClose?: () => void;
}

export function Snackbar({
  themeMode = 'dark',
  open = false,
  message = 'Saved successfully.',
  severity = 'success',
  onClose,
}: SnackbarProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiSnackbar open={open} autoHideDuration={4000} onClose={() => onClose?.()}>
        <Alert severity={severity} variant="filled" onClose={() => onClose?.()}>
          {message}
        </Alert>
      </MuiSnackbar>
    </span>
  );
}
export default Snackbar;
