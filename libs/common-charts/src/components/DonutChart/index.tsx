import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export type DonutChartThemeMode = "light" | "dark";

export interface DonutChartSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: DonutChartThemeMode;

  /**
   * Optional chart heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Donut ring segments.
   */
  segments?: DonutChartSegment[];

  /**
   * Optional center label shown inside the ring.
   *
   * @translate
   */
  centerLabel?: string;

  /**
   * Show segment legend items.
   *
   * @schema {"type":"boolean"}
   */
  showLegend?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_SEGMENTS: DonutChartSegment[] = [
  { label: "Active", value: 64, color: "#2563eb" },
  { label: "In Progress", value: 24, color: "#7c3aed" },
  { label: "Queued", value: 12, color: "#0ea5e9" },
];

export default function DonutChart({
  themeMode = "light",
  title = "Workload Ring",
  segments = DEFAULT_SEGMENTS,
  centerLabel = "Total",
  showLegend = true,
  className = "",
  ...props
}: DonutChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const items =
    Array.isArray(segments) && segments.length > 0 ? segments : DEFAULT_SEGMENTS;

  const { arcs, total } = useMemo(() => {
    const sum = items.reduce((acc, s) => acc + Math.max(0, Number(s.value) || 0), 0);
    const denom = sum > 0 ? sum : items.length;
    let accFrac = 0;

    const cx = 80;
    const cy = 80;
    const rOuter = 66;
    const rInner = 40;

    const built = items.map((s, idx) => {
      const val = Math.max(0, Number(s.value) || 0);
      const frac = (sum > 0 ? val : 1) / denom;
      const startAngle = accFrac * Math.PI * 2 - Math.PI / 2;
      accFrac += frac;
      const endAngle = accFrac * Math.PI * 2 - Math.PI / 2;
      const largeArc = frac > 0.5 ? 1 : 0;

      const x1O = cx + rOuter * Math.cos(startAngle);
      const y1O = cy + rOuter * Math.sin(startAngle);
      const x2O = cx + rOuter * Math.cos(endAngle);
      const y2O = cy + rOuter * Math.sin(endAngle);
      const x1I = cx + rInner * Math.cos(endAngle);
      const y1I = cy + rInner * Math.sin(endAngle);
      const x2I = cx + rInner * Math.cos(startAngle);
      const y2I = cy + rInner * Math.sin(startAngle);

      const d = [
        `M ${x1O.toFixed(2)} ${y1O.toFixed(2)}`,
        `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2O.toFixed(2)} ${y2O.toFixed(2)}`,
        `L ${x1I.toFixed(2)} ${y1I.toFixed(2)}`,
        `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x2I.toFixed(2)} ${y2I.toFixed(2)}`,
        "Z",
      ].join(" ");

      return {
        key: `${s.label}-${idx}`,
        label: s.label,
        value: val,
        pct: Math.round(frac * 1000) / 10,
        color: s.color || ["#2563eb", "#7c3aed", "#0ea5e9", "#10b981"][idx % 4],
        d,
      };
    });

    return { arcs: built, total: sum };
  }, [items]);

  return (
    <div
      {...props}
      role="img"
      aria-label={title || "Donut chart"}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title && <div className={styles.title}>{title}</div>}

      <div className={styles.content}>
        <svg viewBox="0 0 160 160" className={styles.svg}>
          {arcs.map((a) => (
            <path key={a.key} d={a.d} fill={a.color} />
          ))}
          <text x="80" y="77" textAnchor="middle" className={styles.totalVal}>
            {total}
          </text>
          {centerLabel && (
            <text x="80" y="93" textAnchor="middle" className={styles.centerLbl}>
              {centerLabel}
            </text>
          )}
        </svg>

        {showLegend && (
          <div className={styles.legend}>
            {arcs.map((a) => (
              <div key={a.key} className={styles.legendRow}>
                <span className={styles.dot} style={{ backgroundColor: a.color }} />
                <span className={styles.lbl}>{a.label}</span>
                <span className={styles.val}>
                  {a.value} ({a.pct}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
