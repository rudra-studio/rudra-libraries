import React, { useState } from 'react';
import { Pagination as MuiPagination } from '@mui/material';
import styles from './styles.module.scss';

export interface PaginationProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  count?: number;
  /** @schema {"type":"number"} */
  page?: number;
  /** @select|circular|rounded */
  shape?: 'circular' | 'rounded';
  /** @type|function */
  onChange?: (page: number) => void;
}

export function Pagination({
  themeMode = 'dark',
  count = 5,
  page = 1,
  shape = 'rounded',
  onChange,
}: PaginationProps) {
  const [current, setCurrent] = useState(page);

  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiPagination
        count={Math.max(1, count)}
        page={current}
        shape={shape}
        onChange={(_e, next) => {
          setCurrent(next);
          onChange?.(next);
        }}
      />
    </div>
  );
}
export default Pagination;
