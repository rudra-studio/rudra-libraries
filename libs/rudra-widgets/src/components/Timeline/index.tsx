import React from "react";

import {
  Check,
  Circle,
  Clock,
  X,
} from "lucide-react";

export type TimelineOrientation =
  | "vertical"
  | "horizontal";

export type TimelineStatus =
  | "pending"
  | "active"
  | "completed"
  | "error";

export interface TimelineItem {
  id: string;

  title: string;

  description?: string;

  date?: string;

  status?: TimelineStatus;

  disabled?: boolean;

  data?: any;
}

export interface TimelineRenderContext {
  item: TimelineItem | null;

  index: number;

  status: TimelineStatus;

  first: boolean;

  last: boolean;

  disabled: boolean;

  click: () => void;
}

export interface TimelineProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Timeline entries.
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
   *       "date":{"type":"string"},
   *       "status":{
   *         "type":"string",
   *         "enum":[
   *           "pending",
   *           "active",
   *           "completed",
   *           "error"
   *         ]
   *       },
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: TimelineItem[];

  /**
   * Custom item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: TimelineRenderContext
      ) => React.ReactNode);

  /**
   * @select|vertical|horizontal
   */
  orientation?: TimelineOrientation;

  /**
   * Default status when item
   * doesn't define one.
   *
   * @select|pending|active|completed|error
   */
  defaultStatus?: TimelineStatus;

  /**
   * Show connector lines.
   */
  showConnector?: boolean;

  /**
   * Show date text.
   */
  showDate?: boolean;

  /**
   * Show description text.
   */
  showDescription?: boolean;

  /**
   * Allow items to be clicked.
   */
  clickable?: boolean;

  /**
   * Timeline marker size.
   */
  markerSize?: number;

  /**
   * Space between timeline items.
   */
  gap?: number;

  /**
   * @color
   */
  completedColor?: string;

  /**
   * @color
   */
  activeColor?: string;

  /**
   * @color
   */
  pendingColor?: string;

  /**
   * @color
   */
  errorColor?: string;

  /**
   * @color
   */
  connectorColor?: string;

  /**
   * @color
   */
  completedConnectorColor?: string;

  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  itemClassName?: string;

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
  dateClassName?: string;

  /**
   * @type|class
   */
  markerClassName?: string;

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
  onItemClick?: (
    item: TimelineItem,
    index: number
  ) => void;
}

function getStatusColor(
  status: TimelineStatus,
  completedColor: string,
  activeColor: string,
  pendingColor: string,
  errorColor: string
) {
  if (
    status === "completed"
  ) {
    return completedColor;
  }

  if (
    status === "active"
  ) {
    return activeColor;
  }

  if (
    status === "error"
  ) {
    return errorColor;
  }

  return pendingColor;
}

export default function Timeline({
  items = [],

  children,

  orientation = "vertical",

  defaultStatus = "pending",

  showConnector = true,

  showDate = true,

  showDescription = true,

  clickable = true,

  markerSize = 30,

  gap = 24,

  completedColor = "#16a34a",

  activeColor = "#2563eb",

  pendingColor = "#9ca3af",

  errorColor = "#dc2626",

  connectorColor = "#e5e7eb",

  completedConnectorColor = "#16a34a",

  emptyText = "Add timeline items",

  className = "w-full",

  itemClassName = "",

  titleClassName = "",

  descriptionClassName = "",

  dateClassName = "",

  markerClassName = "",

  customAttributes = {},

  onItemClick,

  style,

  ...props
}: TimelineProps) {
  const vertical =
    orientation === "vertical";

  const renderMarker = (
    status: TimelineStatus
  ) => {
    const color =
      getStatusColor(
        status,
        completedColor,
        activeColor,
        pendingColor,
        errorColor
      );

    const iconSize =
      Math.max(
        12,
        markerSize * 0.48
      );

    return (
      <div
        className={
          markerClassName
        }
        style={{
          position:
            "relative",

          width:
            markerSize,

          height:
            markerSize,

          flexShrink:
            0,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          borderRadius:
            "50%",

          border:
            `2px solid ${color}`,

          background:
            status === "pending"
              ? "#ffffff"
              : color,

          color:
            status === "pending"
              ? color
              : "#ffffff",

          boxSizing:
            "border-box",

          zIndex: 2,
        }}
      >
        {status ===
        "completed" ? (
          <Check
            size={
              iconSize
            }
            strokeWidth={
              2.5
            }
          />
        ) : status ===
          "error" ? (
          <X
            size={
              iconSize
            }
            strokeWidth={
              2.5
            }
          />
        ) : status ===
          "active" ? (
          <Clock
            size={
              iconSize
            }
            strokeWidth={
              2.2
            }
          />
        ) : (
          <Circle
            size={
              Math.max(
                7,
                markerSize *
                  0.25
              )
            }
          />
        )}
      </div>
    );
  };

  /*
   * Builder-friendly empty state.
   */
  if (
    items.length === 0
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
            14,

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
              status:
                defaultStatus,
              first: true,
              last: true,
              disabled:
                false,
              click:
                () => {},
            })
          : emptyText}
      </div>
    );
  }

  return (
    <div
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        position:
          "relative",

        display:
          "flex",

        flexDirection:
          vertical
            ? "column"
            : "row",

        alignItems:
          vertical
            ? "stretch"
            : "flex-start",

        width:
          "100%",

        overflowX:
          vertical
            ? undefined
            : "auto",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {items.map(
        (
          item,
          index
        ) => {
          const first =
            index === 0;

          const last =
            index ===
            items.length - 1;

          const status =
            item.status ??
            defaultStatus;

          const disabled =
            Boolean(
              item.disabled
            );

          const nextStatus =
            items[
              index + 1
            ]?.status ??
            defaultStatus;

          const connectorCompleted =
            status ===
              "completed" &&
            (
              nextStatus ===
                "completed" ||
              nextStatus ===
                "active"
            );

          const canClick =
            clickable &&
            !disabled;

          const context:
            TimelineRenderContext = {
            item,
            index,
            status,
            first,
            last,
            disabled,

            click: () => {
              if (
                !canClick
              ) {
                return;
              }

              onItemClick?.(
                item,
                index
              );
            },
          };

          return (
            <div
              key={
                item.id
              }
              className={
                itemClassName
              }
              style={{
                position:
                  "relative",

                display:
                  "flex",

                flexDirection:
                  vertical
                    ? "row"
                    : "column",

                alignItems:
                  vertical
                    ? "flex-start"
                    : "center",

                minWidth:
                  vertical
                    ? 0
                    : 180,

                flex:
                  vertical
                    ? undefined
                    : "1 0 180px",

                paddingBottom:
                  vertical &&
                  !last
                    ? gap
                    : 0,

                paddingRight:
                  !vertical &&
                  !last
                    ? gap
                    : 0,

                opacity:
                  disabled
                    ? 0.5
                    : 1,

                boxSizing:
                  "border-box",
              }}
            >
              {/*
               * Connector behind marker.
               */}
              {showConnector &&
                !last && (
                  <div
                    aria-hidden="true"
                    style={
                      vertical
                        ? {
                            position:
                              "absolute",

                            top:
                              markerSize,

                            left:
                              markerSize /
                              2,

                            bottom:
                              0,

                            width:
                              2,

                            transform:
                              "translateX(-50%)",

                            background:
                              connectorCompleted
                                ? completedConnectorColor
                                : connectorColor,

                            zIndex:
                              0,
                          }
                        : {
                            position:
                              "absolute",

                            top:
                              markerSize /
                              2,

                            left:
                              markerSize,

                            right:
                              0,

                            height:
                              2,

                            transform:
                              "translateY(-50%)",

                            background:
                              connectorCompleted
                                ? completedConnectorColor
                                : connectorColor,

                            zIndex:
                              0,
                          }
                    }
                  />
                )}

              <button
                type="button"
                disabled={
                  !canClick
                }
                onClick={() => {
                  if (
                    !canClick
                  ) {
                    return;
                  }

                  onItemClick?.(
                    item,
                    index
                  );
                }}
                style={{
                  position:
                    "relative",

                  display:
                    "flex",

                  flexDirection:
                    vertical
                      ? "row"
                      : "column",

                  alignItems:
                    vertical
                      ? "flex-start"
                      : "center",

                  gap:
                    vertical
                      ? 12
                      : 9,

                  width:
                    "100%",

                  minWidth:
                    0,

                  padding:
                    0,

                  border:
                    0,

                  background:
                    "transparent",

                  color:
                    "inherit",

                  textAlign:
                    vertical
                      ? "left"
                      : "center",

                  cursor:
                    canClick
                      ? "pointer"
                      : "default",

                  boxSizing:
                    "border-box",

                  zIndex:
                    1,
                }}
              >
                {renderMarker(
                  status
                )}

                <div
                  style={{
                    minWidth:
                      0,

                    flex:
                      vertical
                        ? 1
                        : undefined,

                    width:
                      vertical
                        ? "auto"
                        : "100%",

                    paddingTop:
                      vertical
                        ? 3
                        : 0,
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
                            14,

                          fontWeight:
                            600,

                          lineHeight:
                            1.4,

                          wordBreak:
                            "break-word",
                        }}
                      >
                        {
                          item.title
                        }
                      </div>

                      {showDescription &&
                        item.description && (
                          <div
                            className={
                              descriptionClassName
                            }
                            style={{
                              marginTop:
                                4,

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

                      {showDate &&
                        item.date && (
                          <div
                            className={
                              dateClassName
                            }
                            style={{
                              marginTop:
                                5,

                              color:
                                "#9ca3af",

                              fontSize:
                                11,

                              lineHeight:
                                1.4,
                            }}
                          >
                            {
                              item.date
                            }
                          </div>
                        )}
                    </>
                  )}
                </div>
              </button>
            </div>
          );
        }
      )}
    </div>
  );
}