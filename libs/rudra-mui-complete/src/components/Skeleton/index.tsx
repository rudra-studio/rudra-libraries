import React from 'react';
import { Skeleton as MuiSkeleton } from '@mui/material';
import styles from './styles.module.scss';

export interface SkeletonProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|text|rectangular|rounded|circular */
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  /** @schema {"type":"number"} */
  width?: number;
  /** @schema {"type":"number"} */
  height?: number;
}

export function Skeleton({
  themeMode = 'dark',
  variant = 'rectangular',
  width = 220,
  height = 80,
}: SkeletonProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiSkeleton variant={variant} width={width} height={height} />
    </span>
  );
}
export default Skeleton;
