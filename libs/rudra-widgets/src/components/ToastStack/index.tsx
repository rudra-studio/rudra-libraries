import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

export type ToastType =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "error";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastDismissReason =
  | "timeout"
  | "close"
  | "action";

export interface ToastItem {
  id: string;

  title: string;

  description?: string;

  /**
   * @select|default|success|info|warning|error
   */
  type?: ToastType;

  /**
   * Auto-dismiss duration in milliseconds.
   *
   * 0 = persistent.
   */
  duration?: number;

  closable?: boolean;

  actionLabel?: string;

  disabled?: boolean;

  data?: any;
}

export interface ToastRenderContext {
  item: ToastItem | null;

  index: number;

  dismiss: () => void;

  action: () => void;
}

export interface ToastStackProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Toast items.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","title"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "title":{"type":"string"},
   *       "description":{"type":"string"},
   *       "type":{
   *         "type":"string",
   *         "enum":[
   *           "default",
   *           "success",
   *           "info",
   *           "warning",
   *           "error"
   *         ]
   *       },
   *       "duration":{"type":"number"},
   *       "closable":{"type":"boolean"},
   *       "actionLabel":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: ToastItem[];

  /**
   * Custom toast renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: ToastRenderContext
      ) => React.ReactNode);

  /**
   * @select|top-left|top-center|top-right|bottom-left|bottom-center|bottom-right
   */
  position?: ToastPosition;

  /**
   * Default toast duration.
   *
   * Only used when onDismiss is connected.
   *
   * 0 = persistent.
   */
  defaultDuration?: number;

  /**
   * @select|fixed|inline
   */
  displayMode?: "fixed" | "inline";

  /**
   * Maximum number of visible items.
   *
   * 0 = unlimited.
   */
  maxVisible?: number;

  newestOnTop?: boolean;

  pauseOnHover?: boolean;

  showIcons?: boolean;

  closable?: boolean;

  width?: number;

  gap?: number;

  offset?: number;

  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  toastClassName?: string;

  /**
   * @type|class
   */
  titleClassName?: string;

  /**
   * @type|class
   */
  descriptionClassName?: string;

  /**
   * @type|class
   */
  actionClassName?: string;

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
  onDismiss?: (
    item: ToastItem,
    index: number,
    reason: ToastDismissReason
  ) => void;

  /**
   * @type|function
   */
  onAction?: (
    item: ToastItem,
    index: number
  ) => void;
}

interface ToastViewProps {
  item: ToastItem;

  index: number;

  defaultDuration: number;

  pauseOnHover: boolean;

  showIcons: boolean;

  defaultClosable: boolean;

  width: number;

  toastClassName: string;

  titleClassName: string;

  descriptionClassName: string;

  actionClassName: string;

  children?:
    | React.ReactNode
    | ((
        context: ToastRenderContext
      ) => React.ReactNode);

  canAutoDismiss: boolean;

  onDismiss: (
    reason: ToastDismissReason
  ) => void;

  onAction: () => void;
}

function getToastStyle(
  type: ToastType
) {
  switch (type) {
    case "success":
      return {
        accent: "#15803d",
        background: "#f0fdf4",
        border: "#bbf7d0",
      };

    case "error":
      return {
        accent: "#b91c1c",
        background: "#fef2f2",
        border: "#fecaca",
      };

    case "warning":
      return {
        accent: "#a16207",
        background: "#fffbeb",
        border: "#fde68a",
      };

    case "info":
      return {
        accent: "#1d4ed8",
        background: "#eff6ff",
        border: "#bfdbfe",
      };

    default:
      return {
        accent: "#4b5563",
        background: "#ffffff",
        border: "#e5e7eb",
      };
  }
}

function ToastIcon({
  type,
}: {
  type: ToastType;
}) {
  switch (type) {
    case "success":
      return (
        <CheckCircle2
          size={19}
        />
      );

    case "error":
      return (
        <AlertCircle
          size={19}
        />
      );

    case "warning":
      return (
        <TriangleAlert
          size={19}
        />
      );

    default:
      return (
        <Info
          size={19}
        />
      );
  }
}

function ToastView({
  item,

  index,

  defaultDuration,

  pauseOnHover,

  showIcons,

  defaultClosable,

  width,

  toastClassName,

  titleClassName,

  descriptionClassName,

  actionClassName,

  children,

  canAutoDismiss,

  onDismiss,

  onAction,
}: ToastViewProps) {
  const timerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const startTimeRef =
    useRef(0);

  const remainingRef =
    useRef(0);

  const duration =
    item.duration ??
    defaultDuration;

  const closable =
    item.closable ??
    defaultClosable;

  const clearTimer =
    () => {
      if (
        timerRef.current
      ) {
        clearTimeout(
          timerRef.current
        );

        timerRef.current =
          null;
      }
    };

  const startTimer =
    (
      delay: number
    ) => {
      clearTimer();

      /*
       * Important:
       *
       * Static Rudra items should not
       * disappear when no dismiss handler
       * has been configured.
       */
      if (
        !canAutoDismiss ||
        delay <= 0 ||
        item.disabled
      ) {
        return;
      }

      startTimeRef.current =
        Date.now();

      remainingRef.current =
        delay;

      timerRef.current =
        setTimeout(
          () => {
            onDismiss(
              "timeout"
            );
          },
          delay
        );
    };

  useEffect(() => {
    if (
      !canAutoDismiss ||
      duration <= 0 ||
      item.disabled
    ) {
      return;
    }

    remainingRef.current =
      duration;

    startTimer(
      duration
    );

    return () => {
      clearTimer();
    };
  }, [
    item.id,
    item.disabled,
    duration,
    canAutoDismiss,
  ]);

  const pauseTimer =
    () => {
      if (
        !pauseOnHover ||
        !timerRef.current
      ) {
        return;
      }

      const elapsed =
        Date.now() -
        startTimeRef.current;

      remainingRef.current =
        Math.max(
          0,
          remainingRef.current -
            elapsed
        );

      clearTimer();
    };

  const resumeTimer =
    () => {
      if (
        !pauseOnHover ||
        !canAutoDismiss ||
        remainingRef.current <=
          0
      ) {
        return;
      }

      startTimer(
        remainingRef.current
      );
    };

  const type =
    item.type ??
    "default";

  const visual =
    getToastStyle(
      type
    );

  const context:
    ToastRenderContext = {
    item,

    index,

    dismiss: () =>
      onDismiss(
        "close"
      ),

    action:
      onAction,
  };

  return (
    <div
      role={
        type === "error"
          ? "alert"
          : "status"
      }
      className={
        toastClassName
      }
      onMouseEnter={
        pauseTimer
      }
      onMouseLeave={
        resumeTimer
      }
      style={{
        position:
          "relative",

        display:
          "flex",

        alignItems:
          "flex-start",

        gap: 11,

        width:
          `min(${Math.max(
            200,
            width
          )}px, calc(100vw - 32px))`,

        padding:
          "13px 14px",

        border:
          `1px solid ${visual.border}`,

        borderRadius:
          10,

        background:
          visual.background,

        color:
          visual.accent,

        boxShadow:
          "0 8px 24px rgba(15,23,42,0.10)",

        opacity:
          item.disabled
            ? 0.55
            : 1,

        boxSizing:
          "border-box",
      }}
    >
      {showIcons && (
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            flexShrink:
              0,

            paddingTop:
              1,

            color:
              visual.accent,
          }}
        >
          <ToastIcon
            type={
              type
            }
          />
        </div>
      )}

      <div
        style={{
          minWidth: 0,

          flex: 1,
        }}
      >
        {typeof children ===
        "function" ? (
          children(
            context
          )
        ) : children ? (
          children
        ) : (
          <>
            <div
              className={
                titleClassName
              }
              style={{
                color:
                  "#111827",

                fontSize:
                  13,

                fontWeight:
                  600,

                lineHeight:
                  1.4,

                wordBreak:
                  "break-word",
              }}
            >
              {item.title}
            </div>

            {item.description && (
              <div
                className={
                  descriptionClassName
                }
                style={{
                  marginTop:
                    3,

                  color:
                    "#6b7280",

                  fontSize:
                    12,

                  lineHeight:
                    1.5,

                  wordBreak:
                    "break-word",
                }}
              >
                {
                  item.description
                }
              </div>
            )}

            {item.actionLabel && (
              <button
                type="button"
                className={
                  actionClassName
                }
                onClick={() => {
                  if (
                    item.disabled
                  ) {
                    return;
                  }

                  onAction();
                }}
                style={{
                  marginTop:
                    8,

                  padding: 0,

                  border: 0,

                  background:
                    "transparent",

                  color:
                    visual.accent,

                  fontSize:
                    12,

                  fontWeight:
                    600,

                  cursor:
                    "pointer",
                }}
              >
                {
                  item.actionLabel
                }
              </button>
            )}
          </>
        )}
      </div>

      {closable && (
        <button
          type="button"
          title="Dismiss"
          aria-label="Dismiss notification"
          disabled={
            item.disabled
          }
          onClick={() =>
            onDismiss(
              "close"
            )
          }
          style={{
            width: 26,

            height: 26,

            padding: 0,

            display:
              "inline-flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            flexShrink:
              0,

            marginTop:
              -4,

            marginRight:
              -5,

            border: 0,

            borderRadius:
              6,

            background:
              "transparent",

            color:
              "#9ca3af",

            cursor:
              item.disabled
                ? "default"
                : "pointer",
          }}
        >
          <X
            size={15}
          />
        </button>
      )}
    </div>
  );
}

function getFixedPosition(
  position: ToastPosition,
  offset: number
): React.CSSProperties {
  switch (position) {
    case "top-left":
      return {
        top: offset,
        left: offset,
        alignItems:
          "flex-start",
      };

    case "top-center":
      return {
        top: offset,
        left: "50%",
        transform:
          "translateX(-50%)",
        alignItems:
          "center",
      };

    case "bottom-left":
      return {
        bottom: offset,
        left: offset,
        alignItems:
          "flex-start",
      };

    case "bottom-center":
      return {
        bottom: offset,
        left: "50%",
        transform:
          "translateX(-50%)",
        alignItems:
          "center",
      };

    case "bottom-right":
      return {
        bottom: offset,
        right: offset,
        alignItems:
          "flex-end",
      };

    case "top-right":
    default:
      return {
        top: offset,
        right: offset,
        alignItems:
          "flex-end",
      };
  }
}

export default function ToastStack({
  items = [],

  children,

  position = "top-right",

  defaultDuration = 5000,

  displayMode = "inline",

  maxVisible = 5,

  newestOnTop = false,

  pauseOnHover = true,

  showIcons = true,

  closable = true,

  width = 360,

  gap = 10,

  offset = 20,

  emptyText = "Add toast items",

  className = "w-full",

  toastClassName = "",

  titleClassName = "",

  descriptionClassName = "",

  actionClassName = "",

  customAttributes = {},

  onDismiss,

  onAction,

  style,

  ...props
}: ToastStackProps) {
  const visibleItems =
    useMemo(
      () => {
        let result =
          items.map(
            (
              item,
              index
            ) => ({
              item,

              originalIndex:
                index,
            })
          );

        if (
          newestOnTop
        ) {
          result =
            [
              ...result,
            ].reverse();
        }

        if (
          maxVisible >
          0
        ) {
          result =
            result.slice(
              0,
              maxVisible
            );
        }

        return result;
      },
      [
        items,
        newestOnTop,
        maxVisible,
      ]
    );

  /*
   * Builder-friendly empty state.
   */
  if (
    visibleItems.length ===
    0
  ) {
    return (
      <div
        className={
          className
        }
        {...customAttributes}
        {...props}
        style={{
          width:
            "100%",

          padding:
            12,

          border:
            "1px dashed #d1d5db",

          borderRadius:
            8,

          color:
            "#9ca3af",

          fontSize:
            13,

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        {typeof children ===
        "function"
          ? children({
              item: null,
              index: 0,
              dismiss:
                () => {},
              action:
                () => {},
            })
          : emptyText}
      </div>
    );
  }

  const fixed =
    displayMode ===
    "fixed";

  const positionStyle =
    fixed
      ? getFixedPosition(
          position,
          Math.max(
            0,
            offset
          )
        )
      : {};

  return (
    <div
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        position:
          fixed
            ? "fixed"
            : "relative",

        display:
          "flex",

        flexDirection:
          "column",

        alignItems:
          fixed
            ? undefined
            : "flex-start",

        gap:
          Math.max(
            0,
            gap
          ),

        width:
          fixed
            ? "auto"
            : "100%",

        maxWidth:
          fixed
            ? "calc(100vw - 32px)"
            : "100%",

        pointerEvents:
          "auto",

        zIndex:
          fixed
            ? 9999
            : undefined,

        boxSizing:
          "border-box",

        ...positionStyle,

        ...style,
      }}
    >
      {visibleItems.map(
        ({
          item,
          originalIndex,
        }) => (
          <ToastView
            key={
              item.id
            }
            item={
              item
            }
            index={
              originalIndex
            }
            defaultDuration={
              defaultDuration
            }
            pauseOnHover={
              pauseOnHover
            }
            showIcons={
              showIcons
            }
            defaultClosable={
              closable
            }
            width={
              width
            }
            toastClassName={
              toastClassName
            }
            titleClassName={
              titleClassName
            }
            descriptionClassName={
              descriptionClassName
            }
            actionClassName={
              actionClassName
            }
            children={
              children
            }

            /*
             * Critical:
             *
             * Without onDismiss,
             * static Rudra items stay visible.
             */
            canAutoDismiss={
              Boolean(
                onDismiss
              )
            }
            onDismiss={(
              reason
            ) => {
              onDismiss?.(
                item,
                originalIndex,
                reason
              );
            }}
            onAction={() => {
              onAction?.(
                item,
                originalIndex
              );
            }}
          />
        )
      )}
    </div>
  );
}