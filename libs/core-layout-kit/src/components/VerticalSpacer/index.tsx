import React from 'react';
import styles from './styles.module.scss';

export interface VerticalSpacerProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  height?: number;
}

export function VerticalSpacer({
  themeMode = 'dark',
  height = 24,
}: VerticalSpacerProps) {
  return (
    <div
      className={`${styles.spacer} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}
      style={{ height: `${Math.max(4, Number(height) || 24)}px` }}
      aria-hidden="true"
    />
  );
}
export default VerticalSpacer;
