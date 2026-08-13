import React from "react";

export type ToolbarItemType =
  | "action"
  | "toggle"
  | "separator"
  | "label"
  | "spacer";

export interface ToolbarItem {
  id: string;

  label?: string;

  /**
   * @select|action|toggle|separator|label|spacer
   */
  type?: ToolbarItemType;

  /**
   * Optional short text shown before label.
   *
   * Example:
   * B
   * I
   * ↶
   */
  iconText?: string;

  title?: string;

  disabled?: boolean;

  /**
   * Used by toggle items.
   */
  active?: boolean;

  /**
   * Optional keyboard shortcut label.
   */
  shortcut?: string;

  data?: any;
}

export interface ToolbarRenderContext {
  item: ToolbarItem | null;

  index: number;

  active: boolean;

  disabled: boolean;

  click: () => void;
}

export interface ToolbarProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Toolbar items.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "label":{"type":"string"},
   *       "type":{
   *         "type":"string",
   *         "enum":[
   *           "action",
   *           "toggle",
   *           "separator",
   *           "label",
   *           "spacer"
   *         ]
   *       },
   *       "iconText":{"type":"string"},
   *       "title":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "active":{"type":"boolean"},
   *       "shortcut":{"type":"string"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: ToolbarItem[];

  /**
   * Custom item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: ToolbarRenderContext
      ) => React.ReactNode);

  /**
   * @select|horizontal|vertical
   */
  orientation?:
    | "horizontal"
    | "vertical";

  /**
   * Allow toolbar items to wrap.
   */
  wrap?: boolean;

  /**
   * Space between items.
   */
  gap?: number;

  /**
   * Item height.
   */
  itemHeight?: number;

  /**
   * Display shortcut labels.
   */
  showShortcuts?: boolean;

  /**
   * Make toolbar take full width.
   */
  fullWidth?: boolean;

  /**
   * @select|start|center|end|between
   */
  align?:
    | "start"
    | "center"
    | "end"
    | "between";

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
  activeItemClassName?: string;

  /**
   * @type|class
   */
  labelClassName?: string;

  /**
   * @type|class
   */
  separatorClassName?: string;

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
    item: ToolbarItem,
    index: number
  ) => void;

  /**
   * @type|function
   */
  onToggleChange?: (
    item: ToolbarItem,
    index: number,
    active: boolean
  ) => void;
}

export default function Toolbar({
  items = [],

  children,

  orientation = "horizontal",

  wrap = false,

  gap = 4,

  itemHeight = 34,

  showShortcuts = true,

  fullWidth = true,

  align = "start",

  emptyText = "Add toolbar items",

  className = "",

  itemClassName = "",

  activeItemClassName = "",

  labelClassName = "",

  separatorClassName = "",

  customAttributes = {},

  onItemClick,

  onToggleChange,

  style,

  ...props
}: ToolbarProps) {
  const horizontal =
    orientation === "horizontal";

  const getJustifyContent =
    () => {
      if (
        align === "center"
      ) {
        return "center";
      }

      if (
        align === "end"
      ) {
        return "flex-end";
      }

      if (
        align === "between"
      ) {
        return "space-between";
      }

      return "flex-start";
    };

  const handleItem = (
    item: ToolbarItem,
    index: number
  ) => {
    if (
      item.disabled
    ) {
      return;
    }

    const type =
      item.type ??
      "action";

    if (
      type === "toggle"
    ) {
      onToggleChange?.(
        item,
        index,
        !Boolean(
          item.active
        )
      );
    }

    onItemClick?.(
      item,
      index
    );
  };

  if (
    items.length === 0
  ) {
    return (
      <div
        role="toolbar"
        aria-orientation={
          orientation
        }
        className={
          className
        }
        {...customAttributes}
        {...props}
        style={{
          width:
            fullWidth
              ? "100%"
              : "fit-content",

          minHeight:
            48,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          padding:
            8,

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
              active: false,
              disabled: false,
              click: () => {},
            })
          : emptyText}
      </div>
    );
  }

  return (
    <div
      role="toolbar"
      aria-orientation={
        orientation
      }
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        display:
          "flex",

        flexDirection:
          horizontal
            ? "row"
            : "column",

        flexWrap:
          horizontal &&
          wrap
            ? "wrap"
            : "nowrap",

        alignItems:
          horizontal
            ? "center"
            : "stretch",

        justifyContent:
          getJustifyContent(),

        gap:
          Math.max(
            0,
            gap
          ),

        width:
          fullWidth
            ? "100%"
            : "fit-content",

        minWidth: 0,

        padding:
          5,

        border:
          "1px solid #e5e7eb",

        borderRadius:
          9,

        background:
          "#ffffff",

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
          const type =
            item.type ??
            "action";

          /*
           * Spacer
           */
          if (
            type ===
            "spacer"
          ) {
            return (
              <div
                key={
                  item.id
                }
                aria-hidden="true"
                style={{
                  flex:
                    horizontal
                      ? 1
                      : undefined,

                  height:
                    horizontal
                      ? 1
                      : 12,

                  width:
                    horizontal
                      ? "auto"
                      : "100%",

                  minWidth:
                    horizontal
                      ? 8
                      : undefined,
                }}
              />
            );
          }

          /*
           * Separator
           */
          if (
            type ===
            "separator"
          ) {
            return (
              <div
                key={
                  item.id
                }
                role="separator"
                aria-orientation={
                  horizontal
                    ? "vertical"
                    : "horizontal"
                }
                className={
                  separatorClassName
                }
                style={{
                  flexShrink: 0,

                  width:
                    horizontal
                      ? 1
                      : "100%",

                  height:
                    horizontal
                      ? Math.max(
                          16,
                          itemHeight -
                            12
                        )
                      : 1,

                  margin:
                    horizontal
                      ? "0 3px"
                      : "3px 0",

                  background:
                    "#e5e7eb",
                }}
              />
            );
          }

          /*
           * Label
           */
          if (
            type ===
            "label"
          ) {
            return (
              <div
                key={
                  item.id
                }
                className={
                  labelClassName
                }
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  minHeight:
                    horizontal
                      ? itemHeight
                      : undefined,

                  padding:
                    horizontal
                      ? "0 8px"
                      : "5px 8px",

                  color:
                    "#9ca3af",

                  fontSize:
                    10,

                  fontWeight:
                    700,

                  letterSpacing:
                    "0.06em",

                  textTransform:
                    "uppercase",

                  whiteSpace:
                    "nowrap",

                  userSelect:
                    "none",
                }}
              >
                {item.label}
              </div>
            );
          }

          const active =
            type ===
              "toggle" &&
            Boolean(
              item.active
            );

          const disabled =
            Boolean(
              item.disabled
            );

          const context:
            ToolbarRenderContext =
            {
              item,
              index,
              active,
              disabled,

              click: () =>
                handleItem(
                  item,
                  index
                ),
            };

          return (
            <button
              key={
                item.id
              }
              type="button"
              title={
                item.title ??
                item.label
              }
              aria-label={
                item.title ??
                item.label
              }
              aria-pressed={
                type ===
                "toggle"
                  ? active
                  : undefined
              }
              disabled={
                disabled
              }
              className={`${itemClassName} ${
                active
                  ? activeItemClassName
                  : ""
              }`}
              onClick={() =>
                handleItem(
                  item,
                  index
                )
              }
              style={{
                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  horizontal
                    ? "center"
                    : "flex-start",

                gap: 7,

                minWidth:
                  horizontal
                    ? itemHeight
                    : "100%",

                height:
                  itemHeight,

                padding:
                  "0 9px",

                flexShrink:
                  0,

                border:
                  active
                    ? "1px solid #bfdbfe"
                    : "1px solid transparent",

                borderRadius:
                  6,

                background:
                  active
                    ? "#eff6ff"
                    : "transparent",

                color:
                  disabled
                    ? "#9ca3af"
                    : active
                      ? "#1d4ed8"
                      : "#374151",

                fontSize:
                  12,

                fontWeight:
                  500,

                cursor:
                  disabled
                    ? "not-allowed"
                    : "pointer",

                opacity:
                  disabled
                    ? 0.5
                    : 1,

                whiteSpace:
                  "nowrap",

                boxSizing:
                  "border-box",
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
                  {item.iconText && (
                    <span
                      aria-hidden="true"
                      style={{
                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        minWidth:
                          16,

                        fontSize:
                          13,

                        fontWeight:
                          700,

                        lineHeight:
                          1,
                      }}
                    >
                      {
                        item.iconText
                      }
                    </span>
                  )}

                  {item.label && (
                    <span>
                      {
                        item.label
                      }
                    </span>
                  )}

                  {showShortcuts &&
                    item.shortcut && (
                      <span
                        style={{
                          marginLeft:
                            horizontal
                              ? 3
                              : "auto",

                          color:
                            "#9ca3af",

                          fontSize:
                            9,

                          fontFamily:
                            "ui-monospace, monospace",

                          fontWeight:
                            400,
                        }}
                      >
                        {
                          item.shortcut
                        }
                      </span>
                    )}
                </>
              )}
            </button>
          );
        }
      )}
    </div>
  );
}