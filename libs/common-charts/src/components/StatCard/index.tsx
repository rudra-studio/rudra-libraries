import React from "react";
import styles from "./styles.module.scss";

export type StatCardThemeMode = "light" | "dark";
export type StatCardDeltaTone = "positive" | "negative" | "neutral";

export interface StatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: StatCardThemeMode;

  /**
   * Metric label text.
   *
   * @translate
   */
  label?: string;

  /**
   * Primary formatted metric value.
   *
   * @translate
   */
  value?: string;

  /**
   * Optional trend or change badge text (e.g. "+14%").
   *
   * @translate
   */
  delta?: string;

  /**
   * Semantic tone for the delta badge.
   *
   * @select|positive|negative|neutral
   */
  deltaTone?: StatCardDeltaTone;

  /**
   * Optional icon or badge glyph.
   *
   * @translate
   */
  icon?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function StatCard({
  themeMode = "light",
  label = "Active Modules",
  value = "24",
  delta = "+18%",
  deltaTone = "positive",
  icon = "📊",
  className = "",
  ...props
}: StatCardProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const toneClass =
    deltaTone === "negative"
      ? styles.tone_negative
      : deltaTone === "neutral"
        ? styles.tone_neutral
        : styles.tone_positive;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.topRow}>
        <span className={styles.label}>{label}</span>
        {icon && (
          <span aria-hidden="true" className={styles.icon}>
            {icon}
          </span>
        )}
      </div>

      <div className={styles.bottomRow}>
        <span className={styles.value}>{value}</span>
        {delta && (
          <span className={`${styles.delta} ${toneClass}`}>{delta}</span>
        )}
      </div>
    </div>
  );
}
