import React from 'react';
import { Backdrop as MuiBackdrop, CircularProgress } from '@mui/material';
import styles from './styles.module.scss';

export interface BackdropProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"boolean"} */
  open?: boolean;
  /** @schema {"type":"boolean"} */
  invisible?: boolean;
  /** @type|function */
  onClick?: () => void;
}

export function Backdrop({
  themeMode = 'dark',
  open = false,
  invisible = false,
  onClick,
}: BackdropProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiBackdrop open={open} invisible={invisible} onClick={() => onClick?.()}>
        <CircularProgress color="inherit" />
      </MuiBackdrop>
    </span>
  );
}
export default Backdrop;
