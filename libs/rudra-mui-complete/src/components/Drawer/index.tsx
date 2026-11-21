import React from 'react';
import { Drawer as MuiDrawer, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface DrawerProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"boolean"} */
  open?: boolean;
  /** @select|left|right|top|bottom */
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  /** @translate */
  title?: string;
  /** @translate */
  body?: string;
  /** @type|function */
  onClose?: () => void;
}

export function Drawer({
  themeMode = 'dark',
  open = false,
  anchor = 'left',
  title = 'Drawer Panel',
  body = 'Slide-out drawer content.',
  onClose,
}: DrawerProps) {
  return (
    <span data-theme={themeMode}>
      <MuiDrawer open={open} anchor={anchor} onClose={() => onClose?.()}>
        <div className={styles.panel}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {body}
          </Typography>
        </div>
      </MuiDrawer>
    </span>
  );
}
export default Drawer;
