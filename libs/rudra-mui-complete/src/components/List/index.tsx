import React from 'react';
import { List as MuiList, ListItem, ListItemText } from '@mui/material';
import styles from './styles.module.scss';

export interface ListEntry {
  id: string;
  primary: string;
  secondary?: string;
}

export interface ListProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|json */
  items?: ListEntry[];
}

const DEFAULT_LIST: ListEntry[] = [
  { id: '1', primary: 'First Item', secondary: 'Supporting text' },
  { id: '2', primary: 'Second Item', secondary: 'Additional detail' },
];

export function List({
  themeMode = 'dark',
  items = DEFAULT_LIST,
}: ListProps) {
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_LIST;

  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiList dense>
        {list.map((entry, idx) => (
          <ListItem key={entry.id || idx}>
            <ListItemText primary={entry.primary} secondary={entry.secondary} />
          </ListItem>
        ))}
      </MuiList>
    </div>
  );
}
export default List;
