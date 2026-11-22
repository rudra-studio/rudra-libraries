import React from "react";
import styles from "./styles.module.scss";

export type StackThemeMode = "light" | "dark";
export type StackDirection = "vertical" | "horizontal";
export type StackElement = "div" | "section" | "article" | "main" | "aside" | "nav" | "ul";

export interface StackProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: StackThemeMode;

  /**
   * Semantic container tag.
   *
   * @select|div|section|article|main|aside|nav|ul
   */
  as?: StackElement;

  /**
   * Stack axis direction.
   *
   * @select|vertical|horizontal
   */
  direction?: StackDirection;

  /**
   * Spacing step between items (0 to 12).
   */
  gap?: number;

  /**
   * Wrap items onto multiple lines.
   *
   * @schema {"type":"boolean"}
   */
  wrap?: boolean;

  /**
   * Stack child nodes.
   */
  children?: React.ReactNode;

  /**
   * Alignment, justification, and spacing utility classes.
   *
   * @type|class
   */
  className?: string;
}

export default function Stack({
  themeMode = "light",
  as = "div",
  direction = "vertical",
  gap = 4,
  wrap = false,
  children,
  className = "",
  ...props
}: StackProps) {
  const Component = as;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const safeGap = Math.max(0, Math.min(12, Number.isFinite(gap) ? gap : 4));

  return (
    <Component
      {...props}
      data-theme={themeMode}
      style={{
        ...props.style,
        gap: `${safeGap * 0.25}rem`,
      }}
      className={[
        styles.root,
        modeClass,
        "flex",
        direction === "horizontal" ? "flex-row items-center" : "flex-col",
        wrap ? "flex-wrap" : "flex-nowrap",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children || (
        <>
          <div className={styles.sampleItem}>Stack Item A</div>
          <div className={styles.sampleItem}>Stack Item B</div>
        </>
      )}
    </Component>
  );
}
