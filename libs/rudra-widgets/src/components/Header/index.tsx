import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export type HeaderTheme =
  | "light"
  | "dark"
  | "auto";

export interface HeaderItem {
  id: string | number;

  /** @translate */
  label?: string;

  href?: string;
  icon?: React.ReactNode;

  disabled?: boolean;
  divider?: boolean;

  children?: HeaderItem[];

  data?: any;
}

export interface HeaderClickPayload {
  type:
    | "logo"
    | "title"
    | "navigation"
    | "action";

  item?: HeaderItem;
  id?: string | number;
  data?: any;
}

export interface HeaderProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className" | "onClick"
  > {
  logo?: React.ReactNode;

  /** @translate */
  title?: string;

  logoId?: string | number;
  titleId?: string | number;

  navItems?: HeaderItem[];
  actionItems?: HeaderItem[];

  rightContent?: React.ReactNode;

  /** @select|light|dark|auto */
  theme?: HeaderTheme;

  sticky?: boolean;

  mobileBreakpoint?: "sm" | "md" | "lg";

  /**
   * Root customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Height",
   *     "prefix":"h",
   *     "type":"select",
   *     "options":[
   *       {"key":"14","label":"Small"},
   *       {"key":"16","label":"Medium"},
   *       {"key":"18","label":"Large"},
   *       {"key":"20","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding X",
   *     "prefix":"px",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"},
   *       {"key":"8","label":"Extra Large"}
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
   *       {"key":"black","label":"Black"},
   *       {"key":"transparent","label":"Transparent"}
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
   * Navigation item customization.
   * @type|class
   */
  navItemClassName?: string;

  /**
   * Dropdown customization.
   * @type|class
   */
  dropdownClassName?: string;

  /**
   * Action item customization.
   * @type|class
   */
  actionItemClassName?: string;

  /**
   * Mobile menu customization.
   * @type|class
   */
  mobileMenuClassName?: string;

  /**
   * Called for actual header actions.
   *
   * Clicking an item that only opens children
   * does NOT trigger this callback.
   *
   * @type|function
   */
  onClick?: (
    payload: HeaderClickPayload
  ) => void;

  /** @type|function */
  onMobileOpenChange?: (
    open: boolean
  ) => void;
}

function hasChildren(
  item: HeaderItem
) {
  return (
    Array.isArray(item.children) &&
    item.children.length > 0
  );
}

export default function Header({
  logo,
  title,
  logoId = "logo",
  titleId = "title",

  navItems = [],
  actionItems = [],
  rightContent,

  theme = "auto",
  sticky = false,

  mobileBreakpoint = "md",

  className = "",
  navItemClassName = "",
  dropdownClassName = "",
  actionItemClassName = "",
  mobileMenuClassName = "",

  onClick,
  onMobileOpenChange,

  ...props
}: HeaderProps) {
  const safeNavItems =
    Array.isArray(navItems)
      ? navItems
      : [];

  const safeActionItems =
    Array.isArray(actionItems)
      ? actionItems
      : [];

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [
    desktopOpenIds,
    setDesktopOpenIds,
  ] = useState<
    Set<string | number>
  >(new Set());

  const [
    mobileOpenIds,
    setMobileOpenIds,
  ] = useState<
    Set<string | number>
  >(new Set());

  const isDark =
    theme === "dark";

  const setMobileMenuOpen = (
    next: boolean
  ) => {
    setMobileOpen(next);
    onMobileOpenChange?.(next);
  };

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
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
  }, [mobileOpen]);

  const toggleDesktop = (
    id: string | number
  ) => {
    setDesktopOpenIds(
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

  const toggleMobile = (
    id: string | number
  ) => {
    setMobileOpenIds(
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

  const triggerItem = (
    item: HeaderItem,
    type:
      | "navigation"
      | "action"
  ) => {
    if (item.disabled) {
      return;
    }

    /*
     * Parent items only open their
     * children. They don't trigger
     * the central click callback.
     */
    if (hasChildren(item)) {
      return;
    }

    onClick?.({
      type,
      item,
      id: item.id,
      data: item.data,
    });

    setMobileMenuOpen(false);

    setDesktopOpenIds(
      new Set()
    );
  };

  const breakpointClasses = {
    sm: {
      desktop: "sm:flex",
      desktopBlock: "sm:block",
      mobile: "sm:hidden",
    },
    md: {
      desktop: "md:flex",
      desktopBlock: "md:block",
      mobile: "md:hidden",
    },
    lg: {
      desktop: "lg:flex",
      desktopBlock: "lg:block",
      mobile: "lg:hidden",
    },
  };

  const breakpoint =
    breakpointClasses[
      mobileBreakpoint
    ];

  const rootThemeClass =
    theme === "dark"
      ? "bg-gray-900 text-white border-gray-800"
      : theme === "light"
      ? "bg-white text-gray-900 border-gray-200"
      : "bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800";

  const itemThemeClass =
    isDark
      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
      : theme === "light"
      ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white";

  const dropdownThemeClass =
    isDark
      ? "border-gray-700 bg-gray-900 text-gray-200"
      : theme === "light"
      ? "border-gray-200 bg-white text-gray-700"
      : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200";

  const dividerClass =
    isDark
      ? "border-gray-700"
      : theme === "light"
      ? "border-gray-200"
      : "border-gray-200 dark:border-gray-700";

  const renderDesktopItems = (
    items: HeaderItem[],
    level = 0,
    type:
      | "navigation"
      | "action" = "navigation"
  ): React.ReactNode => {
    return items.map(
      (item) => {
        if (item.divider) {
          return (
            <div
              key={item.id}
              className={[
                level === 0
                  ? "mx-1 h-6 border-l"
                  : "my-1 border-t",
                dividerClass,
              ].join(" ")}
            />
          );
        }

        const childrenExist =
          hasChildren(item);

        const opened =
          desktopOpenIds.has(
            item.id
          );

        const itemContent = (
          <>
            {item.icon && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {item.icon}
              </span>
            )}

            {item.label && (
              <span className="whitespace-nowrap">
                {item.label}
              </span>
            )}

            {childrenExist && (
              <span className="ml-auto shrink-0">
                {level === 0 ? (
                  <ChevronDown
                    size={15}
                  />
                ) : (
                  <ChevronRight
                    size={15}
                  />
                )}
              </span>
            )}
          </>
        );

        return (
          <div
            key={item.id}
            className="relative"
          >
            {childrenExist ? (
              <button
                type="button"
                disabled={
                  item.disabled
                }
                aria-expanded={
                  opened
                }
                onClick={() =>
                  toggleDesktop(
                    item.id
                  )
                }
                className={[
                  "flex w-full",
                  "items-center",
                  "gap-2",
                  "rounded-lg",
                  "px-3 py-2",
                  "text-sm",
                  "transition-colors",
                  itemThemeClass,
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-40",
                  type ===
                  "navigation"
                    ? navItemClassName
                    : actionItemClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {itemContent}
              </button>
            ) : item.href ? (
              <a
                href={item.href}
                aria-disabled={
                  item.disabled
                }
                onClick={(event) => {
                  if (
                    item.disabled
                  ) {
                    event.preventDefault();
                    return;
                  }

                  triggerItem(
                    item,
                    type
                  );
                }}
                className={[
                  "flex w-full",
                  "items-center",
                  "gap-2",
                  "rounded-lg",
                  "px-3 py-2",
                  "text-sm",
                  "transition-colors",
                  itemThemeClass,
                  item.disabled
                    ? "pointer-events-none opacity-40"
                    : "",
                  type ===
                  "navigation"
                    ? navItemClassName
                    : actionItemClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {itemContent}
              </a>
            ) : (
              <button
                type="button"
                disabled={
                  item.disabled
                }
                onClick={() =>
                  triggerItem(
                    item,
                    type
                  )
                }
                className={[
                  "flex w-full",
                  "items-center",
                  "gap-2",
                  "rounded-lg",
                  "px-3 py-2",
                  "text-sm",
                  "transition-colors",
                  itemThemeClass,
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-40",
                  type ===
                  "navigation"
                    ? navItemClassName
                    : actionItemClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {itemContent}
              </button>
            )}

            {childrenExist &&
              opened && (
                <div
                  className={[
                    "absolute z-50",
                    "min-w-48",
                    "rounded-lg border",
                    "p-1 shadow-lg",
                    level === 0
                      ? "left-0 top-full mt-1"
                      : "left-full top-0 ml-1",
                    dropdownThemeClass,
                    dropdownClassName,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {renderDesktopItems(
                    item.children!,
                    level + 1,
                    type
                  )}
                </div>
              )}
          </div>
        );
      }
    );
  };

  const renderMobileItems = (
    items: HeaderItem[],
    level = 0,
    type:
      | "navigation"
      | "action" = "navigation"
  ): React.ReactNode => {
    return items.map(
      (item) => {
        if (item.divider) {
          return (
            <div
              key={item.id}
              className={[
                "my-2 border-t",
                dividerClass,
              ].join(" ")}
            />
          );
        }

        const childrenExist =
          hasChildren(item);

        const opened =
          mobileOpenIds.has(
            item.id
          );

        const baseClass = [
          "flex w-full",
          "items-center",
          "gap-3",
          "rounded-lg",
          "py-2.5 pr-3",
          "text-left",
          "text-sm",
          "transition-colors",
          itemThemeClass,
          item.disabled
            ? "pointer-events-none opacity-40"
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        const paddingLeft =
          `${
            12 +
            level * 16
          }px`;

        const content = (
          <>
            {item.icon && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {item.icon}
              </span>
            )}

            <span className="min-w-0 flex-1">
              {item.label}
            </span>

            {childrenExist && (
              <ChevronDown
                size={16}
                className={
                  opened
                    ? "rotate-180 transition-transform"
                    : "transition-transform"
                }
              />
            )}
          </>
        );

        return (
          <React.Fragment
            key={item.id}
          >
            {childrenExist ? (
              <button
                type="button"
                disabled={
                  item.disabled
                }
                aria-expanded={
                  opened
                }
                style={{
                  paddingLeft,
                }}
                className={
                  baseClass
                }
                onClick={() =>
                  toggleMobile(
                    item.id
                  )
                }
              >
                {content}
              </button>
            ) : item.href ? (
              <a
                href={item.href}
                style={{
                  paddingLeft,
                }}
                className={
                  baseClass
                }
                onClick={(event) => {
                  if (
                    item.disabled
                  ) {
                    event.preventDefault();
                    return;
                  }

                  triggerItem(
                    item,
                    type
                  );
                }}
              >
                {content}
              </a>
            ) : (
              <button
                type="button"
                disabled={
                  item.disabled
                }
                style={{
                  paddingLeft,
                }}
                className={
                  baseClass
                }
                onClick={() =>
                  triggerItem(
                    item,
                    type
                  )
                }
              >
                {content}
              </button>
            )}

            {childrenExist &&
              opened && (
                <div>
                  {renderMobileItems(
                    item.children!,
                    level + 1,
                    type
                  )}
                </div>
              )}
          </React.Fragment>
        );
      }
    );
  };

  return (
    <header
      {...props}
      className={[
        "z-40 w-full border-b",
        sticky
          ? "sticky top-0"
          : "",
        rootThemeClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-h-16 w-full items-center gap-4 px-4">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          {logo && (
            <button
              type="button"
              className="flex shrink-0 items-center justify-center"
              onClick={() =>
                onClick?.({
                  type: "logo",
                  id: logoId,
                })
              }
            >
              {logo}
            </button>
          )}

          {title && (
            <button
              type="button"
              className="truncate text-left text-base font-semibold"
              onClick={() =>
                onClick?.({
                  type: "title",
                  id: titleId,
                })
              }
            >
              {title}
            </button>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav
          className={[
            "hidden min-w-0 flex-1 items-center gap-1",
            breakpoint.desktop,
          ].join(" ")}
        >
          {renderDesktopItems(
            safeNavItems
          )}
        </nav>

        {/* Desktop Right */}
        <div
          className={[
            "ml-auto hidden shrink-0 items-center gap-1",
            breakpoint.desktop,
          ].join(" ")}
        >
          {safeActionItems.length >
            0 &&
            renderDesktopItems(
              safeActionItems,
              0,
              "action"
            )}

          {rightContent}
        </div>

        {/* Mobile Menu */}
        <button
          type="button"
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={
            mobileOpen
          }
          className={[
            "ml-auto flex h-10 w-10",
            "items-center justify-center",
            "rounded-lg",
            itemThemeClass,
            breakpoint.mobile,
          ].join(" ")}
          onClick={() =>
            setMobileMenuOpen(
              !mobileOpen
            )
          }
        >
          {mobileOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          className={[
            "border-t",
            dividerClass,
            breakpoint.mobile,
            mobileMenuClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <nav className="max-h-[70vh] overflow-y-auto p-2">
            {renderMobileItems(
              safeNavItems
            )}

            {safeActionItems.length >
              0 && (
              <>
                <div
                  className={[
                    "my-2 border-t",
                    dividerClass,
                  ].join(" ")}
                />

                {renderMobileItems(
                  safeActionItems,
                  0,
                  "action"
                )}
              </>
            )}

            {rightContent && (
              <div
                className={[
                  "mt-2 border-t p-3",
                  dividerClass,
                ].join(" ")}
              >
                {rightContent}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}