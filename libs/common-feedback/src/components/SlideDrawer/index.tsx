import React, { useEffect } from "react";
import styles from "./styles.module.scss";

export type SlideDrawerThemeMode = "light" | "dark";
export type SlideDrawerAnchor = "left" | "right";

export interface SlideDrawerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "title"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SlideDrawerThemeMode;

  /**
   * Whether the drawer is open.
   *
   * @schema {"type":"boolean"}
   */
  open?: boolean;

  /**
   * Side edge alignment for the drawer panel.
   *
   * @select|left|right
   */
  anchor?: SlideDrawerAnchor;

  /**
   * Drawer header title.
   *
   * @translate
   */
  title?: string;

  /**
   * Optional drawer summary text.
   *
   * @translate
   */
  bodyText?: string;

  /**
   * Callback when closing the drawer.
   */
  onClose?: () => void;

  /**
   * Optional drawer body elements.
   */
  children?: React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function SlideDrawer({
  themeMode = "light",
  open = true,
  anchor = "right",
  title = "Inspector Panel",
  bodyText = "Configure properties, filters, or details inside this drawer.",
  onClose,
  children,
  className = "",
  ...props
}: SlideDrawerProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const sideClass = anchor === "left" ? styles.anchor_left : styles.anchor_right;

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
      aria-label={title || "Drawer"}
      data-theme={themeMode}
      onClick={() => onClose?.()}
      className={[styles.backdrop, modeClass, sideClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {onClose && (
            <button
              type="button"
              aria-label="Close drawer"
              onClick={onClose}
              className={styles.closeBtn}
            >
              ✕
            </button>
          )}
        </div>
        <div className={styles.content}>
          {bodyText && <p className={styles.desc}>{bodyText}</p>}
          {children}
        </div>
      </aside>
    </div>
  );
}
