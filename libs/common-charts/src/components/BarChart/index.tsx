import React from "react";
import styles from "./styles.module.scss";

export type BarChartThemeMode = "light" | "dark";
export type BarChartOrientation = "vertical" | "horizontal";

export interface BarChartDatum {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: BarChartThemeMode;

  /**
   * Optional chart heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Bar series items.
   */
  data?: BarChartDatum[];

  /**
   * Bar orientation layout.
   *
   * @select|vertical|horizontal
   */
  orientation?: BarChartOrientation;

  /**
   * Explicit ceiling value for bar scaling (auto-computed when omitted).
   */
  maxValue?: number;

  /**
   * Show numeric values beside or above bars.
   *
   * @schema {"type":"boolean"}
   */
  showValues?: boolean;

  /**
   * Chart area height in pixels.
   */
  height?: number;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_DATA: BarChartDatum[] = [
  { label: "Loaders", value: 92 },
  { label: "Editors", value: 78 },
  { label: "Layout", value: 96 },
  { label: "Core", value: 84 },
];

export default function BarChart({
  themeMode = "light",
  title = "Library Readiness",
  data = DEFAULT_DATA,
  orientation = "vertical",
  maxValue,
  showValues = true,
  height = 200,
  className = "",
  ...props
}: BarChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const rows =
    Array.isArray(data) && data.length > 0 ? data : DEFAULT_DATA;
  const computedMax =
    typeof maxValue === "number" && Number.isFinite(maxValue) && maxValue > 0
      ? maxValue
      : Math.max(1, ...rows.map((d) => Number(d.value) || 0));
  const safeHeight = Math.max(120, Math.floor(Number(height) || 200));

  return (
    <div
      {...props}
      role="img"
      aria-label={title || "Bar chart"}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title && <div className={styles.title}>{title}</div>}

      {orientation === "horizontal" ? (
        <div className={styles.horizontalList}>
          {rows.map((item, idx) => {
            const val = Number(item.value) || 0;
            const pct = Math.max(0, Math.min(100, (val / computedMax) * 100));
            return (
              <div key={`${item.label}-${idx}`} className={styles.hRow}>
                <span className={styles.hLabel}>{item.label}</span>
                <div className={styles.hTrack}>
                  <div
                    className={styles.hFill}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color || undefined,
                    }}
                  />
                </div>
                {showValues && <span className={styles.valText}>{val}</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={styles.verticalStage}
          style={{ height: `${safeHeight}px` }}
        >
          {rows.map((item, idx) => {
            const val = Number(item.value) || 0;
            const pct = Math.max(2, Math.min(100, (val / computedMax) * 100));
            return (
              <div key={`${item.label}-${idx}`} className={styles.vCol}>
                {showValues && <span className={styles.valText}>{val}</span>}
                <div className={styles.vTrack}>
                  <div
                    className={styles.vFill}
                    style={{
                      height: `${pct}%`,
                      backgroundColor: item.color || undefined,
                    }}
                  />
                </div>
                <span className={styles.vLabel}>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
