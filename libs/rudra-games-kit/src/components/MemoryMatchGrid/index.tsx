import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface MemoryMatchGridProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|json */
  symbols?: string[];
}

const DEFAULT_SYMBOLS = ['⚡', '🚀', '🎯', '🎮'];

export function MemoryMatchGrid({ themeMode = 'dark', symbols = DEFAULT_SYMBOLS }: MemoryMatchGridProps) {
  const base = Array.isArray(symbols) && symbols.length >= 2 ? symbols : DEFAULT_SYMBOLS;
  const deck = [...base, ...base];
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const onCardClick = (idx: number) => {
    const sym = deck[idx];
    if (matched.includes(sym) || flipped.includes(idx) || flipped.length === 2) return;
    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);
    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextFlipped;
      if (deck[a] === deck[b]) {
        setMatched((prev) => [...prev, deck[a]]);
        setFlipped([]);
      } else {
        window.setTimeout(() => setFlipped([]), 650);
      }
    }
  };

  const reset = () => {
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div className={`${styles.wrap} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}>
      <div className={styles.top}>
        <span>
          Matched: {matched.length}/{base.length} • Moves: {moves}
        </span>
        <button type="button" className={styles.btn} onClick={reset}>
          Reset
        </button>
      </div>
      <div className={styles.grid}>
        {deck.map((sym, idx) => {
          const open = flipped.includes(idx) || matched.includes(sym);
          return (
            <button key={idx} type="button" className={styles.card} onClick={() => onCardClick(idx)}>
              {open ? sym : '?'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default MemoryMatchGrid;
