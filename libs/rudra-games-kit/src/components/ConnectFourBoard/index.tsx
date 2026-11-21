import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface ConnectFourBoardProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  playerOneLabel?: string;
  /** @translate */
  playerTwoLabel?: string;
  /** @type|function */
  onWin?: (winnerLabel: string) => void;
}

type Disc = 0 | 1 | 2;
const ROWS = 6;
const COLS = 7;

function createEmptyGrid(): Disc[][] {
  return Array.from({ length: ROWS }, () => Array<Disc>(COLS).fill(0));
}

function checkWinner(grid: Disc[][]): Disc {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = grid[r][c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        let count = 1;
        for (let step = 1; step < 4; step++) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || grid[nr][nc] !== p) break;
          count++;
        }
        if (count >= 4) return p;
      }
    }
  }
  return 0;
}

export function ConnectFourBoard({
  themeMode = 'dark',
  playerOneLabel = 'Player 1',
  playerTwoLabel = 'Player 2',
  onWin,
}: ConnectFourBoardProps) {
  const [board, setBoard] = useState<Disc[][]>(() => createEmptyGrid());
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<Disc>(0);

  const dropDisc = (col: number) => {
    if (winner) return;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) {
        const next = board.map((row) => [...row]);
        next[r][col] = turn;
        setBoard(next);
        const w = checkWinner(next);
        if (w) {
          setWinner(w);
          onWin?.(w === 1 ? playerOneLabel : playerTwoLabel);
        } else {
          setTurn(turn === 1 ? 2 : 1);
        }
        return;
      }
    }
  };

  const reset = () => {
    setBoard(createEmptyGrid());
    setTurn(1);
    setWinner(0);
  };

  return (
    <div className={`${styles.wrap} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}>
      <div className={styles.top}>
        <span className={styles.banner}>
          {winner
            ? `${winner === 1 ? playerOneLabel : playerTwoLabel} Wins!`
            : `Turn: ${turn === 1 ? playerOneLabel : playerTwoLabel}`}
        </span>
        <button type="button" className={styles.reset} onClick={reset}>
          Restart
        </button>
      </div>
      <div className={styles.colBtns}>
        {Array.from({ length: COLS }, (_, c) => (
          <button key={c} type="button" className={styles.dropBtn} onClick={() => dropDisc(c)}>
            ↓ {c + 1}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`${styles.cell} ${cell === 1 ? styles.p1 : cell === 2 ? styles.p2 : ''}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default ConnectFourBoard;
