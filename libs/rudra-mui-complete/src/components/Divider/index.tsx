import React from 'react';
import { Divider as MuiDivider } from '@mui/material';
import styles from './styles.module.scss';

export interface DividerProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @select|horizontal|vertical */
  orientation?: 'horizontal' | 'vertical';
  /** @select|center|left|right */
  textAlign?: 'center' | 'left' | 'right';
}

export function Divider({
  themeMode = 'dark',
  label = '',
  orientation = 'horizontal',
  textAlign = 'center',
}: DividerProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiDivider orientation={orientation} textAlign={textAlign}>
        {label || undefined}
      </MuiDivider>
    </div>
  );
}
export default Divider;
