import React, { useState } from 'react';
import styles from './styles.module.scss';

interface FloatingHeartsCanvasProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|hearts|confetti|sparkles|petals */
  effectType?: 'hearts' | 'confetti' | 'sparkles' | 'petals';
  /** @select|soft|festive|burst */
  intensity?: 'soft' | 'festive' | 'burst';
  /** @translate */
  bannerTitle?: string;
  /** @translate */
  bannerSubtitle?: string;
  /** @schema {"type":"boolean"} */
  active?: boolean;
}

const SYMBOL_MAP: Record<string, string[]> = {
  hearts: ['💖', '💕', '💗', '💘', '❤️'],
  confetti: ['🎉', '🎊', '✨', '🎈', '🌟'],
  sparkles: ['✨', '⭐', '💫', '🌟', '💎'],
  petals: ['🌸', '🌹', '🌺', '🌷', '💮'],
};

function FloatingHeartsCanvas({
  themeMode = 'light',
  effectType = 'hearts',
  intensity = 'festive',
  bannerTitle = 'Make Every Moment Unforgettable',
  bannerSubtitle = 'Create wedding invites, love proposals with flying buttons & hearts, and custom celebration websites in minutes.',
  active = true,
}: FloatingHeartsCanvasProps) {
  const [mode, setMode] = useState<'hearts' | 'confetti' | 'sparkles' | 'petals'>(effectType);
  const [burstBoost, setBurstBoost] = useState(false);

  const symbols = SYMBOL_MAP[mode] || SYMBOL_MAP.hearts;
  const baseCount = intensity === 'burst' ? 22 : intensity === 'festive' ? 14 : 8;
  const particleCount = burstBoost ? baseCount + 10 : baseCount;

  const triggerBurst = () => {
    setBurstBoost(true);
    window.setTimeout(() => setBurstBoost(false), 2400);
  };

  return (
    <section className={`${styles.stage} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      {active && (
        <div className={styles.particleLayer} aria-hidden="true">
          {Array.from({ length: particleCount }, (_, idx) => {
            const left = (idx * 37 + 9) % 94;
            const delay = (idx % 7) * 0.55;
            const duration = 3.8 + (idx % 5) * 0.9;
            const size = 1.1 + (idx % 4) * 0.35;
            return (
              <span
                key={`${mode}-${idx}`}
                className={styles.particle}
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  fontSize: `${size}rem`,
                }}
              >
                {symbols[idx % symbols.length]}
              </span>
            );
          })}
        </div>
      )}

      <div className={styles.content}>
        <span className={styles.pill}>✨ Smileyyfy Interactive Celebration Studio</span>
        <h1 className={styles.title}>{bannerTitle}</h1>
        <p className={styles.subtitle}>{bannerSubtitle}</p>

        <div className={styles.controls}>
          {(['hearts', 'confetti', 'sparkles', 'petals'] as const).map((eff) => (
            <button
              key={eff}
              type="button"
              className={`${styles.chip} ${mode === eff ? styles.activeChip : ''}`}
              onClick={() => setMode(eff)}
            >
              {eff === 'hearts' && '💖 Hearts'}
              {eff === 'confetti' && '🎉 Confetti'}
              {eff === 'sparkles' && '✨ Sparkles'}
              {eff === 'petals' && '🌸 Petals'}
            </button>
          ))}
          <button type="button" className={styles.burstBtn} onClick={triggerBurst}>
            🚀 Celebrate Burst
          </button>
        </div>
      </div>
    </section>
  );
}

export default FloatingHeartsCanvas;
