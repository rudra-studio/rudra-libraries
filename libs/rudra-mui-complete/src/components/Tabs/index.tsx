import React, { useState } from 'react';
import { Tabs as MuiTabs, Tab, Typography, Box } from '@mui/material';
import styles from './styles.module.scss';

export interface TabsEntry {
  id: string;
  label: string;
  content?: string;
}

export interface TabsProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|json */
  items?: TabsEntry[];
  /** @select|horizontal|vertical */
  orientation?: 'horizontal' | 'vertical';
  /** @select|standard|scrollable|fullWidth */
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  /** @type|function */
  onChange?: (index: number) => void;
}

const DEFAULT_TABS: TabsEntry[] = [
  { id: 'tab_1', label: 'Overview', content: 'Overview tab content.' },
  { id: 'tab_2', label: 'Details', content: 'Details tab content.' },
];

export function Tabs({
  themeMode = 'dark',
  items = DEFAULT_TABS,
  orientation = 'horizontal',
  variant = 'standard',
  onChange,
}: TabsProps) {
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_TABS;
  const [idx, setIdx] = useState(0);
  const current = list[idx] || list[0];

  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiTabs
        value={Math.min(idx, list.length - 1)}
        orientation={orientation}
        variant={variant}
        onChange={(_e, next) => {
          setIdx(next);
          onChange?.(next);
        }}
      >
        {list.map((item, i) => (
          <Tab key={item.id || i} label={item.label} />
        ))}
      </MuiTabs>
      {current?.content && (
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2">{current.content}</Typography>
        </Box>
      )}
    </div>
  );
}
export default Tabs;
