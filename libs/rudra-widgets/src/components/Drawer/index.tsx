import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./styles.module.scss";

export type DrawerPosition = "left" | "right" | "top" | "bottom";
export type DrawerCloseReason = "overlay" | "escape" | "button";

export interface DrawerTriggerContext {
  open: boolean;
  openDrawer: () => void;
}

export interface DrawerProps {
  /**
   * Trigger node used to open the drawer.
   * @nodeFunction
   */
  trigger?: React.ReactNode | ((context: DrawerTriggerContext) => React.ReactNode);

  children?: React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;

  /** @select|left|right|top|bottom */
  position?: DrawerPosition;

  animationDuration?: number;

  container?: Element | DocumentFragment | null;
  containerId?: string;
  createContainer?: boolean;

  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;

  /** @translate */
  ariaLabel?: string;

  /**
   * Drawer customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   },
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"64","label":"Small"},
   *       {"key":"80","label":"Medium"},
   *       {"key":"96","label":"Large"},
   *       {"key":"1/2","label":"50%"},
   *       {"key":"2/3","label":"66%"},
   *       {"key":"3/4","label":"75%"},
   *       {"key":"full","label":"Full Width"}
   *     ]
   *   },
   *   {
   *     "key":"Height",
   *     "prefix":"h",
   *     "type":"select",
   *     "options":[
   *       {"key":"64","label":"Small"},
   *       {"key":"80","label":"Medium"},
   *       {"key":"96","label":"Large"},
   *       {"key":"1/2","label":"50%"},
   *       {"key":"2/3","label":"66%"},
   *       {"key":"3/4","label":"75%"},
   *       {"key":"full","label":"Full Height"}
   *     ]
   *   },
   *   {
   *     "key":"Shadow",
   *     "prefix":"shadow",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"2xl","label":"2XL"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Overlay customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"black/10","label":"Very Light"},
   *       {"key":"black/20","label":"Light"},
   *       {"key":"black/40","label":"Medium"},
   *       {"key":"black/60","label":"Dark"}
   *     ]
   *   }
   * ]
   */
  overlayClassName?: string;

  /**
   * Trigger wrapper customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Display",
   *     "prefix":"",
   *     "type":"select",
   *     "options":[
   *       {"key":"inline-flex","label":"Inline Flex"},
   *       {"key":"inline-block","label":"Inline Block"},
   *       {"key":"flex","label":"Flex"},
   *       {"key":"block","label":"Block"}
   *     ]
   *   }
   * ]
   */
  triggerClassName?: string;

  /**
   * Close button customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-200","label":"Gray 200"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"black","label":"Black"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-600","label":"Gray 600"},
   *       {"key":"gray-900","label":"Gray 900"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"full","label":"Circle"}
   *     ]
   *   }
   * ]
   */
  closeButtonClassName?: string;

  /** @type|function */
  onOpenChange?: (open: boolean) => void;

  /** @type|function */
  onClose?: (reason?: DrawerCloseReason) => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  trigger,
  children,
  open,
  defaultOpen = false,
  position = "right",
  animationDuration = 250,
  container,
  containerId = "rudra-drawer-root",
  createContainer = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  ariaLabel = "Drawer",
  className = "",
  overlayClassName = "",
  triggerClassName = "",
  closeButtonClassName = "",
  onOpenChange,
  onClose,
}) => {
  const controlled = open !== undefined;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const drawerOpen = controlled ? open : internalOpen;

  const [mounted, setMounted] = useState(drawerOpen);
  const [visible, setVisible] = useState(false);

  const [target, setTarget] =
    useState<Element | DocumentFragment | null>(null);

  const closeTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const frameRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    let resolvedTarget =
      container || document.getElementById(containerId);

    let createdElement: HTMLElement | null = null;

    if (!resolvedTarget && createContainer) {
      createdElement = document.createElement("div");
      createdElement.id = containerId;
      createdElement.dataset.rudraDrawerRoot = "true";

      document.body.appendChild(createdElement);

      resolvedTarget = createdElement;
    }

    setTarget(resolvedTarget || document.body);

    return () => {
      if (
        createdElement &&
        createdElement.parentNode
      ) {
        createdElement.remove();
      }
    };
  }, [container, containerId, createContainer]);

  useEffect(() => {
    clearTimers();

    if (drawerOpen) {
      setMounted(true);

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          setVisible(true);
        });
      });

      return;
    }

    setVisible(false);

    if (mounted) {
      closeTimerRef.current = setTimeout(() => {
        setMounted(false);
      }, animationDuration);
    }

    return clearTimers;
  }, [drawerOpen, animationDuration]);

  useEffect(() => {
    return clearTimers;
  }, []);

  const requestOpen = () => {
    if (!controlled) {
      setInternalOpen(true);
    }

    onOpenChange?.(true);
  };

  const requestClose = (reason: DrawerCloseReason) => {
    if (!controlled) {
      setInternalOpen(false);
    }

    onOpenChange?.(false);
    onClose?.(reason);
  };

  useEffect(() => {
    if (!mounted || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose("escape");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, closeOnEscape, controlled]);

  const renderTrigger = () => {
    if (!trigger) return null;

    const triggerNode =
      typeof trigger === "function"
        ? trigger({
            open: drawerOpen,
            openDrawer: requestOpen,
          })
        : trigger;

    return (
      <span
        className={[
          styles.trigger,
          triggerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={requestOpen}
      >
        {triggerNode}
      </span>
    );
  };

  const drawer = mounted && target
    ? createPortal(
        <div
          className={[
            styles.overlay,
            visible ? styles.overlayOpen : "",
            overlayClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            transitionDuration: `${animationDuration}ms`,
          }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              closeOnOverlayClick
            ) {
              requestClose("overlay");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className={[
              styles.drawer,
              styles[position],
              visible ? styles.drawerOpen : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              transitionDuration: `${animationDuration}ms`,
            }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {showCloseButton && (
              <button
                type="button"
                aria-label="Close drawer"
                className={[
                  styles.close,
                  closeButtonClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  requestClose("button")
                }
              >
                <X
                  size={20}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            )}

            {children}
          </div>
        </div>,
        target
      )
    : null;

  return (
    <>
      {renderTrigger()}
      {drawer}
    </>
  );
};

export default Drawer;