import React from "react";
import styles from "./styles.module.scss";

export type GridLayoutThemeMode = "light" | "dark";
export type GridColumns = 1 | 2 | 3 | 4;
export type GridGap = "sm" | "md" | "lg";

export interface GridCardItem {
  id: string;
  title: string;
  value?: string;
  subtitle?: string;
}

export interface GridLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: GridLayoutThemeMode;

  /**
   * Number of columns on desktop grid.
   *
   * @select|1|2|3|4
   */
  columns?: GridColumns;

  /**
   * Gap size between grid cards.
   *
   * @select|sm|md|lg
   */
  gap?: GridGap;

  /**
   * Cards arranged inside the grid.
   */
  cards?: GridCardItem[];

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_GRID_CARDS: GridCardItem[] = [
  { id: "g1", title: "Libraries", value: "05", subtitle: "Reusable UI sets" },
  { id: "g2", title: "Modules", value: "18", subtitle: "Canvas compositions" },
  { id: "g3", title: "Apps", value: "04", subtitle: "Published targets" },
  { id: "g4", title: "Themes", value: "2", subtitle: "Light & Dark" },
];

export default function GridLayout({
  themeMode = "light",
  columns = 2,
  gap = "md",
  cards = DEFAULT_GRID_CARDS,
  className = "",
  ...props
}: GridLayoutProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const cols = [1, 2, 3, 4].includes(Number(columns)) ? Number(columns) : 2;
  const colClass = styles[`cols_${cols}`] || styles.cols_2;
  const gapClass = styles[`gap_${gap}`] || styles.gap_md;
  const list =
    Array.isArray(cards) && cards.length > 0 ? cards : DEFAULT_GRID_CARDS;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.grid, modeClass, colClass, gapClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {list.map((card, idx) => (
        <div key={card.id || idx} className={styles.tile}>
          <div className={styles.tileTop}>
            <span className={styles.tileTitle}>{card.title}</span>
            {card.value && <span className={styles.tileVal}>{card.value}</span>}
          </div>
          {card.subtitle && (
            <span className={styles.tileSub}>{card.subtitle}</span>
          )}
        </div>
      ))}
    </div>
  );
}
