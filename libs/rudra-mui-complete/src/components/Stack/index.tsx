import React from 'react';
import { Stack as MuiStack, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface StackProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|row|column */
  direction?: 'row' | 'column';
  /** @schema {"type":"number"} */
  spacing?: number;
  /** @type|json */
  items?: string[];
}

const DEFAULT_ITEMS = ['Item A', 'Item B'];

export function Stack({
  themeMode = 'dark',
  direction = 'row',
  spacing = 2,
  items = DEFAULT_ITEMS,
}: StackProps) {
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiStack direction={direction} spacing={spacing}>
        {list.map((label, idx) => (
          <Typography key={`${label}-${idx}`} variant="body2">
            {label}
          </Typography>
        ))}
      </MuiStack>
    </div>
  );
}
export default Stack;
