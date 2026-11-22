import React from "react";
import styles from "./styles.module.scss";

export type SectionFrameThemeMode = "light" | "dark";

export interface SectionFrameProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SectionFrameThemeMode;

  /**
   * Section heading text.
   *
   * @translate
   */
  heading?: string;

  /**
   * Supporting section description.
   *
   * @translate
   */
  description?: string;

  /**
   * Optional badge text displayed beside the heading.
   *
   * @translate
   */
  badgeText?: string;

  /**
   * Optional summary note below the header.
   *
   * @translate
   */
  summaryText?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function SectionFrame({
  themeMode = "light",
  heading = "Section Overview",
  description = "Group related metrics, forms, or panels into a clear structural band.",
  badgeText = "Layout",
  summaryText = "Theme-aware section surface with light and dark mode support.",
  className = "",
  ...props
}: SectionFrameProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <section
      {...props}
      data-theme={themeMode}
      className={[styles.section, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.topRow}>
        <div className={styles.titleWrap}>
          {heading && <h3 className={styles.heading}>{heading}</h3>}
          {badgeText && <span className={styles.badge}>{badgeText}</span>}
        </div>
      </div>
      {description && <p className={styles.desc}>{description}</p>}
      {summaryText && <div className={styles.summary}>{summaryText}</div>}
    </section>
  );
}
