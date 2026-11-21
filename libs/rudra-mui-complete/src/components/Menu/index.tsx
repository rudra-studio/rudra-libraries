import React, { useState } from 'react';
import { Button, Menu as MuiMenu, MenuItem } from '@mui/material';
import styles from './styles.module.scss';

export interface MenuEntry {
  id: string;
  label: string;
}

export interface MenuProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  buttonLabel?: string;
  /** @type|json */
  items?: MenuEntry[];
  /** @type|function */
  onSelect?: (id: string) => void;
}

const DEFAULT_MENU: MenuEntry[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
];

export function Menu({
  themeMode = 'dark',
  buttonLabel = 'Menu',
  items = DEFAULT_MENU,
  onSelect,
}: MenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_MENU;

  return (
    <span data-theme={themeMode} className={styles.root}>
      <Button variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)}>
        {buttonLabel}
      </Button>
      <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {list.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              onSelect?.(item.id);
              setAnchorEl(null);
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </MuiMenu>
    </span>
  );
}
export default Menu;
