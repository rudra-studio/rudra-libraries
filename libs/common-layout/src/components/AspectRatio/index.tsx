import React from "react";
import styles from "./styles.module.scss";

export type AspectRatioThemeMode = "light" | "dark";
export type AspectRatioElement = "div" | "section" | "figure";

export interface AspectRatioProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: AspectRatioThemeMode;

  /**
   * Semantic container element.
   *
   * @select|div|section|figure
   */
  as?: AspectRatioElement;

  /**
   * Content inside the aspect-locked container.
   */
  children?: React.ReactNode;

  /**
   * Aspect ratio, width, radius, and overflow utilities.
   *
   * @type|class
   */
  className?: string;
}

export default function AspectRatio({
  themeMode = "light",
  as = "div",
  children,
  className = "aspect-video w-full rounded-lg overflow-hidden",
  ...props
}: AspectRatioProps) {
  const Component = as;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <Component
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children || (
        <div className={styles.placeholder}>
          <span>16:9 Media Frame</span>
        </div>
      )}
    </Component>
  );
}
