import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

export type SpriteSheetThemeMode = "light" | "dark";

export interface SpriteSheetPlayerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SpriteSheetThemeMode;

  /**
   * Player title text.
   *
   * @translate
   */
  title?: string;

  /**
   * Optional horizontal sprite sheet image URL.
   */
  spriteSheetUrl?: string;

  /**
   * Total frames in the sprite sheet (1 to 24).
   */
  frames?: number;

  /**
   * Playback speed in frames per second (1 to 30).
   */
  fps?: number;

  /**
   * Start playing automatically.
   *
   * @schema {"type":"boolean"}
   */
  autoPlay?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function SpriteSheetPlayer({
  themeMode = "light",
  title = "Sprite Frame Player",
  spriteSheetUrl = "",
  frames = 6,
  fps = 8,
  autoPlay = true,
  className = "",
  ...props
}: SpriteSheetPlayerProps) {
  const totalFrames = Math.max(1, Math.min(24, Math.floor(Number(frames) || 6)));
  const safeFps = Math.max(1, Math.min(30, Math.floor(Number(fps) || 8)));
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(Boolean(autoPlay));
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  useEffect(() => {
    if (!playing || totalFrames <= 1) return;
    const ms = Math.max(30, Math.round(1000 / safeFps));
    const id = window.setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % totalFrames);
    }, ms);
    return () => window.clearInterval(id);
  }, [playing, totalFrames, safeFps]);

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, className].filter(Boolean).join(" ")}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>
          {frameIdx + 1}/{totalFrames} • {safeFps} FPS
        </span>
      </div>

      <div className={styles.stage} aria-hidden="true">
        {spriteSheetUrl ? (
          <div
            className={styles.sheet}
            style={{
              backgroundImage: `url(${spriteSheetUrl})`,
              backgroundSize: `${totalFrames * 100}% 100%`,
              backgroundPosition: `${
                totalFrames > 1 ? (frameIdx / (totalFrames - 1)) * 100 : 0
              }% 0%`,
            }}
          />
        ) : (
          <span
            className={styles.glyph}
            style={{
              transform: `translateX(${((frameIdx % 3) - 1) * 12}px) translateY(${
                frameIdx % 2 === 0 ? "-4px" : "3px"
              })`,
            }}
          >
            ✨
          </span>
        )}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className={styles.btn}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => setFrameIdx((i) => (i + 1) % totalFrames)}
          className={styles.btn}
        >
          Next Frame
        </button>
      </div>
    </div>
  );
}
