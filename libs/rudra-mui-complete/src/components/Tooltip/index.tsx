import React from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';
import styles from './styles.module.scss';

export interface TooltipProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  triggerText?: string;
  /** @select|top|bottom|left|right */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** @schema {"type":"boolean"} */
  arrow?: boolean;
}

export function Tooltip({
  themeMode = 'dark',
  title = 'Tooltip helper text',
  triggerText = 'Hover me',
  placement = 'top',
  arrow = true,
}: TooltipProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiTooltip title={title} placement={placement} arrow={arrow}>
        <span>{triggerText}</span>
      </MuiTooltip>
    </span>
  );
}
export default Tooltip;
