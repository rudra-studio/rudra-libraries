import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

export type FadeRevealThemeMode = "light" | "dark";
export type FadeRevealEffect = "fade" | "slide-up" | "scale";

export interface FadeRevealBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "title"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: FadeRevealThemeMode;

  /**
   * Reveal motion effect style.
   *
   * @select|fade|slide-up|scale
   */
  effect?: FadeRevealEffect;

  /**
   * Animation duration in milliseconds.
   */
  durationMs?: number;

  /**
   * Heading text inside the revealed box.
   *
   * @translate
   */
  title?: string;

  /**
   * Body copy inside the revealed box.
   *
   * @translate
   */
  message?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function FadeRevealBox({
  themeMode = "light",
  effect = "slide-up",
  durationMs = 550,
  title = "Smooth Entrance Reveal",
  message = "Transitions smoothly into view with reduced-motion fallback support.",
  className = "",
  ...props
}: FadeRevealBoxProps) {
  const [animKey, setAnimKey] = useState(0);
  const [visible, setVisible] = useState(true);
  const safeDuration = Math.max(150, Math.min(3000, Number(durationMs) || 550));
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const effClass =
    styles[`eff_${effect.replace("-", "_")}`] || styles.eff_slide_up;

  useEffect(() => {
    setVisible(true);
  }, [animKey]);

  const replay = () => {
    setVisible(false);
    window.setTimeout(() => {
      setAnimKey((k) => k + 1);
    }, 60);
  };

  return (
    <div
      {...props}
      key={animKey}
      data-theme={themeMode}
      style={{
        ...props.style,
        animationDuration: `${safeDuration}ms`,
      }}
      className={[
        styles.box,
        modeClass,
        effClass,
        visible ? styles.shown : "",
        "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.row}>
        <div className={styles.textCol}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {message && <p className={styles.message}>{message}</p>}
        </div>
        <button type="button" onClick={replay} className={styles.replayBtn}>
          Replay
        </button>
      </div>
    </div>
  );
}
