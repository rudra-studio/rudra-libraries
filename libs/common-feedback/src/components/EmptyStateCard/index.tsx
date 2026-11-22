import React from "react";
import styles from "./styles.module.scss";

export type EmptyStateCardThemeMode = "light" | "dark";

export interface EmptyStateCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "title" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: EmptyStateCardThemeMode;

  /**
   * Optional icon or emoji glyph above the title.
   *
   * @translate
   */
  icon?: string;

  /**
   * Empty state heading text.
   *
   * @translate
   */
  title?: string;

  /**
   * Supporting message explaining why the view is empty.
   *
   * @translate
   */
  description?: string;

  /**
   * Optional primary action button label.
   *
   * @translate
   */
  actionLabel?: string;

  /**
   * Callback when the action button is clicked.
   */
  onAction?: () => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function EmptyStateCard({
  themeMode = "light",
  icon = "📭",
  title = "No Items Yet",
  description = "Create your first item or adjust your filters to get started.",
  actionLabel = "Create Item",
  onAction,
  className = "",
  ...props
}: EmptyStateCardProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.desc}>{description}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className={styles.btn}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
