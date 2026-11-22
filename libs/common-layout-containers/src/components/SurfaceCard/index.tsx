import React from "react";
import styles from "./styles.module.scss";

export type SurfaceCardThemeMode = "light" | "dark";
export type SurfaceCardElevation = "flat" | "bordered" | "elevated";

export interface SurfaceCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SurfaceCardThemeMode;

  /**
   * Surface border and shadow elevation style.
   *
   * @select|flat|bordered|elevated
   */
  elevation?: SurfaceCardElevation;

  /**
   * Card header title.
   *
   * @translate
   */
  headerText?: string;

  /**
   * Main card body text.
   *
   * @translate
   */
  bodyText?: string;

  /**
   * Optional footer metadata text.
   *
   * @translate
   */
  footerText?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function SurfaceCard({
  themeMode = "light",
  elevation = "bordered",
  headerText = "Reusable Surface Card",
  bodyText = "Clean surface container for summaries, feature highlights, and module blocks.",
  footerText = "Ready for composition",
  className = "",
  ...props
}: SurfaceCardProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const elevClass = styles[`elev_${elevation}`] || styles.elev_bordered;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, elevClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {headerText && <div className={styles.header}>{headerText}</div>}
      {bodyText && <p className={styles.body}>{bodyText}</p>}
      {footerText && <div className={styles.footer}>{footerText}</div>}
    </div>
  );
}
