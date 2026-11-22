import React from "react";
import styles from "./styles.module.scss";

export type ProgressRingThemeMode = "light" | "dark";

export interface ProgressRingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ProgressRingThemeMode;

  /**
   * Optional metric label below or beside the ring.
   *
   * @translate
   */
  label?: string;

  /**
   * Completion percentage (0 to 100).
   */
  value?: number;

  /**
   * Ring stroke color.
   */
  color?: string;

  /**
   * Ring diameter in pixels.
   */
  size?: number;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function ProgressRing({
  themeMode = "light",
  label = "Sprint Progress",
  value = 72,
  color = "#2563eb",
  size = 88,
  className = "",
  ...props
}: ProgressRingProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const safeSize = Math.max(56, Math.floor(Number(size) || 88));
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <div
      {...props}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Progress ring"}
      data-theme={themeMode}
      className={[styles.wrap, modeClass, className].filter(Boolean).join(" ")}
    >
      <div
        className={styles.ringBox}
        style={{ width: `${safeSize}px`, height: `${safeSize}px` }}
      >
        <svg viewBox="0 0 80 80" className={styles.svg}>
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            strokeWidth={7}
            className={styles.track}
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 40 40)"
          />
        </svg>
        <span className={styles.pct}>{Math.round(clamped)}%</span>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
