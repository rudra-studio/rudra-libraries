import React from "react";
import styles from "./styles.module.scss";

export type FlexThemeMode = "light" | "dark";
export type FlexElement = "div" | "section" | "article" | "main" | "aside" | "nav";
export type FlexDirection = "row" | "col" | "row-reverse" | "col-reverse";

export interface FlexProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: FlexThemeMode;

  /**
   * Semantic HTML element.
   *
   * @select|div|section|article|main|aside|nav
   */
  as?: FlexElement;

  /**
   * Flex direction.
   *
   * @select|row|col|row-reverse|col-reverse
   */
  direction?: FlexDirection;

  /**
   * Wrap flex items.
   *
   * @schema {"type":"boolean"}
   */
  wrap?: boolean;

  /**
   * Flex child nodes.
   */
  children?: React.ReactNode;

  /**
   * Gap, alignment, justification, and spacing utility classes.
   *
   * @type|class
   */
  className?: string;
}

const DIRECTION_CLASSES: Record<FlexDirection, string> = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse",
};

export default function Flex({
  themeMode = "light",
  as = "div",
  direction = "row",
  wrap = true,
  children,
  className = "gap-4 items-center",
  ...props
}: FlexProps) {
  const Component = as;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <Component
      {...props}
      data-theme={themeMode}
      className={[
        styles.root,
        modeClass,
        "flex",
        DIRECTION_CLASSES[direction],
        wrap ? "flex-wrap" : "flex-nowrap",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children || (
        <>
          <div className={styles.sampleItem}>Item 1</div>
          <div className={styles.sampleItem}>Item 2</div>
        </>
      )}
    </Component>
  );
}
