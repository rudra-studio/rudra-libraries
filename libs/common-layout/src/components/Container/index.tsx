import React from "react";
import styles from "./styles.module.scss";

export type ContainerThemeMode = "light" | "dark";
export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
export type ContainerElement = "div" | "section" | "main" | "article" | "header" | "footer";

export interface ContainerProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ContainerThemeMode;

  /**
   * Semantic container tag.
   *
   * @select|div|section|main|article|header|footer
   */
  as?: ContainerElement;

  /**
   * Maximum width preset.
   *
   * @select|sm|md|lg|xl|2xl|full|none
   */
  maxWidth?: ContainerMaxWidth;

  /**
   * Center horizontally using mx-auto.
   *
   * @schema {"type":"boolean"}
   */
  centered?: boolean;

  /**
   * Container content.
   */
  children?: React.ReactNode;

  /**
   * Additional utility classes.
   *
   * @type|class
   */
  className?: string;
}

const MAX_WIDTH_CLASSES: Record<ContainerMaxWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
  none: "",
};

export default function Container({
  themeMode = "light",
  as = "div",
  maxWidth = "xl",
  centered = true,
  children,
  className = "px-4 py-6",
  ...props
}: ContainerProps) {
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
        "w-full",
        MAX_WIDTH_CLASSES[maxWidth] || "",
        centered ? "mx-auto" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children || (
        <div className={styles.placeholder}>
          <span>Container ({maxWidth})</span>
        </div>
      )}
    </Component>
  );
}
