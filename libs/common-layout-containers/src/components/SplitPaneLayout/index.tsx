import React from "react";
import styles from "./styles.module.scss";

export type SplitPaneThemeMode = "light" | "dark";
export type SplitRatio = "50-50" | "65-35" | "35-65";

export interface SplitPaneLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SplitPaneThemeMode;

  /**
   * Width ratio between primary and secondary panes.
   *
   * @select|50-50|65-35|35-65
   */
  ratio?: SplitRatio;

  /**
   * Title for the primary pane.
   *
   * @translate
   */
  primaryTitle?: string;

  /**
   * Body copy for the primary pane.
   *
   * @translate
   */
  primaryBody?: string;

  /**
   * Title for the secondary pane.
   *
   * @translate
   */
  secondaryTitle?: string;

  /**
   * Body copy for the secondary pane.
   *
   * @translate
   */
  secondaryBody?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function SplitPaneLayout({
  themeMode = "light",
  ratio = "65-35",
  primaryTitle = "Primary Workspace",
  primaryBody = "Main content area, live preview, or primary table view.",
  secondaryTitle = "Secondary Inspector",
  secondaryBody = "Contextual controls, metadata, or summary details.",
  className = "",
  ...props
}: SplitPaneLayoutProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const ratioClass = styles[`ratio_${ratio.replace("-", "_")}`] || styles.ratio_65_35;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.split, modeClass, ratioClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.pane}>
        {primaryTitle && <h4 className={styles.paneTitle}>{primaryTitle}</h4>}
        {primaryBody && <p className={styles.paneBody}>{primaryBody}</p>}
      </div>

      <div className={styles.pane}>
        {secondaryTitle && (
          <h4 className={styles.paneTitle}>{secondaryTitle}</h4>
        )}
        {secondaryBody && <p className={styles.paneBody}>{secondaryBody}</p>}
      </div>
    </div>
  );
}
