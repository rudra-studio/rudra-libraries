import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface NumberSlideBoardProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
}

const INITIAL_TILES = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export function NumberSlideBoard({ themeMode = 'dark' }: NumberSlideBoardProps) {
  const [tiles, setTiles] = useState<number[]>(INITIAL_TILES);
  const [moves, setMoves] = useState(0);

  const slideTile = (idx: number) => {
    const emptyIdx = tiles.indexOf(0);
    const r1 = Math.floor(idx / 3);
    const c1 = idx % 3;
    const r2 = Math.floor(emptyIdx / 3);
    const c2 = emptyIdx % 3;
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;
    const next = [...tiles];
    [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
    setTiles(next);
    setMoves((m) => m + 1);
  };

  const reset = () => {
    setTiles(INITIAL_TILES);
    setMoves(0);
  };

  return (
    <div className={`${styles.box} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}>
      <div className={styles.top}>
        <span>Slide 1–8 • Moves: {moves}</span>
        <button type="button" className={styles.btn} onClick={reset}>
          Reset
        </button>
      </div>
      <div className={styles.grid}>
        {tiles.map((n, idx) => (
          <button
            key={idx}
            type="button"
            className={`${styles.tile} ${n === 0 ? styles.empty : ''}`}
            onClick={() => slideTile(idx)}
          >
            {n === 0 ? '' : n}
          </button>
        ))}
      </div>
    </div>
  );
}
export default NumberSlideBoard;
