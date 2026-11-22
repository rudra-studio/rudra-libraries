import React from "react";
import styles from "./styles.module.scss";

export type ToastBarThemeMode = "light" | "dark";
export type ToastBarSeverity = "info" | "success" | "warning" | "error";

export interface ToastBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ToastBarThemeMode;

  /**
   * Notification severity tone.
   *
   * @select|info|success|warning|error
   */
  severity?: ToastBarSeverity;

  /**
   * Toast message text.
   *
   * @translate
   */
  message?: string;

  /**
   * Optional action button label.
   *
   * @translate
   */
  actionLabel?: string;

  /**
   * Callback when the action button is clicked.
   */
  onAction?: () => void;

  /**
   * Callback when the toast is dismissed.
   */
  onClose?: () => void;

  /**
   * Whether the toast is visible.
   *
   * @schema {"type":"boolean"}
   */
  open?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DOT_ICONS: Record<ToastBarSeverity, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "⛔",
};

export default function ToastBar({
  themeMode = "light",
  severity = "success",
  message = "Draft saved successfully.",
  actionLabel = "Undo",
  onAction,
  onClose,
  open = true,
  className = "",
  ...props
}: ToastBarProps) {
  if (!open) return null;

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const sevClass = styles[`sev_${severity}`] || styles.sev_info;

  return (
    <div
      {...props}
      role="status"
      aria-live="polite"
      data-theme={themeMode}
      className={[styles.toast, modeClass, sevClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.icon} aria-hidden="true">
        {DOT_ICONS[severity]}
      </span>
      <span className={styles.msg}>{message}</span>
      <div className={styles.actions}>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className={styles.actionBtn}
          >
            {actionLabel}
          </button>
        )}
        {onClose && (
          <button
            type="button"
            aria-label="Close notification"
            onClick={onClose}
            className={styles.closeBtn}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
