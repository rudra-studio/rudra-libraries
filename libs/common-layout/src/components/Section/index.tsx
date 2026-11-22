import React from "react";
import styles from "./styles.module.scss";

export type SectionThemeMode = "light" | "dark";
export type SectionElement = "section" | "div" | "main" | "article" | "aside";

export interface SectionProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SectionThemeMode;

  /**
   * Semantic landmark element.
   *
   * @select|section|div|main|article|aside
   */
  as?: SectionElement;

  /**
   * Optional custom attributes applied to the section element.
   */
  customAttributes?: Record<string, string | number | boolean>;

  /**
   * Section child elements.
   */
  children?: React.ReactNode;

  /**
   * Section padding, background, and layout utility classes.
   *
   * @type|class
   */
  className?: string;
}

export default function Section({
  themeMode = "light",
  as = "section",
  customAttributes,
  children,
  className = "py-10 px-4",
  ...props
}: SectionProps) {
  const Component = as;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <Component
      {...props}
      {...(customAttributes || {})}
      data-theme={themeMode}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children || (
        <div className={styles.placeholder}>
          <span>Section Band</span>
        </div>
      )}
    </Component>
  );
}
