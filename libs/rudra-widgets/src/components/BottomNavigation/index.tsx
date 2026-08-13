import React, {
  useState,
} from "react";

export interface BottomNavigationItem {
  id: string;

  label: string;

  /**
   * Simple icon/text representation.
   *
   * Example:
   * "⌂"
   * "★"
   * "⚙"
   */
  iconText?: string;

  /**
   * Optional badge.
   *
   * Example:
   * "3"
   * "99+"
   */
  badge?: string;

  disabled?: boolean;

  data?: any;
}

export interface BottomNavigationRenderContext {
  item: BottomNavigationItem | null;

  index: number;

  active: boolean;

  disabled: boolean;

  select: () => void;
}

export interface BottomNavigationProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Navigation items.
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
   *       "iconText":{"type":"string"},
   *       "badge":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: BottomNavigationItem[];

  /**
   * Custom item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: BottomNavigationRenderContext
      ) => React.ReactNode);

  /**
   * Controlled active id.
   */
  activeId?: string;

  /**
   * Initial active id.
   */
  defaultActiveId?: string;

  /**
   * @select|inline|fixed
   */
  displayMode?: "inline" | "fixed";

  /**
   * @select|bottom|top
   */
  position?: "bottom" | "top";

  /**
   * Show labels.
   */
  showLabels?: boolean;

  /**
   * Maximum width in fixed mode.
   *
   * 0 = full width.
   */
  maxWidth?: number;

  /**
   * Navigation height.
   */
  height?: number;

  /**
   * @color
   */
  activeColor?: string;

  /**
   * @color
   */
  inactiveColor?: string;

  /**
   * @color
   */
  backgroundColor?: string;

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
  badgeClassName?: string;

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
    item: BottomNavigationItem,
    index: number
  ) => void;

  /**
   * @type|function
   */
  onActiveChange?: (
    id: string,
    item: BottomNavigationItem,
    index: number
  ) => void;
}

export default function BottomNavigation({
  items = [],

  children,

  activeId,

  defaultActiveId,

  displayMode = "inline",

  position = "bottom",

  showLabels = true,

  maxWidth = 0,

  height = 64,

  activeColor = "#2563eb",

  inactiveColor = "#6b7280",

  backgroundColor = "#ffffff",

  emptyText = "Add navigation items",

  className = "w-full",

  itemClassName = "",

  activeItemClassName = "",

  labelClassName = "",

  badgeClassName = "",

  customAttributes = {},

  onItemClick,

  onActiveChange,

  style,

  ...props
}: BottomNavigationProps) {
  const [
    internalActiveId,
    setInternalActiveId,
  ] = useState<string | undefined>(
    defaultActiveId ??
      items[0]?.id
  );

  const controlled =
    activeId !== undefined;

  const resolvedActiveId =
    controlled
      ? activeId
      : internalActiveId;

  const handleSelect = (
    item: BottomNavigationItem,
    index: number
  ) => {
    if (
      item.disabled
    ) {
      return;
    }

    if (!controlled) {
      setInternalActiveId(
        item.id
      );
    }

    onActiveChange?.(
      item.id,
      item,
      index
    );

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
        className={
          className
        }
        {...customAttributes}
        {...props}
        style={{
          width: "100%",

          minHeight:
            60,

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          padding: 12,

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
              select:
                () => {},
            })
          : emptyText}
      </div>
    );
  }

  const fixed =
    displayMode ===
    "fixed";

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

        left:
          fixed
            ? "50%"
            : undefined,

        bottom:
          fixed &&
          position ===
            "bottom"
            ? 0
            : undefined,

        top:
          fixed &&
          position ===
            "top"
            ? 0
            : undefined,

        transform:
          fixed
            ? "translateX(-50%)"
            : undefined,

        display:
          "flex",

        alignItems:
          "stretch",

        justifyContent:
          "space-around",

        width:
          fixed
            ? maxWidth > 0
              ? `min(${maxWidth}px, 100%)`
              : "100%"
            : "100%",

        height:
          Math.max(
            48,
            height
          ),

        borderTop:
          position ===
          "bottom"
            ? "1px solid #e5e7eb"
            : undefined,

        borderBottom:
          position ===
          "top"
            ? "1px solid #e5e7eb"
            : undefined,

        background:
          backgroundColor,

        boxShadow:
          fixed
            ? position ===
              "bottom"
              ? "0 -5px 20px rgba(15,23,42,0.08)"
              : "0 5px 20px rgba(15,23,42,0.08)"
            : undefined,

        zIndex:
          fixed
            ? 1000
            : undefined,

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
          const active =
            item.id ===
            resolvedActiveId;

          const disabled =
            Boolean(
              item.disabled
            );

          const context:
            BottomNavigationRenderContext =
            {
              item,
              index,
              active,
              disabled,

              select:
                () =>
                  handleSelect(
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
              aria-current={
                active
                  ? "page"
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
                handleSelect(
                  item,
                  index
                )
              }
              style={{
                position:
                  "relative",

                display:
                  "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap:
                  showLabels
                    ? 4
                    : 0,

                minWidth: 0,

                flex:
                  "1 1 0",

                padding:
                  "6px 8px",

                border: 0,

                background:
                  "transparent",

                color:
                  disabled
                    ? "#d1d5db"
                    : active
                      ? activeColor
                      : inactiveColor,

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
                    style={{
                      position:
                        "relative",

                      minWidth:
                        24,

                      minHeight:
                        24,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      fontSize:
                        20,

                      lineHeight:
                        1,
                    }}
                  >
                    {item.iconText ?? (
                      <span
                        style={{
                          width:
                            7,

                          height:
                            7,

                          borderRadius:
                            "50%",

                          background:
                            "currentColor",
                        }}
                      />
                    )}

                    {item.badge && (
                      <span
                        className={
                          badgeClassName
                        }
                        style={{
                          position:
                            "absolute",

                          top: -6,

                          right: -10,

                          minWidth:
                            17,

                          height:
                            17,

                          padding:
                            "0 4px",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          border:
                            `2px solid ${backgroundColor}`,

                          borderRadius:
                            999,

                          background:
                            "#dc2626",

                          color:
                            "#ffffff",

                          fontSize:
                            8,

                          fontWeight:
                            700,

                          lineHeight:
                            1,

                          boxSizing:
                            "border-box",
                        }}
                      >
                        {
                          item.badge
                        }
                      </span>
                    )}
                  </div>

                  {showLabels && (
                    <span
                      className={
                        labelClassName
                      }
                      style={{
                        maxWidth:
                          "100%",

                        fontSize:
                          10,

                        fontWeight:
                          active
                            ? 700
                            : 500,

                        lineHeight:
                          1.2,

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        item.label
                      }
                    </span>
                  )}
                </>
              )}

              {active && (
                <span
                  aria-hidden="true"
                  style={{
                    position:
                      "absolute",

                    ...(position ===
                    "bottom"
                      ? {
                          bottom:
                            0,
                        }
                      : {
                          top:
                            0,
                        }),

                    left:
                      "50%",

                    width:
                      28,

                    height:
                      2,

                    borderRadius:
                      999,

                    background:
                      activeColor,

                    transform:
                      "translateX(-50%)",
                  }}
                />
              )}
            </button>
          );
        }
      )}
    </div>
  );
}