import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface ReactionReflexPadProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  promptText?: string;
}

export function ReactionReflexPad({
  themeMode = 'dark',
  promptText = 'Tap to Start Reflex Round',
}: ReactionReflexPadProps) {
  const [state, setState] = useState<'idle' | 'ready' | 'done'>('idle');
  const [startTs, setStartTs] = useState(0);
  const [ms, setMs] = useState<number | null>(null);

  const handleTap = () => {
    if (state === 'idle' || state === 'done') {
      setState('ready');
      setStartTs(performance.now());
    } else {
      setMs(Math.max(1, Math.round(performance.now() - startTs)));
      setState('done');
    }
  };

  return (
    <button
      type="button"
      className={`${styles.pad} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}
      onClick={handleTap}
    >
      <span className={styles.title}>
        {state === 'idle' ? promptText : state === 'ready' ? 'Tap Now!' : `${ms} ms`}
      </span>
      <span className={styles.sub}>
        {state === 'done' ? 'Tap again for next round' : 'Reflex speed test'}
      </span>
    </button>
  );
}
export default ReactionReflexPad;
