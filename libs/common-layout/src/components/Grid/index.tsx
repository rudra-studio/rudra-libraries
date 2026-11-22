import React from "react";
import styles from "./styles.module.scss";

export type GridThemeMode = "light" | "dark";
export type GridElement = "div" | "section" | "article" | "main" | "aside";

export interface GridProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: GridThemeMode;

  /**
   * Semantic container tag.
   *
   * @select|div|section|article|main|aside
   */
  as?: GridElement;

  /**
   * Number of grid columns (1 to 12).
   */
  columns?: number;

  /**
   * Grid child nodes.
   */
  children?: React.ReactNode;

  /**
   * Gap, padding, and alignment utility classes.
   *
   * @type|class
   */
  className?: string;
}

export default function Grid({
  themeMode = "light",
  as = "div",
  columns = 3,
  children,
  className = "gap-4",
  ...props
}: GridProps) {
  const Component = as;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const safeCols = Math.max(1, Math.min(12, Math.floor(columns) || 3));

  return (
    <Component
      {...props}
      data-theme={themeMode}
      style={{
        ...props.style,
        gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))`,
      }}
      className={[styles.root, modeClass, "grid w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children || (
        <>
          <div className={styles.sampleCell}>Cell 1</div>
          <div className={styles.sampleCell}>Cell 2</div>
          <div className={styles.sampleCell}>Cell 3</div>
        </>
      )}
    </Component>
  );
}
