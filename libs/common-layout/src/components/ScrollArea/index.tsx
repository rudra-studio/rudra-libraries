import React from "react";
import styles from "./styles.module.scss";

export type ScrollAreaThemeMode = "light" | "dark";
export type ScrollAreaElement = "div" | "section" | "article" | "aside";

export interface ScrollAreaProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ScrollAreaThemeMode;

  /**
   * Semantic container tag.
   *
   * @select|div|section|article|aside
   */
  as?: ScrollAreaElement;

  /**
   * Scrollable content.
   */
  children?: React.ReactNode;

  /**
   * Height, overflow, snap, and padding utility classes.
   *
   * @type|class
   */
  className?: string;
}

export default function ScrollArea({
  themeMode = "light",
  as = "div",
  children,
  className = "h-48 w-full p-3 rounded-lg border",
  ...props
}: ScrollAreaProps) {
  const Component = as;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <Component
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, "overflow-auto", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children || (
        <div className={styles.sampleContent}>
          <p>Scrollable region content — line 1</p>
          <p>Scrollable region content — line 2</p>
          <p>Scrollable region content — line 3</p>
          <p>Scrollable region content — line 4</p>
          <p>Scrollable region content — line 5</p>
        </div>
      )}
    </Component>
  );
}
