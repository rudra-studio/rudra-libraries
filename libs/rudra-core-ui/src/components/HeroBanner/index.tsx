import React from 'react';
import styles from './styles.module.scss';

interface HeroBannerProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|center|split */
  layout?: 'center' | 'split';
  /** @translate */
  badge?: string;
  /** @translate */
  title?: string;
  /** @translate */
  description?: string;
  /** @translate */
  primaryActionLabel?: string;
  /** @translate */
  secondaryActionLabel?: string;
  /** @type|function */
  onPrimaryAction?: () => void;
  /** @type|function */
  onSecondaryAction?: () => void;
}

function HeroBanner({
  themeMode = 'light',
  layout = 'split',
  badge = '✨ Interactive Celebration Studio',
  title = 'Create Wedding Invites, Love Proposals & Joyful Websites',
  description = 'Design expressive event invitations with optional RSVP tracking, romantic proposal pages with floating hearts & flying buttons, and multilingual celebration pages without coding.',
  primaryActionLabel = 'Start Building',
  secondaryActionLabel = 'Browse Templates',
  onPrimaryAction,
  onSecondaryAction,
}: HeroBannerProps) {
  return (
    <section
      className={`${styles.banner} ${styles[`mode_${themeMode}`] || styles.mode_light} ${
        styles[`lay_${layout}`] || styles.lay_split
      }`}
    >
      <div className={styles.copy}>
        {badge && <span className={styles.badge}>{badge}</span>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}

        {(primaryActionLabel || secondaryActionLabel) && (
          <div className={styles.actions}>
            {primaryActionLabel && (
              <button type="button" className={styles.primaryBtn} onClick={() => onPrimaryAction?.()}>
                {primaryActionLabel}
              </button>
            )}
            {secondaryActionLabel && (
              <button type="button" className={styles.secondaryBtn} onClick={() => onSecondaryAction?.()}>
                {secondaryActionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroBanner;
