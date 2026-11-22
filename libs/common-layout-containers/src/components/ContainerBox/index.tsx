import React from "react";
import styles from "./styles.module.scss";

export type ContainerBoxThemeMode = "light" | "dark";
export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "full";
export type ContainerPadding = "none" | "sm" | "md" | "lg";

export interface ContainerBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "title"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ContainerBoxThemeMode;

  /**
   * Maximum width constraint for the container.
   *
   * @select|sm|md|lg|xl|full
   */
  maxWidth?: ContainerMaxWidth;

  /**
   * Inner spacing padding preset.
   *
   * @select|none|sm|md|lg
   */
  padding?: ContainerPadding;

  /**
   * Horizontally center the container within its parent.
   *
   * @schema {"type":"boolean"}
   */
  centered?: boolean;

  /**
   * Optional container title.
   *
   * @translate
   */
  title?: string;

  /**
   * Optional supporting subtitle.
   *
   * @translate
   */
  subtitle?: string;

  /**
   * Optional nested elements inside the container.
   */
  children?: React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function ContainerBox({
  themeMode = "light",
  maxWidth = "lg",
  padding = "md",
  centered = true,
  title = "Bounded Content Container",
  subtitle = "Consistent width constraints and spacing across screens.",
  children,
  className = "",
  ...props
}: ContainerBoxProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const widthClass = styles[`mw_${maxWidth}`] || styles.mw_lg;
  const padClass = styles[`pad_${padding}`] || styles.pad_md;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[
        styles.box,
        modeClass,
        widthClass,
        padClass,
        centered ? styles.centered : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(title || subtitle) && (
        <div className={styles.head}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
