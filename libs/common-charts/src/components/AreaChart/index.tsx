import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export type AreaChartThemeMode = "light" | "dark";

export interface AreaChartSeriesPoint {
  label: string;
  value: number;
}

export interface AreaChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: AreaChartThemeMode;

  /**
   * Optional chart title.
   *
   * @translate
   */
  title?: string;

  /**
   * Series points plotted along the horizontal axis.
   */
  points?: AreaChartSeriesPoint[];

  /**
   * Primary stroke and gradient fill color.
   */
  color?: string;

  /**
   * Show vertical/horizontal axis labels.
   *
   * @schema {"type":"boolean"}
   */
  showLabels?: boolean;

  /**
   * Chart plot height in pixels.
   */
  height?: number;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_AREA_POINTS: AreaChartSeriesPoint[] = [
  { label: "Mon", value: 18 },
  { label: "Tue", value: 34 },
  { label: "Wed", value: 29 },
  { label: "Thu", value: 56 },
  { label: "Fri", value: 74 },
];

export default function AreaChart({
  themeMode = "light",
  title = "Cumulative Throughput",
  points = DEFAULT_AREA_POINTS,
  color = "#7c3aed",
  showLabels = true,
  height = 190,
  className = "",
  ...props
}: AreaChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const series =
    Array.isArray(points) && points.length > 0 ? points : DEFAULT_AREA_POINTS;
  const safeHeight = Math.max(120, Math.floor(Number(height) || 190));

  const { lineD, areaD, coords, latestValue } = useMemo(() => {
    const vals = series.map((p) => Number(p.value) || 0);
    const minV = Math.min(0, ...vals);
    const maxV = Math.max(...vals);
    const span = maxV - minV === 0 ? 1 : maxV - minV;

    const w = 360;
    const h = 140;
    const padX = 16;
    const padY = 14;
    const usableW = w - padX * 2;
    const usableH = h - padY * 2;

    const mapped = series.map((pt, i) => {
      const ratioX = series.length === 1 ? 0.5 : i / (series.length - 1);
      const val = Number(pt.value) || 0;
      const ratioY = (val - minV) / span;
      return {
        x: padX + ratioX * usableW,
        y: padY + (1 - ratioY) * usableH,
        label: pt.label,
        value: val,
      };
    });

    const line = mapped
      .map((m, i) => `${i === 0 ? "M" : "L"} ${m.x.toFixed(1)} ${m.y.toFixed(1)}`)
      .join(" ");
    const area =
      mapped.length > 0
        ? `${line} L ${mapped[mapped.length - 1].x.toFixed(1)} ${(h - padY).toFixed(1)} L ${mapped[0].x.toFixed(1)} ${(h - padY).toFixed(1)} Z`
        : "";

    return {
      lineD: line,
      areaD: area,
      coords: mapped,
      latestValue: vals[vals.length - 1] ?? 0,
    };
  }, [series]);

  return (
    <div
      {...props}
      role="img"
      aria-label={title || "Area chart"}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.header}>
        {title && <span className={styles.title}>{title}</span>}
        <span className={styles.latest}>{latestValue}</span>
      </div>

      <svg
        viewBox="0 0 360 140"
        style={{ height: `${safeHeight}px` }}
        className={styles.svg}
      >
        {areaD && (
          <path
            d={areaD}
            fill={color}
            fillOpacity={themeMode === "dark" ? 0.28 : 0.18}
          />
        )}
        {lineD && (
          <path
            d={lineD}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {coords.map((pt, i) => (
          <circle
            key={`${pt.label}-${i}`}
            cx={pt.x}
            cy={pt.y}
            r={3.5}
            fill={color}
          />
        ))}
      </svg>

      {showLabels && (
        <div className={styles.labels}>
          {coords.map((pt, i) => (
            <span key={`${pt.label}-${i}`} className={styles.label}>
              {pt.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
