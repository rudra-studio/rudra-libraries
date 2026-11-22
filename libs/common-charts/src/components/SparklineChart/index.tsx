import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export type SparklineChartThemeMode = "light" | "dark";

export interface SparklineChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SparklineChartThemeMode;

  /**
   * Numeric series values for the sparkline.
   */
  values?: number[];

  /**
   * Stroke color for the sparkline path.
   */
  strokeColor?: string;

  /**
   * Optional label beside the sparkline.
   *
   * @translate
   */
  label?: string;

  /**
   * Show the latest value readout.
   *
   * @schema {"type":"boolean"}
   */
  showLatest?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_VALUES = [12, 19, 15, 28, 34, 31, 45];

export default function SparklineChart({
  themeMode = "light",
  values = DEFAULT_VALUES,
  strokeColor = "#2563eb",
  label = "Trend",
  showLatest = true,
  className = "",
  ...props
}: SparklineChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const nums =
    Array.isArray(values) && values.length > 0
      ? values.map((v) => Number(v) || 0)
      : DEFAULT_VALUES;

  const { pathD, latest } = useMemo(() => {
    const minV = Math.min(...nums);
    const maxV = Math.max(...nums);
    const span = maxV - minV === 0 ? 1 : maxV - minV;
    const w = 140;
    const h = 36;
    const pad = 4;

    const d = nums
      .map((val, i) => {
        const x =
          nums.length === 1
            ? w / 2
            : pad + (i / (nums.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (val - minV) / span) * (h - pad * 2);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");

    return { pathD: d, latest: nums[nums.length - 1] ?? 0 };
  }, [nums]);

  return (
    <div
      {...props}
      role="img"
      aria-label={`${label || "Sparkline"}: ${latest}`}
      data-theme={themeMode}
      className={[styles.wrap, modeClass, className].filter(Boolean).join(" ")}
    >
      {label && <span className={styles.label}>{label}</span>}
      <svg viewBox="0 0 140 36" className={styles.svg}>
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {showLatest && <span className={styles.latest}>{latest}</span>}
    </div>
  );
}
