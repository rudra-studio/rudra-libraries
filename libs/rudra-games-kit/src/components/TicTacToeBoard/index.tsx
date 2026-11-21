import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface TicTacToeBoardProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|function */
  onGameEnd?: (result: string) => void;
}

type Mark = 'X' | 'O' | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(cells: Mark[]): string {
  for (const [a, b, c] of LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return `${cells[a]} Wins`;
  }
  return cells.every(Boolean) ? 'Draw' : '';
}

export function TicTacToeBoard({ themeMode = 'dark', onGameEnd }: TicTacToeBoardProps) {
  const [cells, setCells] = useState<Mark[]>(Array<Mark>(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const outcome = getWinner(cells);

  const playCell = (i: number) => {
    if (cells[i] || outcome) return;
    const next = [...cells];
    next[i] = xTurn ? 'X' : 'O';
    setCells(next);
    const res = getWinner(next);
    if (res) onGameEnd?.(res);
    else setXTurn(!xTurn);
  };

  const reset = () => {
    setCells(Array<Mark>(9).fill(null));
    setXTurn(true);
  };

  return (
    <div className={`${styles.box} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}>
      <div className={styles.top}>
        <strong>{outcome ? outcome : `Turn: ${xTurn ? 'X' : 'O'}`}</strong>
        <button type="button" className={styles.btn} onClick={reset}>
          Reset
        </button>
      </div>
      <div className={styles.board}>
        {cells.map((val, i) => (
          <button key={i} type="button" className={styles.sq} onClick={() => playCell(i)}>
            {val || ''}
          </button>
        ))}
      </div>
    </div>
  );
}
export default TicTacToeBoard;
