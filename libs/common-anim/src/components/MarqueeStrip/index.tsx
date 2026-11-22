import React, { useState } from "react";
import styles from "./styles.module.scss";

export type MarqueeStripThemeMode = "light" | "dark";

export interface MarqueeStripItem {
  id: string;
  label: string;
  badge?: string;
}

export interface MarqueeStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: MarqueeStripThemeMode;

  /**
   * Items scrolling across the strip.
   */
  items?: MarqueeStripItem[];

  /**
   * Loop cycle duration in seconds.
   */
  speedSec?: number;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_MARQUEE_ITEMS: MarqueeStripItem[] = [
  { id: "m1", label: "Zero Lock-In React", badge: "Code" },
  { id: "m2", label: "Visual Canvas Modules", badge: "Canvas" },
  { id: "m3", label: "Light & Dark Themes", badge: "Theme" },
  { id: "m4", label: "Pure SCSS Modules", badge: "Style" },
];

export default function MarqueeStrip({
  themeMode = "light",
  items = DEFAULT_MARQUEE_ITEMS,
  speedSec = 18,
  className = "",
  ...props
}: MarqueeStripProps) {
  const [paused, setPaused] = useState(false);
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const list =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_MARQUEE_ITEMS;
  const duration = Math.max(6, Math.min(60, Number(speedSec) || 18));

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[
        styles.wrap,
        modeClass,
        paused ? styles.paused : "",
        "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ animationDuration: `${duration}s` }}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className={styles.group} aria-hidden={dup === 1}>
              {list.map((entry, idx) => (
                <span key={`${dup}-${entry.id || idx}`} className={styles.pill}>
                  <span>{entry.label}</span>
                  {entry.badge && (
                    <span className={styles.badge}>{entry.badge}</span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className={styles.toggleBtn}
      >
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
