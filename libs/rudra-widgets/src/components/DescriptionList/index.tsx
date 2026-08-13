import React from "react";

export type DescriptionListLayout =
  | "vertical"
  | "horizontal";

export interface DescriptionListItem {
  id: string;

  label: string;

  value?: React.ReactNode;

  description?: string;

  disabled?: boolean;

  data?: any;
}

export interface DescriptionListRenderContext {
  item: DescriptionListItem | null;

  index: number;

  disabled: boolean;

  click: () => void;
}

export interface DescriptionListProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Description items.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","label"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "label":{"type":"string"},
   *       "value":{"type":"string"},
   *       "description":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: DescriptionListItem[];

  /**
   * Custom item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: DescriptionListRenderContext
      ) => React.ReactNode);

  /**
   * @select|vertical|horizontal
   */
  layout?: DescriptionListLayout;

  /**
   * Number of columns.
   */
  columns?: number;

  /**
   * Space between items.
   */
  gap?: number;

  /**
   * Label width when layout=horizontal.
   *
   * Example:
   * 140
   */
  labelWidth?: number;

  /**
   * Show separator between rows.
   */
  showSeparators?: boolean;

  /**
   * Show outer border.
   */
  bordered?: boolean;

  /**
   * Apply compact spacing.
   */
  compact?: boolean;

  /**
   * Show item descriptions.
   */
  showDescriptions?: boolean;

  /**
   * @select|left|center|right
   */
  valueAlign?:
    | "left"
    | "center"
    | "right";

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
  labelClassName?: string;

  /**
   * @type|class
   */
  valueClassName?: string;

  /**
   * @type|class
   */
  descriptionClassName?: string;

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
    item: DescriptionListItem,
    index: number
  ) => void;
}

export default function DescriptionList({
  items = [],

  children,

  layout = "horizontal",

  columns = 1,

  gap = 0,

  labelWidth = 150,

  showSeparators = true,

  bordered = true,

  compact = false,

  showDescriptions = true,

  valueAlign = "left",

  emptyText = "Add description items",

  className = "w-full",

  itemClassName = "",

  labelClassName = "",

  valueClassName = "",

  descriptionClassName = "",

  customAttributes = {},

  onItemClick,

  style,

  ...props
}: DescriptionListProps) {
  const safeColumns =
    Math.max(
      1,
      Math.floor(columns)
    );

  const vertical =
    layout === "vertical";

  const padding =
    compact
      ? "9px 12px"
      : "14px 16px";

  const textAlign =
    valueAlign === "center"
      ? "center"
      : valueAlign === "right"
        ? "right"
        : "left";

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
          width: "100%",

          minHeight: 100,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          padding: 16,

          border:
            "1px dashed #d1d5db",

          borderRadius: 8,

          color: "#9ca3af",

          fontSize: 13,

          boxSizing: "border-box",

          ...style,
        }}
      >
        {typeof children ===
        "function"
          ? children({
              item: null,
              index: 0,
              disabled: false,
              click: () => {},
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
        position: "relative",

        display: "grid",

        gridTemplateColumns:
          `repeat(${safeColumns}, minmax(0, 1fr))`,

        gap:
          Math.max(
            0,
            gap
          ),

        width: "100%",

        overflow: "hidden",

        border:
          bordered
            ? "1px solid #e5e7eb"
            : undefined,

        borderRadius:
          bordered
            ? 10
            : undefined,

        background: "#ffffff",

        boxSizing: "border-box",

        ...style,
      }}
    >
      {items.map(
        (
          item,
          index
        ) => {
          const disabled =
            Boolean(
              item.disabled
            );

          const context:
            DescriptionListRenderContext =
            {
              item,
              index,
              disabled,

              click: () => {
                if (
                  disabled
                ) {
                  return;
                }

                onItemClick?.(
                  item,
                  index
                );
              },
            };

          /*
           * When using multiple columns,
           * determine whether this item
           * sits on the final grid row.
           */
          const rowIndex =
            Math.floor(
              index /
                safeColumns
            );

          const totalRows =
            Math.ceil(
              items.length /
                safeColumns
            );

          const lastRow =
            rowIndex ===
            totalRows - 1;

          const columnIndex =
            index %
            safeColumns;

          const lastColumn =
            columnIndex ===
              safeColumns - 1 ||
            index ===
              items.length - 1;

          return (
            <div
              key={
                item.id
              }
              className={
                itemClassName
              }
              role={
                onItemClick
                  ? "button"
                  : undefined
              }
              tabIndex={
                onItemClick &&
                !disabled
                  ? 0
                  : undefined
              }
              onClick={() => {
                if (
                  disabled
                ) {
                  return;
                }

                onItemClick?.(
                  item,
                  index
                );
              }}
              onKeyDown={(
                event
              ) => {
                if (
                  !onItemClick ||
                  disabled
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

                  onItemClick(
                    item,
                    index
                  );
                }
              }}
              style={{
                position: "relative",

                display: "flex",

                flexDirection:
                  vertical
                    ? "column"
                    : "row",

                alignItems:
                  vertical
                    ? "stretch"
                    : "flex-start",

                gap:
                  vertical
                    ? 5
                    : 14,

                minWidth: 0,

                padding,

                borderBottom:
                  showSeparators &&
                  !lastRow
                    ? "1px solid #e5e7eb"
                    : undefined,

                borderRight:
                  showSeparators &&
                  safeColumns > 1 &&
                  !lastColumn
                    ? "1px solid #e5e7eb"
                    : undefined,

                opacity:
                  disabled
                    ? 0.5
                    : 1,

                cursor:
                  disabled
                    ? "not-allowed"
                    : onItemClick
                      ? "pointer"
                      : "default",

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
                  <div
                    className={
                      labelClassName
                    }
                    style={{
                      width:
                        vertical
                          ? "100%"
                          : Math.max(
                              40,
                              labelWidth
                            ),

                      minWidth:
                        vertical
                          ? 0
                          : Math.max(
                              40,
                              labelWidth
                            ),

                      flexShrink:
                        vertical
                          ? 1
                          : 0,

                      color: "#6b7280",

                      fontSize:
                        compact
                          ? 11
                          : 12,

                      fontWeight: 500,

                      lineHeight: 1.45,

                      wordBreak:
                        "break-word",
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      minWidth: 0,

                      flex: 1,

                      textAlign,

                      boxSizing:
                        "border-box",
                    }}
                  >
                    <div
                      className={
                        valueClassName
                      }
                      style={{
                        color: "#111827",

                        fontSize:
                          compact
                            ? 12
                            : 13,

                        fontWeight: 500,

                        lineHeight: 1.5,

                        overflowWrap:
                          "anywhere",

                        wordBreak:
                          "break-word",
                      }}
                    >
                      {item.value ??
                        "—"}
                    </div>

                    {showDescriptions &&
                      item.description && (
                        <div
                          className={
                            descriptionClassName
                          }
                          style={{
                            marginTop: 3,

                            color: "#9ca3af",

                            fontSize: 11,

                            fontWeight: 400,

                            lineHeight: 1.5,

                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {
                            item.description
                          }
                        </div>
                      )}
                  </div>
                </>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}