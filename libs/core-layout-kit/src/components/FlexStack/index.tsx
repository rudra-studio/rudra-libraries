import React from 'react';
import styles from './styles.module.scss';

export interface FlexStackProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|row|column */
  direction?: 'row' | 'column';
  /** @schema {"type":"number"} */
  gap?: number;
  /** @schema {"type":"boolean"} */
  wrap?: boolean;
  /** @nodeFunction */
  children?: React.ReactNode;
}

export function FlexStack({
  themeMode = 'dark',
  direction = 'row',
  gap = 12,
  wrap = true,
  children,
}: FlexStackProps) {
  return (
    <div
      className={`${styles.stack} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}
      style={{
        flexDirection: direction,
        gap: `${Number(gap) || 12}px`,
        flexWrap: wrap ? 'wrap' : 'nowrap',
      }}
    >
      {children}
    </div>
  );
}
export default FlexStack;
