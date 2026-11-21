import React from 'react';
import { Grid as MuiGrid, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface GridProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  spacing?: number;
  /** @type|json */
  items?: string[];
}

const DEFAULT_ITEMS = ['Cell 1', 'Cell 2', 'Cell 3'];

export function Grid({
  themeMode = 'dark',
  spacing = 2,
  items = DEFAULT_ITEMS,
}: GridProps) {
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiGrid container spacing={spacing}>
        {list.map((text, i) => (
          <MuiGrid key={`${text}-${i}`} size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="body2">{text}</Typography>
          </MuiGrid>
        ))}
      </MuiGrid>
    </div>
  );
}
export default Grid;
