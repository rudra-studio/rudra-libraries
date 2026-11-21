import React from 'react';
import { Rating as MuiRating } from '@mui/material';
import styles from './styles.module.scss';

export interface RatingProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  value?: number;
  /** @schema {"type":"number"} */
  max?: number;
  /** @schema {"type":"number"} */
  precision?: number;
  /** @schema {"type":"boolean"} */
  readOnly?: boolean;
  /** @type|function */
  onChange?: (value: number | null) => void;
}

export function Rating({
  themeMode = 'dark',
  value = 4,
  max = 5,
  precision = 1,
  readOnly = false,
  onChange,
}: RatingProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiRating
        value={value}
        max={max}
        precision={precision}
        readOnly={readOnly}
        onChange={(_e, next) => onChange?.(next)}
      />
    </span>
  );
}
export default Rating;
