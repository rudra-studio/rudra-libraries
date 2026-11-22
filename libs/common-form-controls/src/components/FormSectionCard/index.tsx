import React from "react";
import styles from "./styles.module.scss";

export type FormSectionCardThemeMode = "light" | "dark";

export interface FormSectionCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: FormSectionCardThemeMode;

  /**
   * Section heading text.
   *
   * @translate
   */
  sectionTitle?: string;

  /**
   * Supporting description copy.
   *
   * @translate
   */
  sectionDescription?: string;

  /**
   * Optional status or step badge label.
   *
   * @translate
   */
  badgeLabel?: string;

  /**
   * Optional footer note text.
   *
   * @translate
   */
  footerNote?: string;

  /**
   * Nested form controls or content inside the section card.
   */
  children?: React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function FormSectionCard({
  themeMode = "light",
  sectionTitle = "Account & Preferences",
  sectionDescription = "Configure your workspace defaults, notifications, and profile details.",
  badgeLabel = "Step 1",
  footerNote = "All changes are validated before saving.",
  children,
  className = "",
  ...props
}: FormSectionCardProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <section
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          {sectionTitle && <h3 className={styles.title}>{sectionTitle}</h3>}
          {badgeLabel && <span className={styles.badge}>{badgeLabel}</span>}
        </div>
        {sectionDescription && (
          <p className={styles.desc}>{sectionDescription}</p>
        )}
      </div>

      {children && <div className={styles.body}>{children}</div>}

      {footerNote && <div className={styles.footer}>{footerNote}</div>}
    </section>
  );
}
