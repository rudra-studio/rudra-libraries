import React from "react";
import styles from "./styles.module.scss";

export type StatusBadgeThemeMode = "light" | "dark";
export type StatusBadgeTone = "neutral" | "info" | "success" | "warning" | "danger";
export type StatusBadgeVariant = "soft" | "solid" | "outline";

export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: StatusBadgeThemeMode;

  /**
   * Badge label text.
   *
   * @translate
   */
  label?: string;

  /**
   * Semantic tone color.
   *
   * @select|neutral|info|success|warning|danger
   */
  tone?: StatusBadgeTone;

  /**
   * Badge fill style variant.
   *
   * @select|soft|solid|outline
   */
  variant?: StatusBadgeVariant;

  /**
   * Display a leading indicator dot.
   *
   * @schema {"type":"boolean"}
   */
  showDot?: boolean;

  /**
   * Root element customization.
   *
   * @type|class
   */
  className?: string;
}

export default function StatusBadge({
  themeMode = "light",
  label = "Published",
  tone = "success",
  variant = "soft",
  showDot = true,
  className = "",
  ...props
}: StatusBadgeProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const toneClass = styles[`tone_${tone}`] || styles.tone_neutral;
  const varClass = styles[`var_${variant}`] || styles.var_soft;

  return (
    <span
      {...props}
      data-theme={themeMode}
      className={[styles.badge, modeClass, toneClass, varClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      {showDot && <span className={styles.dot} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
}
