import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export type LineChartThemeMode = "light" | "dark";

export interface LineChartPoint {
  label: string;
  value: number;
}

export interface LineChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: LineChartThemeMode;

  /**
   * Optional chart heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Data points plotted across the series.
   */
  points?: LineChartPoint[];

  /**
   * Stroke color for the line and points.
   */
  strokeColor?: string;

  /**
   * Fill area beneath the line.
   *
   * @schema {"type":"boolean"}
   */
  showArea?: boolean;

  /**
   * Show horizontal reference grid lines.
   *
   * @schema {"type":"boolean"}
   */
  showGrid?: boolean;

  /**
   * Plot height in pixels.
   */
  height?: number;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_POINTS: LineChartPoint[] = [
  { label: "W1", value: 24 },
  { label: "W2", value: 42 },
  { label: "W3", value: 58 },
  { label: "W4", value: 86 },
];

export default function LineChart({
  themeMode = "light",
  title = "Weekly Velocity",
  points = DEFAULT_POINTS,
  strokeColor = "#2563eb",
  showArea = true,
  showGrid = true,
  height = 190,
  className = "",
  ...props
}: LineChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const series =
    Array.isArray(points) && points.length > 0 ? points : DEFAULT_POINTS;
  const safeHeight = Math.max(120, Math.floor(Number(height) || 190));

  const { linePath, areaPath, coords, minVal, maxVal } = useMemo(() => {
    const values = series.map((p) => Number(p.value) || 0);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const span = maxV - minV === 0 ? 1 : maxV - minV;

    const svgW = 360;
    const svgH = 140;
    const padX = 20;
    const padY = 16;
    const usableW = svgW - padX * 2;
    const usableH = svgH - padY * 2;

    const pts = series.map((pt, idx) => {
      const ratioX = series.length === 1 ? 0.5 : idx / (series.length - 1);
      const val = Number(pt.value) || 0;
      const ratioY = (val - minV) / span;
      const x = padX + ratioX * usableW;
      const y = padY + (1 - ratioY) * usableH;
      return { x, y, label: pt.label, value: val };
    });

    const line = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

    const area =
      pts.length > 0
        ? `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${(svgH - padY).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(svgH - padY).toFixed(1)} Z`
        : "";

    return {
      linePath: line,
      areaPath: area,
      coords: pts,
      minVal: minV,
      maxVal: maxV,
    };
  }, [series]);

  return (
    <div
      {...props}
      role="img"
      aria-label={title || "Line chart"}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.topRow}>
        {title && <span className={styles.title}>{title}</span>}
        <span className={styles.rangeBadge}>
          {minVal} – {maxVal}
        </span>
      </div>

      <svg
        viewBox="0 0 360 140"
        style={{ height: `${safeHeight}px` }}
        className={styles.svg}
      >
        {showGrid &&
          [0.25, 0.5, 0.75].map((frac, i) => {
            const y = 16 + frac * 108;
            return (
              <line
                key={i}
                x1={20}
                x2={340}
                y1={y}
                y2={y}
                className={styles.gridLine}
              />
            );
          })}

        {showArea && areaPath && (
          <path
            d={areaPath}
            fill={strokeColor}
            fillOpacity={themeMode === "dark" ? 0.22 : 0.14}
          />
        )}

        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {coords.map((c, idx) => (
          <circle
            key={`${c.label}-${idx}`}
            cx={c.x}
            cy={c.y}
            r={4}
            fill={strokeColor}
          />
        ))}
      </svg>

      <div className={styles.xLabels}>
        {coords.map((c, idx) => (
          <span key={`${c.label}-${idx}`} className={styles.xTick}>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
