import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export type PieChartThemeMode = "light" | "dark";

export interface PieChartSlice {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: PieChartThemeMode;

  /**
   * Optional chart title.
   *
   * @translate
   */
  title?: string;

  /**
   * Slices rendered in the pie or donut chart.
   */
  slices?: PieChartSlice[];

  /**
   * Inner cutout ratio (0 for pie, up to 0.75 for donut).
   */
  donutRatio?: number;

  /**
   * Display legend items with values and percentages.
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

const DEFAULT_SLICES: PieChartSlice[] = [
  { label: "UI Libs", value: 40, color: "#2563eb" },
  { label: "Modules", value: 35, color: "#7c3aed" },
  { label: "Apps", value: 25, color: "#059669" },
];

export default function PieChart({
  themeMode = "light",
  title = "Distribution Breakdown",
  slices = DEFAULT_SLICES,
  donutRatio = 0.55,
  showLegend = true,
  className = "",
  ...props
}: PieChartProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const items =
    Array.isArray(slices) && slices.length > 0 ? slices : DEFAULT_SLICES;
  const safeHole = Math.max(0, Math.min(0.75, Number(donutRatio) || 0));

  const { segments, total } = useMemo(() => {
    const sum = items.reduce((acc, s) => acc + Math.max(0, Number(s.value) || 0), 0);
    const effectiveTotal = sum > 0 ? sum : items.length;
    let cumulative = 0;

    const built = items.map((s, idx) => {
      const raw = sum > 0 ? Math.max(0, Number(s.value) || 0) : 1;
      const startFrac = cumulative / effectiveTotal;
      cumulative += raw;
      const endFrac = cumulative / effectiveTotal;
      const pct = Math.round(((endFrac - startFrac) * 100) * 10) / 10;

      const startAngle = startFrac * Math.PI * 2 - Math.PI / 2;
      const endAngle = endFrac * Math.PI * 2 - Math.PI / 2;
      const largeArc = endFrac - startFrac > 0.5 ? 1 : 0;

      const cx = 80;
      const cy = 80;
      const rOuter = 66;
      const rInner = rOuter * safeHole;

      const x1Outer = cx + rOuter * Math.cos(startAngle);
      const y1Outer = cy + rOuter * Math.sin(startAngle);
      const x2Outer = cx + rOuter * Math.cos(endAngle);
      const y2Outer = cy + rOuter * Math.sin(endAngle);

      let d = "";
      if (rInner > 0) {
        const x1Inner = cx + rInner * Math.cos(endAngle);
        const y1Inner = cy + rInner * Math.sin(endAngle);
        const x2Inner = cx + rInner * Math.cos(startAngle);
        const y2Inner = cy + rInner * Math.sin(startAngle);

        d = [
          `M ${x1Outer.toFixed(2)} ${y1Outer.toFixed(2)}`,
          `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2Outer.toFixed(2)} ${y2Outer.toFixed(2)}`,
          `L ${x1Inner.toFixed(2)} ${y1Inner.toFixed(2)}`,
          `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x2Inner.toFixed(2)} ${y2Inner.toFixed(2)}`,
          "Z",
        ].join(" ");
      } else {
        d = [
          `M ${cx} ${cy}`,
          `L ${x1Outer.toFixed(2)} ${y1Outer.toFixed(2)}`,
          `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2Outer.toFixed(2)} ${y2Outer.toFixed(2)}`,
          "Z",
        ].join(" ");
      }

      return {
        key: `${s.label}-${idx}`,
        label: s.label,
        value: Number(s.value) || 0,
        pct,
        color: s.color || ["#2563eb", "#7c3aed", "#059669", "#d97706"][idx % 4],
        d,
      };
    });

    return { segments: built, total: sum };
  }, [items, safeHole]);

  return (
    <div
      {...props}
      role="img"
      aria-label={title || "Pie chart"}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title && <div className={styles.title}>{title}</div>}

      <div className={styles.content}>
        <svg viewBox="0 0 160 160" className={styles.svg}>
          {segments.map((seg) => (
            <path key={seg.key} d={seg.d} fill={seg.color} />
          ))}
          {safeHole > 0 && (
            <text x="80" y="84" textAnchor="middle" className={styles.centerText}>
              {total}
            </text>
          )}
        </svg>

        {showLegend && (
          <div className={styles.legend}>
            {segments.map((seg) => (
              <div key={seg.key} className={styles.legendItem}>
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: seg.color }}
                />
                <span className={styles.legendLabel}>{seg.label}</span>
                <span className={styles.legendVal}>
                  {seg.value} ({seg.pct}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
