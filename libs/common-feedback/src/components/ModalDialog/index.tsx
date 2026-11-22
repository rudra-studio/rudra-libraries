import React, { useEffect } from "react";
import styles from "./styles.module.scss";

export type ModalDialogThemeMode = "light" | "dark";

export interface ModalDialogProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "title"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ModalDialogThemeMode;

  /**
   * Whether the modal is open.
   *
   * @schema {"type":"boolean"}
   */
  open?: boolean;

  /**
   * Modal dialog heading.
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
   * Primary confirm button label.
   *
   * @translate
   */
  confirmLabel?: string;

  /**
   * Secondary cancel button label.
   *
   * @translate
   */
  cancelLabel?: string;

  /**
   * Show the cancel button.
   *
   * @schema {"type":"boolean"}
   */
  showCancel?: boolean;

  /**
   * Callback when confirm is clicked.
   */
  onConfirm?: () => void;

  /**
   * Callback when cancel is clicked.
   */
  onCancel?: () => void;

  /**
   * Callback when modal requests close (backdrop or Escape).
   */
  onClose?: () => void;

  /**
   * Optional modal body content.
   */
  children?: React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function ModalDialog({
  themeMode = "light",
  open = true,
  title = "Confirm Action",
  description = "Are you sure you want to proceed with this change?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  showCancel = true,
  onConfirm,
  onCancel,
  onClose,
  children,
  className = "",
  ...props
}: ModalDialogProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      {...props}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
      data-theme={themeMode}
      onClick={() => onClose?.()}
      className={[styles.backdrop, modeClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {onClose && (
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className={styles.closeBtn}
            >
              ✕
            </button>
          )}
        </div>

        {description && <p className={styles.desc}>{description}</p>}

        {children && <div className={styles.body}>{children}</div>}

        <div className={styles.footer}>
          {showCancel && (
            <button
              type="button"
              onClick={() => {
                onCancel?.();
                onClose?.();
              }}
              className={styles.cancelBtn}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={() => onConfirm?.()}
            className={styles.confirmBtn}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
