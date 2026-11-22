import React from 'react';
import type { CoreNavItem } from '../../utils/CoreNavItem';
import styles from './styles.module.scss';

interface CoreNavbarProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  brandName?: string;
  /** @translate */
  tagline?: string;
  /** @translate */
  brandMark?: string;
  /** @type|json */
  navItems?: CoreNavItem[];
  /** @type|string */
  activeItemId?: string;
  /** @type|function */
  onSelectItem?: (itemId: string) => void;
  /** @type|function */
  onToggleTheme?: (nextTheme: 'light' | 'dark') => void;
}

const DEFAULT_NAV_ITEMS: CoreNavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'What It Does' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'templates', label: 'Templates' },
];

function CoreNavbar({
  themeMode = 'light',
  brandName = 'Smileyyfy',
  tagline = 'Invites, Proposals & Joyful Moments',
  brandMark = '😊',
  navItems = DEFAULT_NAV_ITEMS,
  activeItemId = 'overview',
  onSelectItem,
  onToggleTheme,
}: CoreNavbarProps) {
  const items = Array.isArray(navItems) && navItems.length > 0 ? navItems : DEFAULT_NAV_ITEMS;
  const nextTheme: 'light' | 'dark' = themeMode === 'dark' ? 'light' : 'dark';

  return (
    <header className={`${styles.bar} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">
          {brandMark}
        </span>
        <div>
          <div className={styles.brandName}>{brandName}</div>
          {tagline && <div className={styles.tagline}>{tagline}</div>}
        </div>
      </div>

      <nav className={styles.nav} aria-label="Primary navigation">
        {items.map((item) => {
          const isActive = activeItemId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={`${styles.navBtn} ${isActive ? styles.activeBtn : ''}`}
              onClick={() => onSelectItem?.(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {onToggleTheme && (
        <button
          type="button"
          className={styles.themeBtn}
          aria-label={`Switch to ${nextTheme} mode`}
          onClick={() => onToggleTheme(nextTheme)}
        >
          {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      )}
    </header>
  );
}

export default CoreNavbar;
