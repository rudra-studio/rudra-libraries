import React from 'react';
import type { CoreFeatureCardItem } from '../../utils/CoreFeatureCardItem';
import styles from './styles.module.scss';

interface FeatureCardGridProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  kicker?: string;
  /** @translate */
  heading?: string;
  /** @translate */
  subheading?: string;
  /** @type|json */
  items?: CoreFeatureCardItem[];
  /** @type|function */
  onCardAction?: (item: CoreFeatureCardItem) => void;
}

const DEFAULT_FEATURES: CoreFeatureCardItem[] = [
  {
    id: 'invites',
    icon: '💌',
    badge: 'Events',
    title: 'Weddings, Birthdays & Invites',
    description: 'Build shareable celebration pages with countdowns, event details, themes, and optional RSVP tracking.',
    actionLabel: 'Open Invite Studio',
  },
  {
    id: 'proposals',
    icon: '💘',
    badge: 'Romance',
    title: 'Interactive Love Proposals',
    description: 'Share personal letters, Polaroid photos, floating hearts, and playful runaway buttons.',
    actionLabel: 'Try Proposal',
  },
  {
    id: 'canvas',
    icon: '🎨',
    badge: 'No-Code',
    title: 'Drag-and-Drop Canvas & i18n',
    description: 'Arrange widgets, switch languages live, and add looping YouTube songs or story animations.',
    actionLabel: 'Open Canvas',
  },
];

function FeatureCardGrid({
  themeMode = 'light',
  kicker = 'WHAT SMILEYYFY IS ABOUT',
  heading = 'Everything You Need for Memorable Pages',
  subheading = 'Compose modular sections for event invitations, romantic proposals, and milestone celebrations.',
  items = DEFAULT_FEATURES,
  onCardAction,
}: FeatureCardGridProps) {
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_FEATURES;

  return (
    <section className={`${styles.section} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.head}>
        {kicker && <span className={styles.kicker}>{kicker}</span>}
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {subheading && <p className={styles.sub}>{subheading}</p>}
      </div>

      <div className={styles.grid}>
        {list.map((item) => (
          <article key={item.id} className={styles.card}>
            <div className={styles.topRow}>
              {item.icon && (
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
            {item.actionLabel && (
              <button type="button" className={styles.cardBtn} onClick={() => onCardAction?.(item)}>
                {item.actionLabel} →
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeatureCardGrid;
