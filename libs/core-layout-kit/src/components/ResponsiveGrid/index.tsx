import React from 'react';
import styles from './styles.module.scss';

export interface ResponsiveGridProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  columns?: number;
  /** @schema {"type":"number"} */
  gap?: number;
  /** @nodeFunction */
  children?: React.ReactNode;
}

export function ResponsiveGrid({
  themeMode = 'dark',
  columns = 3,
  gap = 16,
  children,
}: ResponsiveGridProps) {
  const cols = Math.max(1, Math.min(6, Number(columns) || 3));
  return (
    <div
      className={`${styles.grid} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 1 ? '260px' : cols === 2 ? '280px' : '230px'}, 1fr))`,
        gap: `${Number(gap) || 16}px`,
      }}
    >
      {children}
    </div>
  );
}
export default ResponsiveGrid;
