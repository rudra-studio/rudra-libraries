import React from "react";
import styles from "./styles.module.scss";

export type PulseBeaconThemeMode = "light" | "dark";
export type PulseBeaconTone = "info" | "success" | "warning" | "danger";

export interface PulseBeaconProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: PulseBeaconThemeMode;

  /**
   * Status tone color.
   *
   * @select|info|success|warning|danger
   */
  tone?: PulseBeaconTone;

  /**
   * Primary status label.
   *
   * @translate
   */
  label?: string;

  /**
   * Optional secondary detail text.
   *
   * @translate
   */
  sublabel?: string;

  /**
   * Animate the outer status pulse ring.
   *
   * @schema {"type":"boolean"}
   */
  pulsing?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function PulseBeacon({
  themeMode = "light",
  tone = "success",
  label = "Live Sync",
  sublabel = "Connected",
  pulsing = true,
  className = "",
  ...props
}: PulseBeaconProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const toneClass = styles[`tone_${tone}`] || styles.tone_info;

  return (
    <div
      {...props}
      role="status"
      data-theme={themeMode}
      className={[styles.beacon, modeClass, toneClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.dotWrap} aria-hidden="true">
        <span className={styles.core} />
        {pulsing && <span className={styles.ring} />}
      </span>
      <div className={styles.labels}>
        {label && <span className={styles.label}>{label}</span>}
        {sublabel && <span className={styles.sub}>{sublabel}</span>}
      </div>
    </div>
  );
}
