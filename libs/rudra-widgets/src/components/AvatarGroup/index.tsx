import React from "react";

export interface AvatarGroupItem {
  id: string;

  name: string;

  src?: string;

  alt?: string;

  /**
   * Custom initials.
   *
   * If omitted, initials are derived
   * from name.
   */
  initials?: string;

  /**
   * @color
   */
  backgroundColor?: string;

  /**
   * @color
   */
  textColor?: string;

  disabled?: boolean;

  data?: any;
}

export interface AvatarGroupRenderContext {
  item: AvatarGroupItem | null;

  index: number;

  visible: boolean;

  overflow: boolean;
}

export interface AvatarGroupProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Avatar items.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","name"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "name":{"type":"string"},
   *       "src":{"type":"string"},
   *       "alt":{"type":"string"},
   *       "initials":{"type":"string"},
   *       "backgroundColor":{"type":"string"},
   *       "textColor":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: AvatarGroupItem[];

  /**
   * Custom avatar renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: AvatarGroupRenderContext
      ) => React.ReactNode);

  /**
   * Maximum visible avatars.
   *
   * 0 = unlimited.
   */
  maxVisible?: number;

  /**
   * Avatar size in pixels.
   */
  size?: number;

  /**
   * Amount avatars overlap.
   */
  overlap?: number;

  /**
   * @select|circle|rounded|square
   */
  shape?:
    | "circle"
    | "rounded"
    | "square";

  /**
   * @select|start|center|end
   */
  align?:
    | "start"
    | "center"
    | "end";

  /**
   * Show +N overflow avatar.
   */
  showOverflow?: boolean;

  /**
   * @color
   */
  borderColor?: string;

  /**
   * @color
   */
  overflowBackgroundColor?: string;

  /**
   * @color
   */
  overflowTextColor?: string;

  /**
   * Empty builder text.
   */
  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  avatarClassName?: string;

  /**
   * @type|class
   */
  overflowClassName?: string;

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
    item: AvatarGroupItem,
    index: number
  ) => void;

  /**
   * @type|function
   */
  onOverflowClick?: (
    hiddenItems: AvatarGroupItem[]
  ) => void;
}

function getInitials(
  item: AvatarGroupItem
) {
  if (item.initials) {
    return item.initials
      .slice(0, 3)
      .toUpperCase();
  }

  const parts =
    item.name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length === 0
  ) {
    return "?";
  }

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}

function getRadius(
  shape:
    | "circle"
    | "rounded"
    | "square"
) {
  if (
    shape === "circle"
  ) {
    return "50%";
  }

  if (
    shape === "rounded"
  ) {
    return "22%";
  }

  return 0;
}

export default function AvatarGroup({
  items = [],

  children,

  maxVisible = 5,

  size = 40,

  overlap = 10,

  shape = "circle",

  align = "start",

  showOverflow = true,

  borderColor = "#ffffff",

  overflowBackgroundColor = "#e5e7eb",

  overflowTextColor = "#374151",

  emptyText = "Add avatars",

  className = "w-full",

  avatarClassName = "",

  overflowClassName = "",

  customAttributes = {},

  onItemClick,

  onOverflowClick,

  style,

  ...props
}: AvatarGroupProps) {
  const safeSize =
    Math.max(
      20,
      size
    );

  const safeOverlap =
    Math.max(
      0,
      Math.min(
        safeSize - 4,
        overlap
      )
    );

  const visibleCount =
    maxVisible <= 0
      ? items.length
      : Math.min(
          maxVisible,
          items.length
        );

  const visibleItems =
    items.slice(
      0,
      visibleCount
    );

  const hiddenItems =
    items.slice(
      visibleCount
    );

  const justifyContent =
    align === "center"
      ? "center"
      : align === "end"
        ? "flex-end"
        : "flex-start";

  const radius =
    getRadius(
      shape
    );

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

          minHeight:
            safeSize,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent,

          padding:
            8,

          border:
            "1px dashed #d1d5db",

          borderRadius:
            8,

          color:
            "#9ca3af",

          fontSize:
            12,

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
              visible: true,
              overflow: false,
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
        display:
          "flex",

        alignItems:
          "center",

        justifyContent,

        width:
          "100%",

        minWidth:
          0,

        paddingLeft:
          safeOverlap,

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {visibleItems.map(
        (
          item,
          index
        ) => {
          const context:
            AvatarGroupRenderContext =
            {
              item,
              index,
              visible: true,
              overflow: false,
            };

          return (
            <button
              key={
                item.id
              }
              type="button"
              title={
                item.name
              }
              aria-label={
                item.name
              }
              disabled={
                item.disabled
              }
              className={
                avatarClassName
              }
              onClick={() => {
                if (
                  item.disabled
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

                width:
                  safeSize,

                height:
                  safeSize,

                minWidth:
                  safeSize,

                flexShrink:
                  0,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                marginLeft:
                  index === 0
                    ? -safeOverlap
                    : -safeOverlap,

                padding: 0,

                overflow:
                  "hidden",

                border:
                  `2px solid ${borderColor}`,

                borderRadius:
                  radius,

                background:
                  item.backgroundColor ??
                  "#e2e8f0",

                color:
                  item.textColor ??
                  "#334155",

                fontSize:
                  Math.max(
                    9,
                    safeSize *
                      0.3
                  ),

                fontWeight:
                  700,

                lineHeight:
                  1,

                cursor:
                  item.disabled
                    ? "not-allowed"
                    : onItemClick
                      ? "pointer"
                      : "default",

                opacity:
                  item.disabled
                    ? 0.5
                    : 1,

                zIndex:
                  visibleItems.length -
                  index,

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
              ) : item.src ? (
                <img
                  src={
                    item.src
                  }
                  alt={
                    item.alt ??
                    item.name
                  }
                  draggable={
                    false
                  }
                  onError={(
                    event
                  ) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                  style={{
                    position:
                      "absolute",

                    inset: 0,

                    width:
                      "100%",

                    height:
                      "100%",

                    objectFit:
                      "cover",

                    userSelect:
                      "none",
                  }}
                />
              ) : (
                <span>
                  {getInitials(
                    item
                  )}
                </span>
              )}

              {/*
               * Fallback initials remain
               * behind an image.
               *
               * If the image fails and is
               * hidden, initials become visible.
               */}
              {item.src &&
                typeof children !==
                  "function" &&
                !children && (
                  <span
                    aria-hidden="true"
                    style={{
                      position:
                        "absolute",

                      inset: 0,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      zIndex: -1,
                    }}
                  >
                    {getInitials(
                      item
                    )}
                  </span>
                )}
            </button>
          );
        }
      )}

      {showOverflow &&
        hiddenItems.length >
          0 && (
          <button
            type="button"
            title={`${hiddenItems.length} more`}
            aria-label={`${hiddenItems.length} more users`}
            className={
              overflowClassName
            }
            onClick={() =>
              onOverflowClick?.(
                hiddenItems
              )
            }
            style={{
              position:
                "relative",

              width:
                safeSize,

              height:
                safeSize,

              minWidth:
                safeSize,

              flexShrink:
                0,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              marginLeft:
                -safeOverlap,

              padding: 0,

              border:
                `2px solid ${borderColor}`,

              borderRadius:
                radius,

              background:
                overflowBackgroundColor,

              color:
                overflowTextColor,

              fontSize:
                Math.max(
                  9,
                  safeSize *
                    0.27
                ),

              fontWeight:
                700,

              lineHeight:
                1,

              cursor:
                onOverflowClick
                  ? "pointer"
                  : "default",

              zIndex: 0,

              boxSizing:
                "border-box",
            }}
          >
            +{hiddenItems.length}
          </button>
        )}
    </div>
  );
}