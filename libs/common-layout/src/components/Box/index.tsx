import React from "react";
import styles from "./styles.module.scss";

export type BoxThemeMode = "light" | "dark";

export interface BoxProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: BoxThemeMode;

  /**
   * Optional custom attributes applied to the root element.
   */
  customAttributes?: Record<string, string | number | boolean>;

  /**
   * Container children.
   */
  children?: React.ReactNode;

  /**
   * Layout, spacing, border, and surface utility classes.
   *
   * @type|class
   */
  className?: string;
}

export default function Box({
  themeMode = "light",
  customAttributes,
  children,
  className = "p-4 rounded-lg",
  ...props
}: BoxProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <div
      {...props}
      {...(customAttributes || {})}
      data-theme={themeMode}
      className={[styles.root, modeClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children || (
        <div className={styles.placeholder}>
          <span>Box Container</span>
        </div>
      )}
    </div>
  );
}
