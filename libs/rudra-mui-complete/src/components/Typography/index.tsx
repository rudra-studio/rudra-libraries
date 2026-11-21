import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import styles from './styles.module.scss';

export interface TypographyProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  text?: string;
  /** @select|h1|h2|h3|h4|h5|h6|subtitle1|subtitle2|body1|body2|caption */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption';
  /** @schema {"type":"boolean"} */
  gutterBottom?: boolean;
}

export function Typography({
  themeMode = 'dark',
  text = 'Typography Text',
  variant = 'body1',
  gutterBottom = false,
}: TypographyProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiTypography variant={variant} gutterBottom={gutterBottom}>
        {text}
      </MuiTypography>
    </span>
  );
}
export default Typography;
