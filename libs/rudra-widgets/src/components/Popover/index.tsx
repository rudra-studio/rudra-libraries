import React, {
  useEffect,
  useRef,
  useState,
} from "react";

export type PopoverPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

export type PopoverTrigger =
  | "click"
  | "hover";

export interface PopoverProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Trigger element.
   */
  trigger?: React.ReactNode;

  /**
   * Popover content.
   */
  children?: React.ReactNode;

  /**
   * Controlled state.
   */
  open?: boolean;

  /**
   * Initial uncontrolled state.
   */
  defaultOpen?: boolean;

  /**
   * @select|click|hover
   */
  triggerMode?: PopoverTrigger;

  /**
   * @select|top|top-start|top-end|bottom|bottom-start|bottom-end|left|right
   */
  placement?: PopoverPlacement;

  disabled?: boolean;

  closeOnOutsideClick?: boolean;

  closeOnEscape?: boolean;

  closeOnContentClick?: boolean;

  /**
   * Distance between trigger
   * and popover.
   */
  offset?: number;

  /**
   * Match trigger width.
   */
  matchTriggerWidth?: boolean;

  /**
   * Delay before opening in hover mode.
   */
  openDelay?: number;

  /**
   * Delay before closing in hover mode.
   */
  closeDelay?: number;

  /**
   * Popover z-index.
   */
  zIndex?: number;

  /**
   * Builder placeholder.
   */
  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  triggerClassName?: string;

  /**
   * @type|class
   */
  contentClassName?: string;

  /**
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string
  >;

  /**
   * @type|function
   */
  onOpenChange?: (
    open: boolean
  ) => void;
}

export default function Popover({
  trigger,

  children,

  open,

  defaultOpen = false,

  triggerMode = "click",

  placement = "bottom-start",

  disabled = false,

  closeOnOutsideClick = true,

  closeOnEscape = true,

  closeOnContentClick = false,

  offset = 8,

  matchTriggerWidth = false,

  openDelay = 100,

  closeDelay = 150,

  zIndex = 1000,

  emptyText = "Popover content",

  className = "",

  triggerClassName = "",

  contentClassName = "",

  customAttributes = {},

  onOpenChange,

  style,

  ...props
}: PopoverProps) {
  const rootRef =
    useRef<HTMLDivElement>(
      null
    );

  const triggerRef =
    useRef<HTMLDivElement>(
      null
    );

  const openTimerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const closeTimerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const [
    internalOpen,
    setInternalOpen,
  ] = useState(
    defaultOpen
  );

  const controlled =
    open !== undefined;

  const resolvedOpen =
    controlled
      ? open
      : internalOpen;

  const setOpen = (
    next: boolean
  ) => {
    if (disabled) {
      return;
    }

    if (!controlled) {
      setInternalOpen(
        next
      );
    }

    onOpenChange?.(
      next
    );
  };

  const clearTimers =
    () => {
      if (
        openTimerRef.current
      ) {
        clearTimeout(
          openTimerRef.current
        );

        openTimerRef.current =
          null;
      }

      if (
        closeTimerRef.current
      ) {
        clearTimeout(
          closeTimerRef.current
        );

        closeTimerRef.current =
          null;
      }
    };

  const scheduleOpen =
    () => {
      if (
        disabled ||
        triggerMode !==
          "hover"
      ) {
        return;
      }

      if (
        closeTimerRef.current
      ) {
        clearTimeout(
          closeTimerRef.current
        );

        closeTimerRef.current =
          null;
      }

      openTimerRef.current =
        setTimeout(
          () => {
            setOpen(
              true
            );
          },
          Math.max(
            0,
            openDelay
          )
        );
    };

  const scheduleClose =
    () => {
      if (
        triggerMode !==
        "hover"
      ) {
        return;
      }

      if (
        openTimerRef.current
      ) {
        clearTimeout(
          openTimerRef.current
        );

        openTimerRef.current =
          null;
      }

      closeTimerRef.current =
        setTimeout(
          () => {
            setOpen(
              false
            );
          },
          Math.max(
            0,
            closeDelay
          )
        );
    };

  /*
   * Outside click.
   */
  useEffect(() => {
    if (
      !resolvedOpen ||
      !closeOnOutsideClick
    ) {
      return;
    }

    const handlePointerDown =
      (
        event: PointerEvent
      ) => {
        const root =
          rootRef.current;

        if (!root) {
          return;
        }

        if (
          root.contains(
            event.target as Node
          )
        ) {
          return;
        }

        setOpen(
          false
        );
      };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [
    resolvedOpen,
    closeOnOutsideClick,
  ]);

  /*
   * Escape close.
   */
  useEffect(() => {
    if (
      !resolvedOpen ||
      !closeOnEscape
    ) {
      return;
    }

    const handleKeyDown =
      (
        event: KeyboardEvent
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          event.preventDefault();

          setOpen(
            false
          );
        }
      };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    resolvedOpen,
    closeOnEscape,
  ]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const getContentStyle =
    (): React.CSSProperties => {
      const common:
        React.CSSProperties = {
        position:
          "absolute",

        zIndex,

        minWidth:
          matchTriggerWidth
            ? "100%"
            : 180,

        boxSizing:
          "border-box",
      };

      switch (placement) {
        case "top":
          return {
            ...common,

            bottom:
              `calc(100% + ${offset}px)`,

            left:
              "50%",

            transform:
              "translateX(-50%)",
          };

        case "top-start":
          return {
            ...common,

            bottom:
              `calc(100% + ${offset}px)`,

            left: 0,
          };

        case "top-end":
          return {
            ...common,

            bottom:
              `calc(100% + ${offset}px)`,

            right: 0,
          };

        case "bottom":
          return {
            ...common,

            top:
              `calc(100% + ${offset}px)`,

            left:
              "50%",

            transform:
              "translateX(-50%)",
          };

        case "bottom-end":
          return {
            ...common,

            top:
              `calc(100% + ${offset}px)`,

            right: 0,
          };

        case "left":
          return {
            ...common,

            top:
              "50%",

            right:
              `calc(100% + ${offset}px)`,

            transform:
              "translateY(-50%)",
          };

        case "right":
          return {
            ...common,

            top:
              "50%",

            left:
              `calc(100% + ${offset}px)`,

            transform:
              "translateY(-50%)",
          };

        case "bottom-start":
        default:
          return {
            ...common,

            top:
              `calc(100% + ${offset}px)`,

            left: 0,
          };
      }
    };

  const handleTriggerClick =
    (
      event:
        React.MouseEvent
    ) => {
      if (
        disabled ||
        triggerMode !==
          "click"
      ) {
        return;
      }

      event.stopPropagation();

      setOpen(
        !resolvedOpen
      );
    };

  return (
    <div
      ref={
        rootRef
      }
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        position:
          "relative",

        display:
          "inline-block",

        maxWidth:
          "100%",

        boxSizing:
          "border-box",

        ...style,
      }}
      onMouseEnter={
        scheduleOpen
      }
      onMouseLeave={
        scheduleClose
      }
    >
      {/* Trigger */}
      <div
        ref={
          triggerRef
        }
        className={
          triggerClassName
        }
        role={
          trigger
            ? undefined
            : "button"
        }
        tabIndex={
          disabled
            ? -1
            : 0
        }
        aria-haspopup="dialog"
        aria-expanded={
          resolvedOpen
        }
        onClick={
          handleTriggerClick
        }
        onKeyDown={(
          event
        ) => {
          if (
            disabled ||
            triggerMode !==
              "click"
          ) {
            return;
          }

          if (
            event.key ===
              "Enter" ||
            event.key ===
              " "
          ) {
            event.preventDefault();

            setOpen(
              !resolvedOpen
            );
          }

          if (
            event.key ===
              "ArrowDown" &&
            !resolvedOpen
          ) {
            event.preventDefault();

            setOpen(
              true
            );
          }
        }}
        style={{
          display:
            "inline-flex",

          alignItems:
            "center",

          maxWidth:
            "100%",

          cursor:
            disabled
              ? "not-allowed"
              : "pointer",

          opacity:
            disabled
              ? 0.55
              : 1,

          boxSizing:
            "border-box",
        }}
      >
        {trigger ?? (
          <button
            type="button"
            disabled={
              disabled
            }
            tabIndex={
              -1
            }
            style={{
              padding:
                "8px 12px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                7,

              background:
                "#ffffff",

              color:
                "#374151",

              fontSize:
                13,

              cursor:
                disabled
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Open
          </button>
        )}
      </div>

      {/* Content */}
      {resolvedOpen && (
        <div
          role="dialog"
          className={
            contentClassName
          }
          onMouseEnter={() => {
            if (
              closeTimerRef.current
            ) {
              clearTimeout(
                closeTimerRef.current
              );

              closeTimerRef.current =
                null;
            }
          }}
          onMouseLeave={
            scheduleClose
          }
          onClick={() => {
            if (
              closeOnContentClick
            ) {
              setOpen(
                false
              );
            }
          }}
          style={{
            ...getContentStyle(),

            padding:
              12,

            border:
              "1px solid #e5e7eb",

            borderRadius:
              9,

            background:
              "#ffffff",

            color:
              "#111827",

            boxShadow:
              "0 10px 30px rgba(15,23,42,0.14)",
          }}
        >
          {children ?? (
            <div
              style={{
                color:
                  "#9ca3af",

                fontSize:
                  13,
              }}
            >
              {emptyText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}