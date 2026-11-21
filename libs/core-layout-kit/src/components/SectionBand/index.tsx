import React from 'react';
import styles from './styles.module.scss';

export interface SectionBandProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|default|elevated|accent */
  surface?: 'default' | 'elevated' | 'accent';
  /** @translate */
  kicker?: string;
  /** @translate */
  title?: string;
  /** @translate */
  subtitle?: string;
  /** @nodeFunction */
  children?: React.ReactNode;
}

export function SectionBand({
  themeMode = 'dark',
  surface = 'default',
  kicker = '',
  title = '',
  subtitle = '',
  children,
}: SectionBandProps) {
  return (
    <section
      className={`${styles.band} ${styles[`mode_${themeMode}`] || styles.mode_dark} ${styles[`surface_${surface}`] || ''}`}
    >
      {(kicker || title || subtitle) && (
        <div className={styles.header}>
          {kicker && <span className={styles.kicker}>{kicker}</span>}
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
export default SectionBand;
