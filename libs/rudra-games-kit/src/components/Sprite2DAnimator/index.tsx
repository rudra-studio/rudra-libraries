import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

export interface Sprite2DAnimatorProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  spriteSheetUrl?: string;
  /** @schema {"type":"number"} */
  frames?: number;
  /** @schema {"type":"number"} */
  fps?: number;
  /** @schema {"type":"boolean"} */
  autoPlay?: boolean;
}

export function Sprite2DAnimator({
  themeMode = 'dark',
  title = '2D Sprite Character',
  spriteSheetUrl = '',
  frames = 6,
  fps = 10,
  autoPlay = true,
}: Sprite2DAnimatorProps) {
  const totalFrames = Math.max(1, Math.min(24, Number(frames) || 6));
  const targetFps = Math.max(1, Math.min(30, Number(fps) || 10));
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(Boolean(autoPlay));
  const [inView, setInView] = useState(true);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView || totalFrames <= 1) return;
    let rafId = 0;
    let lastTime = performance.now();
    const intervalMs = 1000 / targetFps;

    const tick = (now: number) => {
      if (now - lastTime >= intervalMs) {
        lastTime = now - ((now - lastTime) % intervalMs);
        setFrameIndex((prev) => (prev + 1) % totalFrames);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, inView, totalFrames, targetFps]);

  return (
    <div ref={rootRef} className={`${styles.box} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>
          Frame {frameIndex + 1}/{totalFrames} • {targetFps} FPS
        </span>
      </div>

      <div className={styles.stage}>
        {spriteSheetUrl ? (
          <div
            className={styles.sheetFrame}
            style={{
              backgroundImage: `url(${spriteSheetUrl})`,
              backgroundSize: `${totalFrames * 100}% 100%`,
              backgroundPosition: `${totalFrames > 1 ? (frameIndex / (totalFrames - 1)) * 100 : 0}% 0%`,
            }}
          />
        ) : (
          <div
            className={styles.fallbackSprite}
            style={{
              transform: `translateX(${((frameIndex % 3) - 1) * 14}px) translateY(${frameIndex % 2 === 0 ? '-6px' : '4px'}) rotate(${((frameIndex % 4) - 1.5) * 8}deg)`,
            }}
          >
            ⚔️
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.btn} onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" className={styles.btn} onClick={() => setFrameIndex((i) => (i + 1) % totalFrames)}>
          Step Frame
        </button>
      </div>
    </div>
  );
}
export default Sprite2DAnimator;
