import React from "react";
import styles from "./styles.module.scss";

export type GaugeChartThemeMode = "light" | "dark";

export interface GaugeChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: GaugeChartThemeMode;

  /**
   * Optional gauge title.
   *
   * @translate
   */
  title?: string;

  /**
   * Current gauge value.
   */
  value?: number;

  /**
   * Minimum scale value.
   */
  min?: number;

  /**
   * Maximum scale value.
   */
  max?: number;

  /**
   * Unit or suffix shown with the value (e.g. "%", "ms").
   *
   * @translate
   */
  unit?: string;

  /**
   * Arc fill accent color.
   */
  accentColor?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function GaugeChart({
  themeMode = "light",
  title = "Completion Score",
  value = 78,
  min = 0,
  max = 100,
  unit = "%",
  accentColor = "#2563eb",
  className = "",
  ...props
}: GaugeChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax =
    Number.isFinite(max) && max > safeMin ? max : safeMin + 100;
  const safeVal = Math.min(
    Math.max(Number.isFinite(value) ? value : safeMin, safeMin),
    safeMax
  );
  const ratio = (safeVal - safeMin) / (safeMax - safeMin);

  const radius = 56;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - ratio);

  return (
    <div
      {...props}
      role="img"
      aria-label={`${title || "Gauge"}: ${safeVal}${unit}`}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title && <div className={styles.title}>{title}</div>}

      <div className={styles.gaugeBox}>
        <svg viewBox="0 0 140 82" className={styles.svg}>
          <path
            d="M 14 72 A 56 56 0 0 1 126 72"
            fill="none"
            strokeWidth={12}
            strokeLinecap="round"
            className={styles.trackArc}
          />
          <path
            d="M 14 72 A 56 56 0 0 1 126 72"
            fill="none"
            stroke={accentColor}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className={styles.readout}>
          <span className={styles.value}>
            {Math.round(safeVal)}
            {unit}
          </span>
          <span className={styles.bounds}>
            {safeMin} – {safeMax}
          </span>
        </div>
      </div>
    </div>
  );
}
