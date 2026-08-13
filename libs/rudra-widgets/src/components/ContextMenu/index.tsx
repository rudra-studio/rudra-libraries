import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronRight,
} from "lucide-react";

export type ContextMenuTriggerMode =
  | "contextmenu"
  | "click";

export type ContextMenuItemType =
  | "item"
  | "separator"
  | "label";

export interface ContextMenuItem {
  id: string;

  label?: string;

  /**
   * @select|item|separator|label
   */
  type?: ContextMenuItemType;

  shortcut?: string;

  disabled?: boolean;

  checked?: boolean;

  /**
   * Nested menu items.
   */
  children?: ContextMenuItem[];

  data?: any;
}

export interface ContextMenuRenderContext {
  item: ContextMenuItem | null;

  index: number;

  depth: number;

  active: boolean;

  hasChildren: boolean;

  select: () => void;
}

export interface ContextMenuProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Element that opens the context menu.
   */
  trigger?: React.ReactNode;

  /**
   * Menu items.
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
   *           "item",
   *           "separator",
   *           "label"
   *         ]
   *       },
   *       "shortcut":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "checked":{"type":"boolean"},
   *       "children":{"type":"array"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: ContextMenuItem[];

  /**
   * Custom menu-item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: ContextMenuRenderContext
      ) => React.ReactNode);

  /**
   * Controlled open state.
   */
  open?: boolean;

  /**
   * Initial uncontrolled state.
   */
  defaultOpen?: boolean;

  /**
   * @select|contextmenu|click
   */
  triggerMode?: ContextMenuTriggerMode;

  disabled?: boolean;

  closeOnSelect?: boolean;

  closeOnOutsideClick?: boolean;

  closeOnEscape?: boolean;

  /**
   * Menu width.
   */
  width?: number;

  /**
   * Nested menu distance.
   */
  submenuOffset?: number;

  /**
   * Menu z-index.
   */
  zIndex?: number;

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
  triggerClassName?: string;

  /**
   * @type|class
   */
  menuClassName?: string;

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

  /**
   * @type|function
   */
  onItemSelect?: (
    item: ContextMenuItem,
    index: number,
    depth: number
  ) => void;
}

interface MenuPosition {
  x: number;
  y: number;
}

interface MenuLevelProps {
  items: ContextMenuItem[];

  depth: number;

  width: number;

  submenuOffset: number;

  itemClassName: string;

  activeItemClassName: string;

  labelClassName: string;

  children?:
    | React.ReactNode
    | ((
        context: ContextMenuRenderContext
      ) => React.ReactNode);

  onSelect: (
    item: ContextMenuItem,
    index: number,
    depth: number
  ) => void;
}

function MenuLevel({
  items,
  depth,
  width,
  submenuOffset,
  itemClassName,
  activeItemClassName,
  labelClassName,
  children,
  onSelect,
}: MenuLevelProps) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState<number | null>(
    null
  );

  return (
    <div
      role="menu"
      style={{
        position:
          "relative",

        width,

        padding:
          5,

        border:
          "1px solid #e5e7eb",

        borderRadius:
          9,

        background:
          "#ffffff",

        boxShadow:
          "0 10px 30px rgba(15,23,42,0.14)",

        boxSizing:
          "border-box",
      }}
    >
      {items.map(
        (
          item,
          index
        ) => {
          const type =
            item.type ??
            "item";

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
                style={{
                  height: 1,

                  margin:
                    "5px 4px",

                  background:
                    "#e5e7eb",
                }}
              />
            );
          }

          /*
           * Section label
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
                  padding:
                    "6px 9px 4px",

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

                  userSelect:
                    "none",
                }}
              >
                {
                  item.label
                }
              </div>
            );
          }

          const active =
            activeIndex ===
            index;

          const hasChildren =
            Boolean(
              item.children
                ?.length
            );

          const context:
            ContextMenuRenderContext =
            {
              item,
              index,
              depth,
              active,
              hasChildren,

              select:
                () => {
                  if (
                    item.disabled ||
                    hasChildren
                  ) {
                    return;
                  }

                  onSelect(
                    item,
                    index,
                    depth
                  );
                },
            };

          return (
            <div
              key={
                item.id
              }
              style={{
                position:
                  "relative",
              }}
              onMouseEnter={() =>
                setActiveIndex(
                  index
                )
              }
              onMouseLeave={() => {
                if (
                  activeIndex ===
                  index
                ) {
                  setActiveIndex(
                    null
                  );
                }
              }}
            >
              <button
                type="button"
                role="menuitem"
                disabled={
                  item.disabled
                }
                className={`${itemClassName} ${
                  active
                    ? activeItemClassName
                    : ""
                }`}
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  if (
                    item.disabled ||
                    hasChildren
                  ) {
                    return;
                  }

                  onSelect(
                    item,
                    index,
                    depth
                  );
                }}
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  gap: 12,

                  width:
                    "100%",

                  minHeight:
                    34,

                  padding:
                    "6px 9px",

                  border: 0,

                  borderRadius:
                    6,

                  background:
                    active
                      ? "#f3f4f6"
                      : "transparent",

                  color:
                    item.disabled
                      ? "#9ca3af"
                      : "#374151",

                  fontSize:
                    13,

                  textAlign:
                    "left",

                  cursor:
                    item.disabled
                      ? "not-allowed"
                      : hasChildren
                        ? "default"
                        : "pointer",

                  opacity:
                    item.disabled
                      ? 0.5
                      : 1,

                  boxSizing:
                    "border-box",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 8,

                    minWidth: 0,

                    flex: 1,
                  }}
                >
                  {item.checked !==
                    undefined && (
                    <span
                      style={{
                        width: 16,

                        height: 16,

                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        flexShrink:
                          0,
                      }}
                    >
                      {item.checked && (
                        <Check
                          size={14}
                        />
                      )}
                    </span>
                  )}

                  <div
                    style={{
                      minWidth:
                        0,

                      flex: 1,

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {typeof children ===
                    "function"
                      ? children(
                          context
                        )
                      : children ??
                        item.label}
                  </div>
                </div>

                <div
                  style={{
                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    gap: 5,

                    flexShrink:
                      0,

                    color:
                      "#9ca3af",
                  }}
                >
                  {item.shortcut && (
                    <span
                      style={{
                        fontSize:
                          10,

                        fontFamily:
                          "ui-monospace, monospace",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        item.shortcut
                      }
                    </span>
                  )}

                  {hasChildren && (
                    <ChevronRight
                      size={14}
                    />
                  )}
                </div>
              </button>

              {hasChildren &&
                active && (
                  <div
                    style={{
                      position:
                        "absolute",

                      top: -5,

                      left:
                        `calc(100% + ${submenuOffset}px)`,

                      zIndex:
                        depth +
                        1,
                    }}
                  >
                    <MenuLevel
                      items={
                        item.children!
                      }
                      depth={
                        depth +
                        1
                      }
                      width={
                        width
                      }
                      submenuOffset={
                        submenuOffset
                      }
                      itemClassName={
                        itemClassName
                      }
                      activeItemClassName={
                        activeItemClassName
                      }
                      labelClassName={
                        labelClassName
                      }
                      children={
                        children
                      }
                      onSelect={
                        onSelect
                      }
                    />
                  </div>
                )}
            </div>
          );
        }
      )}
    </div>
  );
}

export default function ContextMenu({
  trigger,

  items = [],

  children,

  open,

  defaultOpen = false,

  triggerMode =
    "contextmenu",

  disabled = false,

  closeOnSelect = true,

  closeOnOutsideClick = true,

  closeOnEscape = true,

  width = 220,

  submenuOffset = 4,

  zIndex = 9999,

  emptyText =
    "Add context menu items",

  className = "w-full",

  triggerClassName = "",

  menuClassName = "",

  itemClassName = "",

  activeItemClassName = "",

  labelClassName = "",

  customAttributes = {},

  onOpenChange,

  onItemSelect,

  style,

  ...props
}: ContextMenuProps) {
  const menuRef =
    useRef<HTMLDivElement>(
      null
    );

  const triggerRef =
    useRef<HTMLDivElement>(
      null
    );

  const [
    internalOpen,
    setInternalOpen,
  ] = useState(
    defaultOpen
  );

  const [
    position,
    setPosition,
  ] = useState<MenuPosition>({
    x: 20,
    y: 20,
  });

  const controlled =
    open !== undefined;

  const resolvedOpen =
    controlled
      ? open
      : internalOpen;

  const setOpen = (
    next: boolean
  ) => {
    if (!controlled) {
      setInternalOpen(
        next
      );
    }

    onOpenChange?.(
      next
    );
  };

  const openAt = (
    x: number,
    y: number
  ) => {
    if (disabled) {
      return;
    }

    setPosition({
      x,
      y,
    });

    setOpen(
      true
    );
  };

  /*
   * Keep the root menu inside
   * the viewport.
   */
  useEffect(() => {
    if (
      !resolvedOpen
    ) {
      return;
    }

    const frame =
      requestAnimationFrame(
        () => {
          const menu =
            menuRef.current;

          if (!menu) {
            return;
          }

          const rect =
            menu.getBoundingClientRect();

          const padding =
            8;

          let x =
            position.x;

          let y =
            position.y;

          if (
            rect.right >
            window.innerWidth -
              padding
          ) {
            x =
              Math.max(
                padding,
                window.innerWidth -
                  rect.width -
                  padding
              );
          }

          if (
            rect.bottom >
            window.innerHeight -
              padding
          ) {
            y =
              Math.max(
                padding,
                window.innerHeight -
                  rect.height -
                  padding
              );
          }

          if (
            x !== position.x ||
            y !== position.y
          ) {
            setPosition({
              x,
              y,
            });
          }
        }
      );

    return () =>
      cancelAnimationFrame(
        frame
      );
  }, [
    resolvedOpen,
    position.x,
    position.y,
  ]);

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
        const menu =
          menuRef.current;

        if (
          menu?.contains(
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

  const handleContextMenu =
    (
      event:
        React.MouseEvent<HTMLDivElement>
    ) => {
      if (
        disabled ||
        triggerMode !==
          "contextmenu"
      ) {
        return;
      }

      event.preventDefault();

      event.stopPropagation();

      openAt(
        event.clientX,
        event.clientY
      );
    };

  const handleClick =
    (
      event:
        React.MouseEvent<HTMLDivElement>
    ) => {
      if (
        disabled ||
        triggerMode !==
          "click"
      ) {
        return;
      }

      event.stopPropagation();

      const rect =
        event.currentTarget.getBoundingClientRect();

      openAt(
        rect.left,
        rect.bottom +
          4
      );
    };

  const handleSelect = (
    item: ContextMenuItem,
    index: number,
    depth: number
  ) => {
    if (
      item.disabled
    ) {
      return;
    }

    onItemSelect?.(
      item,
      index,
      depth
    );

    if (
      closeOnSelect
    ) {
      setOpen(
        false
      );
    }
  };

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

        width:
          "100%",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      <div
        ref={
          triggerRef
        }
        className={
          triggerClassName
        }
        onContextMenu={
          handleContextMenu
        }
        onClick={
          handleClick
        }
        style={{
          width:
            "100%",

          cursor:
            disabled
              ? "not-allowed"
              : undefined,

          opacity:
            disabled
              ? 0.55
              : 1,

          boxSizing:
            "border-box",
        }}
      >
        {trigger ?? (
          <div
            style={{
              width:
                "100%",

              minHeight:
                90,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              padding:
                16,

              border:
                "1px dashed #d1d5db",

              borderRadius:
                8,

              background:
                "#f9fafb",

              color:
                "#6b7280",

              fontSize:
                13,

              boxSizing:
                "border-box",
            }}
          >
            {triggerMode ===
            "contextmenu"
              ? "Right click here"
              : "Click to open menu"}
          </div>
        )}
      </div>

      {resolvedOpen && (
        <div
          ref={
            menuRef
          }
          className={
            menuClassName
          }
          style={{
            position:
              "fixed",

            top:
              position.y,

            left:
              position.x,

            zIndex,
          }}
        >
          {items.length >
          0 ? (
            <MenuLevel
              items={
                items
              }
              depth={0}
              width={
                Math.max(
                  150,
                  width
                )
              }
              submenuOffset={
                submenuOffset
              }
              itemClassName={
                itemClassName
              }
              activeItemClassName={
                activeItemClassName
              }
              labelClassName={
                labelClassName
              }
              children={
                children
              }
              onSelect={
                handleSelect
              }
            />
          ) : (
            <div
              style={{
                width,

                padding:
                  12,

                border:
                  "1px solid #e5e7eb",

                borderRadius:
                  8,

                background:
                  "#ffffff",

                color:
                  "#9ca3af",

                fontSize:
                  12,

                boxShadow:
                  "0 10px 30px rgba(15,23,42,0.14)",

                boxSizing:
                  "border-box",
              }}
            >
              {typeof children ===
              "function"
                ? children({
                    item: null,
                    index: 0,
                    depth: 0,
                    active:
                      false,
                    hasChildren:
                      false,
                    select:
                      () => {},
                  })
                : emptyText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}