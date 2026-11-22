import React from 'react';
import styles from './styles.module.scss';

export interface SmileyyfyNavbarProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  brandName?: string;
  /** @translate */
  tagline?: string;
  /** @select|hub|invites|proposal|occasions */
  activeTab?: 'hub' | 'invites' | 'proposal' | 'occasions';
  /** @type|function */
  onNavigate?: (tab: string) => void;
  /** @type|function */
  onToggleTheme?: (nextTheme: 'light' | 'dark') => void;
}

const NAV_ITEMS = [
  { id: 'hub', label: '✨ Studio Hub' },
  { id: 'invites', label: '💌 Event Invites' },
  { id: 'proposal', label: '💖 Love Proposal' },
  { id: 'occasions', label: '🎉 Occasions' },
];

export function SmileyyfyNavbar({
  themeMode = 'light',
  brandName = 'Smileyyfy',
  tagline = 'Invites, Proposals & Joyful Moments',
  activeTab = 'hub',
  onNavigate,
  onToggleTheme,
}: SmileyyfyNavbarProps) {
  const nextTheme: 'light' | 'dark' = themeMode === 'dark' ? 'light' : 'dark';

  return (
    <header className={`${styles.nav} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.brand}>
        <span className={styles.logoMark} aria-hidden="true">
          😊
        </span>
        <div>
          <div className={styles.brandName}>{brandName}</div>
          <div className={styles.tagline}>{tagline}</div>
        </div>
      </div>

      <nav className={styles.links} aria-label="Smileyyfy navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={`${styles.navBtn} ${isActive ? styles.activeBtn : ''}`}
              onClick={() => onNavigate?.(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className={styles.themeBtn}
        aria-label={`Switch to ${nextTheme} mode`}
        onClick={() => onToggleTheme?.(nextTheme)}
      >
        {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}

export default SmileyyfyNavbar;
