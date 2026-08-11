import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export type AlertVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export type AlertAppearance =
  | "soft"
  | "outlined"
  | "solid";

export type AlertTheme =
  | "light"
  | "dark"
  | "auto";

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;

  /** @select|info|success|warning|error|neutral */
  variant?: AlertVariant;

  /** @select|soft|outlined|solid */
  appearance?: AlertAppearance;

  /** @select|light|dark|auto */
  theme?: AlertTheme;

  dismissible?: boolean;

  /** @translate */
  closeLabel?: string;

  /** @select|off|polite|assertive */
  live?: "off" | "polite" | "assertive";

  /** @type|function */
  onDismiss?: () => void;
}

export default function Alert({
  title,
  children = "Important information is available.",
  icon,
  action,
  variant = "info",
  appearance = "soft",
  theme = "auto",
  dismissible = false,
  closeLabel = "Dismiss notification",
  live,
  onDismiss,
  className = "",
  role,
  ...props
}: AlertProps) {
  const titleId = useId();
  const bodyId = useId();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const resolvedRole =
    role || (variant === "error" ? "alert" : "status");

  const resolvedLive =
    live === "off"
      ? undefined
      : live || (resolvedRole === "alert" ? "assertive" : "polite");

  const classNames = [
    styles.root,
    styles[`variant_${variant}`],
    styles[`appearance_${appearance}`],
    styles[`theme_${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      {...props}
      className={classNames}
      role={resolvedRole}
      aria-live={resolvedLive}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={children ? bodyId : undefined}
    >
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}

      <div className={styles.content}>
        {title && (
          <div id={titleId} className={styles.title}>
            {title}
          </div>
        )}

        {children && (
          <div id={bodyId} className={styles.body}>
            {children}
          </div>
        )}
      </div>

      {action && (
        <div className={styles.action}>
          {action}
        </div>
      )}

      {dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={closeLabel}
          onClick={handleDismiss}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}