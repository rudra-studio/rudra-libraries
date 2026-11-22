import React from "react";
import styles from "./styles.module.scss";

export type StackLayoutThemeMode = "light" | "dark";
export type StackDirection = "row" | "column";
export type StackGap = "xs" | "sm" | "md" | "lg";
export type StackAlign = "start" | "center" | "end" | "stretch";

export interface StackEntry {
  id: string;
  title: string;
  detail?: string;
}

export interface StackLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: StackLayoutThemeMode;

  /**
   * Flex stack direction.
   *
   * @select|row|column
   */
  direction?: StackDirection;

  /**
   * Spacing gap between stacked items.
   *
   * @select|xs|sm|md|lg
   */
  gap?: StackGap;

  /**
   * Cross-axis alignment along the stack.
   *
   * @select|start|center|end|stretch
   */
  align?: StackAlign;

  /**
   * Allow flex items to wrap onto multiple lines.
   *
   * @schema {"type":"boolean"}
   */
  wrap?: boolean;

  /**
   * Stack block items.
   */
  items?: StackEntry[];

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_STACK_ITEMS: StackEntry[] = [
  { id: "st1", title: "Header Slot", detail: "Top bar or toolbar region" },
  { id: "st2", title: "Main Slot", detail: "Primary interactive workspace" },
  { id: "st3", title: "Footer Slot", detail: "Summary or pagination bar" },
];

export default function StackLayout({
  themeMode = "light",
  direction = "column",
  gap = "md",
  align = "stretch",
  wrap = true,
  items = DEFAULT_STACK_ITEMS,
  className = "",
  ...props
}: StackLayoutProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const dirClass = direction === "row" ? styles.dir_row : styles.dir_col;
  const gapClass = styles[`gap_${gap}`] || styles.gap_md;
  const alignClass = styles[`align_${align}`] || styles.align_stretch;
  const rows =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_STACK_ITEMS;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[
        styles.stack,
        modeClass,
        dirClass,
        gapClass,
        alignClass,
        wrap ? styles.wrap : "",
        "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {rows.map((row, idx) => (
        <div key={row.id || idx} className={styles.cell}>
          <div className={styles.cellTitle}>{row.title}</div>
          {row.detail && <div className={styles.cellDetail}>{row.detail}</div>}
        </div>
      ))}
    </div>
  );
}
