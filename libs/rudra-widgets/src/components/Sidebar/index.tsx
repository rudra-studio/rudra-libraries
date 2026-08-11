import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export interface SidebarItem {
  id: string | number;
  label?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
  disabled?: boolean;
  divider?: boolean;
  data?: any;
}

export interface SidebarItemContext {
  item: SidebarItem;
  index: number;
  level: number;
  active: boolean;
  expanded: boolean;
  hasChildren: boolean;
  select: () => void;
  toggle: () => void;
}

export interface SidebarProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className" | "onSelect"
  > {
  items?: SidebarItem[];

  activeId?: string | number;

  defaultActiveId?: string | number;

  collapsed?: boolean;
  defaultCollapsed?: boolean;

  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;

  collapsible?: boolean;
  closeOnSelect?: boolean;

  header?: React.ReactNode;
  footer?: React.ReactNode;

  /**
   * Repeated sidebar item.
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((context: SidebarItemContext) => React.ReactNode);

  /**
   * Root sidebar customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"56","label":"Small"},
   *       {"key":"64","label":"Medium"},
   *       {"key":"72","label":"Large"},
   *       {"key":"80","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   },
   *   {
   *     "key":"Border Color",
   *     "prefix":"border",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-200","label":"Gray 200"},
   *       {"key":"gray-700","label":"Gray 700"},
   *       {"key":"gray-800","label":"Gray 800"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Items container customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding",
   *     "prefix":"p",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"},
   *       {"key":"4","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  itemsClassName?: string;

  /**
   * Default item customization.
   * @type|class
   */
  itemClassName?: string;

  /**
   * Active item customization.
   * @type|class
   */
  activeItemClassName?: string;

  /**
   * Mobile overlay customization.
   * @type|class
   */
  overlayClassName?: string;

  /** @type|function */
  onSelect?: (
    item: SidebarItem,
    index: number
  ) => void;

  /** @type|function */
  onCollapsedChange?: (
    collapsed: boolean
  ) => void;

  /** @type|function */
  onMobileOpenChange?: (
    open: boolean
  ) => void;
}

export default function Sidebar({
  items = [],

  activeId,
  defaultActiveId,

  collapsed,
  defaultCollapsed = false,

  mobileOpen,
  defaultMobileOpen = false,

  collapsible = true,
  closeOnSelect = true,

  header,
  footer,
  children,

  className = "",
  itemsClassName = "",
  itemClassName = "",
  activeItemClassName = "",
  overlayClassName = "",

  onSelect,
  onCollapsedChange,
  onMobileOpenChange,

  ...props
}: SidebarProps) {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  const activeControlled =
    activeId !== undefined;

  const collapsedControlled =
    collapsed !== undefined;

  const mobileControlled =
    mobileOpen !== undefined;

  const [
    internalActiveId,
    setInternalActiveId,
  ] = useState<
    string | number | undefined
  >(defaultActiveId);

  const [
    internalCollapsed,
    setInternalCollapsed,
  ] = useState(
    defaultCollapsed
  );

  const [
    internalMobileOpen,
    setInternalMobileOpen,
  ] = useState(
    defaultMobileOpen
  );

  const [
    expandedIds,
    setExpandedIds,
  ] = useState<
    Set<string | number>
  >(
    new Set()
  );

  const currentActiveId =
    activeControlled
      ? activeId
      : internalActiveId;

  const isCollapsed =
    collapsedControlled
      ? collapsed
      : internalCollapsed;

  const isMobileOpen =
    mobileControlled
      ? mobileOpen
      : internalMobileOpen;

  const setCollapsed = (
    next: boolean
  ) => {
    if (!collapsedControlled) {
      setInternalCollapsed(next);
    }

    onCollapsedChange?.(next);
  };

  const setMobileOpen = (
    next: boolean
  ) => {
    if (!mobileControlled) {
      setInternalMobileOpen(
        next
      );
    }

    onMobileOpenChange?.(next);
  };

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isMobileOpen]);

  const toggleExpanded = (
    id: string | number
  ) => {
    setExpandedIds(
      (current) => {
        const next =
          new Set(current);

        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      }
    );
  };

  const selectItem = (
    item: SidebarItem,
    index: number
  ) => {
    if (item.disabled) {
      return;
    }

    if (
      Array.isArray(
        item.children
      ) &&
      item.children.length
    ) {
      toggleExpanded(item.id);
      return;
    }

    if (!activeControlled) {
      setInternalActiveId(
        item.id
      );
    }

    onSelect?.(
      item,
      index
    );

    if (closeOnSelect) {
      setMobileOpen(false);
    }
  };

  const renderItems = (
    menuItems: SidebarItem[],
    level = 0
  ): React.ReactNode => {
    return menuItems.map(
      (item, index) => {
        if (item.divider) {
          return (
            <div
              key={item.id}
              className="my-2 border-t border-gray-200"
            />
          );
        }

        const hasChildren =
          Array.isArray(
            item.children
          ) &&
          item.children.length >
            0;

        const expanded =
          expandedIds.has(
            item.id
          );

        const active =
          currentActiveId ===
          item.id;

        const context: SidebarItemContext =
          {
            item,
            index,
            level,
            active,
            expanded,
            hasChildren,
            select: () =>
              selectItem(
                item,
                index
              ),
            toggle: () =>
              toggleExpanded(
                item.id
              ),
          };

        return (
          <React.Fragment
            key={item.id}
          >
            {typeof children ===
            "function" ? (
              children(context)
            ) : children ? (
              children
            ) : (
              <button
                type="button"
                disabled={
                  item.disabled
                }
                onClick={
                  context.select
                }
                style={{
                  paddingLeft:
                    isCollapsed
                      ? undefined
                      : `${
                          12 +
                          level *
                            16
                        }px`,
                }}
                className={[
                  "flex w-full",
                  "items-center",
                  "gap-3",
                  "rounded-lg",
                  "px-3 py-2.5",
                  "text-left",
                  "text-sm",
                  "transition-colors",
                  "text-gray-600",
                  "hover:bg-gray-100",
                  "hover:text-gray-900",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-40",
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "",
                  itemClassName,
                  active
                    ? activeItemClassName
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.icon && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {item.icon}
                  </span>
                )}

                {!isCollapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>

                    {hasChildren && (
                      <span className="shrink-0">
                        {expanded ? (
                          <ChevronDown
                            size={16}
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                          />
                        )}
                      </span>
                    )}
                  </>
                )}
              </button>
            )}

            {hasChildren &&
              expanded &&
              !isCollapsed && (
                <div className="mt-1">
                  {renderItems(
                    item.children!,
                    level + 1
                  )}
                </div>
              )}
          </React.Fragment>
        );
      }
    );
  };

  const sidebarContent = (
    <aside
      {...props}
      className={[
        "flex h-full",
        "shrink-0",
        "flex-col",
        "border-r border-gray-200",
        "bg-white",
        "transition-[width]",
        "duration-200",
        isCollapsed
          ? "w-16"
          : "w-64",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(header ||
        collapsible) && (
        <div
          className={[
            "flex min-h-14",
            "items-center",
            "border-b",
            "border-gray-100",
            "px-3",
            isCollapsed
              ? "justify-center"
              : "justify-between",
          ].join(" ")}
        >
          {!isCollapsed &&
            header && (
              <div className="min-w-0 flex-1">
                {header}
              </div>
            )}

          {collapsible && (
            <button
              type="button"
              aria-label={
                isCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              onClick={() =>
                setCollapsed(
                  !isCollapsed
                )
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              {isCollapsed ? (
                <Menu
                  size={19}
                />
              ) : (
                <ChevronRight
                  size={19}
                />
              )}
            </button>
          )}
        </div>
      )}

      <nav
        className={[
          "flex min-h-0 flex-1",
          "flex-col",
          "overflow-y-auto",
          "p-2",
          itemsClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {safeItems.length ===
        0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-purple-50 p-4 text-center text-xs text-purple-600">
            <div>
              Sidebar
              <br />
              No Data Bound

              {typeof children ===
              "function" ? (
                <div className="mt-3">
                  {children({
                    item: null as any,
                    index: 0,
                    level: 0,
                    active:
                      false,
                    expanded:
                      false,
                    hasChildren:
                      false,
                    select:
                      () => {},
                    toggle:
                      () => {},
                  })}
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        ) : (
          renderItems(
            safeItems
          )
        )}
      </nav>

      {footer && (
        <div className="border-t border-gray-100 p-3">
          {!isCollapsed &&
            footer}
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden h-full md:block">
        {sidebarContent}
      </div>

      {/* Mobile Trigger */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() =>
          setMobileOpen(true)
        }
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
      >
        <Menu size={21} />
      </button>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className={[
              "absolute inset-0",
              "bg-black/40",
              overlayClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() =>
              setMobileOpen(
                false
              )
            }
          />

          <div className="absolute inset-y-0 left-0">
            {sidebarContent}

            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}