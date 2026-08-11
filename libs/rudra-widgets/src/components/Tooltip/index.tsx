import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type TooltipPosition =
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface TooltipProps {
  children?: React.ReactNode;
  content?: React.ReactNode;

  /** @select|top|bottom|left|right */
  position?: TooltipPosition;

  disabled?: boolean;
  delay?: number;
  offset?: number;

  /**
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
  className?: string;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"black","label":"Black"},
   *       {"key":"gray-700","label":"Gray 700"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"white","label":"White"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"black","label":"Black"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-900","label":"Gray 900"}
   *     ]
   *   },
   *   {
   *     "key":"Font Size",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"xs","label":"Extra Small"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"base","label":"Base"}
   *     ]
   *   },
   *   {
   *     "key":"Padding X",
   *     "prefix":"px",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding Y",
   *     "prefix":"py",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Shadow",
   *     "prefix":"shadow",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"}
   *     ]
   *   }
   * ]
   */
  tooltipClassName?: string;

  /** @type|function */
  onOpenChange?: (open: boolean) => void;
}

interface TooltipCoordinates {
  top: number;
  left: number;
  transform: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  disabled = false,
  delay = 100,
  offset = 8,
  className = "",
  tooltipClassName = "",
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const [coordinates, setCoordinates] =
    useState<TooltipCoordinates | null>(null);

  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const updatePosition = () => {
    const element = triggerRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    let top = 0;
    let left = 0;
    let transform = "";

    switch (position) {
      case "bottom":
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2;
        transform = "translateX(-50%)";
        break;

      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - offset;
        transform = "translate(-100%, -50%)";
        break;

      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + offset;
        transform = "translateY(-50%)";
        break;

      case "top":
      default:
        top = rect.top - offset;
        left = rect.left + rect.width / 2;
        transform = "translate(-50%, -100%)";
        break;
    }

    setCoordinates({
      top,
      left,
      transform,
    });
  };

  const showTooltip = () => {
    if (disabled || !content) return;

    clearTimer();

    timerRef.current = setTimeout(() => {
      updatePosition();
      setOpen(true);
      onOpenChange?.(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimer();

    if (open) {
      setOpen(false);
      onOpenChange?.(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const update = () => {
      updatePosition();
    };

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, position, offset]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <>
      <span
        ref={triggerRef}
        className={[
          "inline-flex",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onPointerEnter={showTooltip}
        onPointerLeave={hideTooltip}
        onFocusCapture={showTooltip}
        onBlurCapture={hideTooltip}
      >
        {children}
      </span>

      {open &&
        coordinates &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: coordinates.top,
              left: coordinates.left,
              transform: coordinates.transform,
            }}
            className={[
              "pointer-events-none z-[99999]",
              "whitespace-nowrap",
              "rounded-md bg-gray-900",
              "px-2 py-1",
              "text-xs text-white",
              "shadow-md",
              tooltipClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;