import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.scss";
import { X } from "lucide-react";

export type ModalTheme = "light" | "dark" | "auto";
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
export type ModalCloseReason = "overlay" | "escape" | "button";

export interface ModalProps {
  open?: boolean;
  children?: React.ReactNode;

  /** @select|light|dark|auto */
  theme?: ModalTheme;

  /** @select|sm|md|lg|xl|full */
  size?: ModalSize;

  container?: Element | DocumentFragment | null;
  containerId?: string;
  createContainer?: boolean;

  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;

  /** @type|class */
  className?: string;

  /** @type|class */
  overlayClassName?: string;

  /** @type|function */
  onClose?: (reason?: ModalCloseReason) => void;
}

export default function Modal({
  open = false,
  children,
  theme = "auto",
  size = "md",
  container,
  containerId = "rudra-modal-root",
  createContainer = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
  overlayClassName = "",
  onClose,
}: ModalProps) {
  const [target, setTarget] = useState<Element | DocumentFragment | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (open) {
      setDismissed(false);
    }
  }, [open]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let resolvedTarget =
      container || document.getElementById(containerId);

    let createdElement: HTMLElement | null = null;

    if (!resolvedTarget && createContainer) {
      createdElement = document.createElement("div");
      createdElement.id = containerId;
      createdElement.dataset.rudraModalRoot = "true";

      document.body.appendChild(createdElement);

      resolvedTarget = createdElement;
    }

    setTarget(resolvedTarget || document.body);

    return () => {
      if (!createdElement) return;

      window.setTimeout(() => {
        if (createdElement?.childElementCount === 0) {
          createdElement.remove();
        }
      }, 0);
    };
  }, [container, containerId, createContainer]);

  const closeModal = (reason: ModalCloseReason) => {
    setDismissed(true);
    onClose?.(reason);
  };

  useEffect(() => {
    if (!open || dismissed || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal("escape");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, dismissed, closeOnEscape]);

  if (!open || dismissed || !target) {
    return null;
  }

  const modalClassName = [
    styles.modal,
    styles[`theme_${theme}`],
    styles[`size_${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const overlayClasses = [
    styles.overlay,
    overlayClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div
      className={overlayClasses}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          closeOnOverlayClick
        ) {
          closeModal("overlay");
        }
      }}
    >
      <div
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            className={styles.close}
            aria-label="Close modal"
            onClick={() => closeModal("button")}
          >
            <X size={20} strokeWidth={2} />
          </button>
        )}

        {children}
      </div>
    </div>,
    target
  );
}