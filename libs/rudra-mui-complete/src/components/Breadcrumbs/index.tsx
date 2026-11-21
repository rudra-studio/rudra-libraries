import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|json */
  items?: BreadcrumbEntry[];
  /** @translate */
  separator?: string;
}

const DEFAULT_ITEMS: BreadcrumbEntry[] = [
  { label: 'Home', href: '#' },
  { label: 'Library', href: '#' },
  { label: 'Components' },
];

export function Breadcrumbs({
  themeMode = 'dark',
  items = DEFAULT_ITEMS,
  separator = '/',
}: BreadcrumbsProps) {
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiBreadcrumbs separator={separator} aria-label="breadcrumb">
        {list.map((item, idx) =>
          item.href ? (
            <a key={`${item.label}-${idx}`} href={item.href} style={{ color: 'inherit', textDecoration: 'none' }}>
              {item.label}
            </a>
          ) : (
            <Typography key={`${item.label}-${idx}`} color="text.primary" variant="body2">
              {item.label}
            </Typography>
          )
        )}
      </MuiBreadcrumbs>
    </div>
  );
}
export default Breadcrumbs;
