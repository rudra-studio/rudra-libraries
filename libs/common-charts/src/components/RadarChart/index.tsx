import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export type RadarChartThemeMode = "light" | "dark";

export interface RadarChartAxis {
  label: string;
  value: number;
}

export interface RadarChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: RadarChartThemeMode;

  /**
   * Optional chart title.
   *
   * @translate
   */
  title?: string;

  /**
   * Axes plotted radially around the center.
   */
  axes?: RadarChartAxis[];

  /**
   * Maximum value per axis (auto-computed when omitted).
   */
  maxValue?: number;

  /**
   * Fill and stroke accent color.
   */
  color?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_AXES: RadarChartAxis[] = [
  { label: "Speed", value: 88 },
  { label: "UX", value: 94 },
  { label: "Reuse", value: 90 },
  { label: "Scale", value: 82 },
  { label: "A11y", value: 86 },
];

export default function RadarChart({
  themeMode = "light",
  title = "Capability Radar",
  axes = DEFAULT_AXES,
  maxValue,
  color = "#2563eb",
  className = "",
  ...props
}: RadarChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const items =
    Array.isArray(axes) && axes.length >= 3 ? axes : DEFAULT_AXES;
  const maxAxis =
    typeof maxValue === "number" && Number.isFinite(maxValue) && maxValue > 0
      ? maxValue
      : Math.max(100, ...items.map((a) => Number(a.value) || 0));

  const { polygonPoints, gridRings, labels } = useMemo(() => {
    const cx = 100;
    const cy = 96;
    const radius = 58;
    const count = items.length;

    const ringPolys = [0.35, 0.7, 1].map((frac) =>
      items
        .map((_, i) => {
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const r = radius * frac;
          return `${(cx + r * Math.cos(angle)).toFixed(1)},${(
            cy + r * Math.sin(angle)
          ).toFixed(1)}`;
        })
        .join(" ")
    );

    const dataPts = items.map((ax, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const ratio = Math.max(0, Math.min(1, (Number(ax.value) || 0) / maxAxis));
      const r = radius * ratio;
      return `${(cx + r * Math.cos(angle)).toFixed(1)},${(
        cy + r * Math.sin(angle)
      ).toFixed(1)}`;
    });

    const lbls = items.map((ax, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const lr = radius + 18;
      return {
        key: `${ax.label}-${i}`,
        label: ax.label,
        x: cx + lr * Math.cos(angle),
        y: cy + lr * Math.sin(angle),
      };
    });

    return {
      polygonPoints: dataPts.join(" "),
      gridRings: ringPolys,
      labels: lbls,
    };
  }, [items, maxAxis]);

  return (
    <div
      {...props}
      role="img"
      aria-label={title || "Radar chart"}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title && <div className={styles.title}>{title}</div>}

      <svg viewBox="0 0 200 190" className={styles.svg}>
        {gridRings.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            className={styles.gridRing}
          />
        ))}
        {polygonPoints && (
          <polygon
            points={polygonPoints}
            fill={color}
            fillOpacity={themeMode === "dark" ? 0.3 : 0.18}
            stroke={color}
            strokeWidth={2}
          />
        )}
        {labels.map((l) => (
          <text
            key={l.key}
            x={l.x}
            y={l.y + 3}
            textAnchor="middle"
            className={styles.axisLabel}
          >
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
