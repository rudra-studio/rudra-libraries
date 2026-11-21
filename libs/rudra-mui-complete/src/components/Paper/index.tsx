import React from 'react';
import { Paper as MuiPaper, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface PaperProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  body?: string;
  /** @schema {"type":"number"} */
  elevation?: number;
  /** @select|elevation|outlined */
  variant?: 'elevation' | 'outlined';
  /** @schema {"type":"boolean"} */
  square?: boolean;
}

export function Paper({
  themeMode = 'dark',
  title = 'Surface Panel',
  body = 'Elevated surface content.',
  elevation = 2,
  variant = 'elevation',
  square = false,
}: PaperProps) {
  return (
    <div data-theme={themeMode}>
      <MuiPaper elevation={elevation} variant={variant} square={square} className={styles.root}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      </MuiPaper>
    </div>
  );
}
export default Paper;
