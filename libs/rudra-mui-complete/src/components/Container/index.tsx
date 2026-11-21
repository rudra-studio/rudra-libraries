import React from 'react';
import { Container as MuiContainer, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface ContainerProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  text?: string;
  /** @select|xs|sm|md|lg|xl */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** @schema {"type":"boolean"} */
  disableGutters?: boolean;
}

export function Container({
  themeMode = 'dark',
  text = 'MUI Container wrapper',
  maxWidth = 'lg',
  disableGutters = false,
}: ContainerProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiContainer maxWidth={maxWidth} disableGutters={disableGutters}>
        <Typography variant="body2">{text}</Typography>
      </MuiContainer>
    </div>
  );
}
export default Container;
