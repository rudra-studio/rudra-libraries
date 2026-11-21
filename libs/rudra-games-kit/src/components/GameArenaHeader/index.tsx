import React from 'react';
import styles from './styles.module.scss';

export interface GameArenaHeaderProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  statusText?: string;
  /** @translate */
  scoreText?: string;
  /** @translate */
  resetLabel?: string;
  /** @type|function */
  onReset?: () => void;
}

export function GameArenaHeader({
  themeMode = 'dark',
  title = 'Connect Four Arena',
  statusText = 'Player 1 Turn',
  scoreText = 'Moves: 0',
  resetLabel = 'New Game',
  onReset,
}: GameArenaHeaderProps) {
  return (
    <div className={`${styles.bar} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.status}>{statusText}</div>
      </div>
      <div className={styles.right}>
        <span className={styles.score}>{scoreText}</span>
        <button type="button" className={styles.btn} onClick={() => onReset?.()}>
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
export default GameArenaHeader;
