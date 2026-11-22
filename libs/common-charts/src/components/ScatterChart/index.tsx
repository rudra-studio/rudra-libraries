import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export type ScatterChartThemeMode = "light" | "dark";

export interface ScatterChartPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface ScatterChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ScatterChartThemeMode;

  /**
   * Optional chart title.
   *
   * @translate
   */
  title?: string;

  /**
   * Coordinate points plotted on the X/Y plane.
   */
  points?: ScatterChartPoint[];

  /**
   * Default dot color when point color is omitted.
   */
  dotColor?: string;

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

const DEFAULT_POINTS: ScatterChartPoint[] = [
  { x: 15, y: 28, label: "A" },
  { x: 34, y: 52, label: "B" },
  { x: 58, y: 46, label: "C" },
  { x: 76, y: 78, label: "D" },
  { x: 90, y: 88, label: "E" },
];

export default function ScatterChart({
  themeMode = "light",
  title = "Correlation Plot",
  points = DEFAULT_POINTS,
  dotColor = "#2563eb",
  height = 190,
  className = "",
  ...props
}: ScatterChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const items =
    Array.isArray(points) && points.length > 0 ? points : DEFAULT_POINTS;
  const safeHeight = Math.max(120, Math.floor(Number(height) || 190));

  const dots = useMemo(() => {
    const xs = items.map((p) => Number(p.x) || 0);
    const ys = items.map((p) => Number(p.y) || 0);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = maxX - minX === 0 ? 1 : maxX - minX;
    const spanY = maxY - minY === 0 ? 1 : maxY - minY;

    const svgW = 360;
    const svgH = 140;
    const padX = 22;
    const padY = 16;

    return items.map((pt, idx) => {
      const cx = padX + (((Number(pt.x) || 0) - minX) / spanX) * (svgW - padX * 2);
      const cy =
        padY + (1 - ((Number(pt.y) || 0) - minY) / spanY) * (svgH - padY * 2);
      return {
        key: `${pt.label || "pt"}-${idx}`,
        cx,
        cy,
        fill: pt.color || dotColor,
        label: pt.label || "",
      };
    });
  }, [items, dotColor]);

  return (
    <div
      {...props}
      role="img"
      aria-label={title || "Scatter chart"}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title && <div className={styles.title}>{title}</div>}

      <svg
        viewBox="0 0 360 140"
        style={{ height: `${safeHeight}px` }}
        className={styles.svg}
      >
        <line x1={22} x2={338} y1={124} y2={124} className={styles.axis} />
        <line x1={22} x2={22} y1={16} y2={124} className={styles.axis} />
        {dots.map((d) => (
          <g key={d.key}>
            <circle cx={d.cx} cy={d.cy} r={5.5} fill={d.fill} />
            {d.label && (
              <text x={d.cx} y={d.cy - 9} textAnchor="middle" className={styles.ptLabel}>
                {d.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
