import React, { useEffect } from "react";
import styles from "./styles.module.scss";

export type LightboxModalThemeMode = "light" | "dark";

export interface LightboxModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: LightboxModalThemeMode;

  /**
   * Control whether the lightbox modal is visible.
   *
   * @schema {"type":"boolean"}
   */
  open?: boolean;

  /**
   * Image or media URL to display.
   */
  src?: string;

  /**
   * Accessible alternative text for the enlarged media.
   *
   * @translate
   */
  alt?: string;

  /**
   * Optional caption displayed beneath the media.
   *
   * @translate
   */
  caption?: string;

  /**
   * Callback invoked when closing the modal.
   */
  onClose?: () => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function LightboxModal({
  themeMode = "light",
  open = true,
  src = "",
  alt = "Enlarged media preview",
  caption = "High-resolution preview caption",
  onClose,
  className = "",
  ...props
}: LightboxModalProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      {...props}
      role="dialog"
      aria-modal="true"
      aria-label={alt || caption || "Lightbox preview"}
      data-theme={themeMode}
      onClick={() => onClose?.()}
      className={[styles.backdrop, modeClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={styles.dialog}
      >
        <div className={styles.topBar}>
          <span className={styles.title}>{alt || "Media Lightbox"}</span>
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={() => onClose?.()}
            className={styles.closeBtn}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {src ? (
            <img src={src} alt={alt} className={styles.img} />
          ) : (
            <div className={styles.placeholder}>
              <span>{alt || "Lightbox Media Preview"}</span>
              <small>Pass a media src URL to display full image</small>
            </div>
          )}
        </div>

        {caption && <div className={styles.caption}>{caption}</div>}
      </div>
    </div>
  );
}
