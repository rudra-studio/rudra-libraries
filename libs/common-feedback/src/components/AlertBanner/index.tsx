import React, { useState } from "react";
import styles from "./styles.module.scss";

export type AlertBannerThemeMode = "light" | "dark";
export type AlertBannerSeverity = "info" | "success" | "warning" | "error";
export type AlertBannerVariant = "soft" | "outlined" | "filled";

export interface AlertBannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "title"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: AlertBannerThemeMode;

  /**
   * Alert status severity.
   *
   * @select|info|success|warning|error
   */
  severity?: AlertBannerSeverity;

  /**
   * Visual styling variant.
   *
   * @select|soft|outlined|filled
   */
  variant?: AlertBannerVariant;

  /**
   * Optional banner heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Main banner message text.
   *
   * @translate
   */
  message?: string;

  /**
   * Allow dismissing the banner.
   *
   * @schema {"type":"boolean"}
   */
  dismissible?: boolean;

  /**
   * Callback invoked when dismissed.
   */
  onDismiss?: () => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const SEVERITY_ICONS: Record<AlertBannerSeverity, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "⛔",
};

export default function AlertBanner({
  themeMode = "light",
  severity = "info",
  variant = "soft",
  title = "Workspace Notice",
  message = "Changes are synced automatically across your session.",
  dismissible = true,
  onDismiss,
  className = "",
  ...props
}: AlertBannerProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const sevClass = styles[`sev_${severity}`] || styles.sev_info;
  const varClass = styles[`var_${variant}`] || styles.var_soft;
  const roleAttr =
    severity === "error" || severity === "warning" ? "alert" : "status";

  const handleClose = () => {
    setHidden(true);
    onDismiss?.();
  };

  return (
    <div
      {...props}
      role={roleAttr}
      data-theme={themeMode}
      className={[styles.banner, modeClass, sevClass, varClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.icon} aria-hidden="true">
        {SEVERITY_ICONS[severity]}
      </span>
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        {message && <div className={styles.message}>{message}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss alert"
          onClick={handleClose}
          className={styles.closeBtn}
        >
          ✕
        </button>
      )}
    </div>
  );
}
