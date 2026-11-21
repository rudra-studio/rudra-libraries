import React from 'react';
import { Box as MuiBox, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface BoxProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  text?: string;
  /** @schema {"type":"number"} */
  p?: number;
}

export function Box({
  themeMode = 'dark',
  text = 'MUI Box container',
  p = 2,
}: BoxProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiBox sx={{ p }}>
        <Typography variant="body2">{text}</Typography>
      </MuiBox>
    </div>
  );
}
export default Box;
