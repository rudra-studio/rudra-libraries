import React from 'react';
import styles from './styles.module.scss';

export interface LayoutContainerProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"string"} */
  maxWidth?: string;
  /** @schema {"type":"string"} */
  padding?: string;
  /** @nodeFunction */
  children?: React.ReactNode;
}

export function LayoutContainer({
  themeMode = 'dark',
  maxWidth = '1160px',
  padding = '0 20px',
  children,
}: LayoutContainerProps) {
  return (
    <div
      className={`${styles.container} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}
      style={{ maxWidth, padding }}
    >
      {children}
    </div>
  );
}
export default LayoutContainer;
