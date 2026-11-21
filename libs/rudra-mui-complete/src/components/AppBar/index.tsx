import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface AppBarProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  subtitle?: string;
  /** @select|fixed|absolute|sticky|static|relative */
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
}

export function AppBar({
  themeMode = 'dark',
  title = 'Application Header',
  subtitle = '',
  position = 'static',
}: AppBarProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiAppBar position={position} color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Toolbar>
      </MuiAppBar>
    </div>
  );
}
export default AppBar;
