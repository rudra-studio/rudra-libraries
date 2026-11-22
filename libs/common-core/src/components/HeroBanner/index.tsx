import React from "react";
import styles from "./styles.module.scss";

export type HeroBannerThemeMode = "light" | "dark";
export type HeroBannerLayout = "center" | "split";

export interface HeroBannerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "title"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: HeroBannerThemeMode;

  /**
   * Hero content alignment layout.
   *
   * @select|center|split
   */
  layout?: HeroBannerLayout;

  /**
   * Optional eyebrow badge text.
   *
   * @translate
   */
  badge?: string;

  /**
   * Main hero display title.
   *
   * @translate
   */
  title?: string;

  /**
   * Supporting description copy.
   *
   * @translate
   */
  description?: string;

  /**
   * Primary call-to-action button text.
   *
   * @translate
   */
  primaryActionLabel?: string;

  /**
   * Secondary call-to-action button text.
   *
   * @translate
   */
  secondaryActionLabel?: string;

  /**
   * Callback when primary CTA is clicked.
   */
  onPrimaryAction?: () => void;

  /**
   * Callback when secondary CTA is clicked.
   */
  onSecondaryAction?: () => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function HeroBanner({
  themeMode = "light",
  layout = "split",
  badge = "✦ Visual + Code Orchestration",
  title = "Build Modular Apps Without Code Lock-In",
  description = "Combine reusable UI libraries, visual canvas modules, and full-stack workflows into clean, customizable applications.",
  primaryActionLabel = "Get Started",
  secondaryActionLabel = "Explore Components",
  onPrimaryAction,
  onSecondaryAction,
  className = "",
  ...props
}: HeroBannerProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const layoutClass =
    layout === "center" ? styles.lay_center : styles.lay_split;

  return (
    <section
      {...props}
      data-theme={themeMode}
      className={[styles.banner, modeClass, layoutClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.copy}>
        {badge && <span className={styles.badge}>{badge}</span>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}

        {(primaryActionLabel || secondaryActionLabel) && (
          <div className={styles.actions}>
            {primaryActionLabel && (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => onPrimaryAction?.()}
              >
                {primaryActionLabel}
              </button>
            )}
            {secondaryActionLabel && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => onSecondaryAction?.()}
              >
                {secondaryActionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
