import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FormInput,
  Home,
  Kanban,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  UserRoundCog,
  Users,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react';

export interface AppSidebarNavigationItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface AppSidebarWorkspace {
  id: string;
  name: string;
  subtitle?: string;
  logoUrl?: string;
  initials?: string;
}

export interface AppSidebarUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
}

export interface AppSidebarProps {
  /**
   * Navigation items displayed in the sidebar.
   * @type|complex
   * @schema {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "id": { "type": "string" },
   *       "label": { "type": "string" },
   *       "icon": { "type": "string" },
   *       "badge": {},
   *       "disabled": { "type": "boolean" }
   *     },
   *     "required": ["id", "label"]
   *   }
   * }
   */
  items?: AppSidebarNavigationItem[];

  /**
   * Currently selected navigation item ID.
   */
  activeItemId?: string;

  /**
   * Workspace displayed at the top of the sidebar.
   * @type|json
   * @schema {
   *   "type": "object",
   *   "properties": {
   *     "id": { "type": "string" },
   *     "name": { "type": "string" },
   *     "subtitle": { "type": "string" },
   *     "logoUrl": { "type": "string" },
   *     "initials": { "type": "string" }
   *   }
   * }
   */
  workspace?: AppSidebarWorkspace;

  /**
   * Current user displayed in the sidebar footer.
   * @type|json
   * @schema {
   *   "type": "object",
   *   "properties": {
   *     "id": { "type": "string" },
   *     "name": { "type": "string" },
   *     "email": { "type": "string" },
   *     "avatarUrl": { "type": "string" },
   *     "initials": { "type": "string" }
   *   }
   * }
   */
  user?: AppSidebarUser;

  /**
   * @translate
   */
  navigationLabel?: string;

  collapsed?: boolean;

  mobileOpen?: boolean;

  defaultMobileOpen?: boolean;

  collapsible?: boolean;

  ariaLabel?: string;

  /**
   * Emits the ID of the selected navigation item.
   */
  onItemSelect?: (itemId: string) => void;

  /**
   * Emits the selected workspace ID.
   */
  onWorkspaceClick?: (workspaceId: string) => void;

  /**
   * Emits the selected user ID.
   */
  onUserClick?: (userId: string) => void;

  /**
   * Emits the next collapsed state.
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Emits the next mobile drawer state.
   */
  onMobileOpenChange?: (open: boolean) => void;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key": "Outer Margin",
   *     "prefix": "m",
   *     "type": "select",
   *     "options": [
   *       { "key": "0", "label": "None" },
   *       { "key": "2", "label": "Small" },
   *       { "key": "4", "label": "Medium" }
   *     ]
   *   }
   * ]
   */
  className?: string;
}
const ICONS: Record<string, LucideIcon> = {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  FormInput,
  Home,
  Kanban,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  UserRoundCog,
  Users,
  UsersRound,
};

const getInitials = (value?: string): string => {
  if (!value) return '';

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

const AppSidebar: React.FC<AppSidebarProps> = ({
  items = [],
  activeItemId,
  workspace,
  user,
  navigationLabel = 'Workspace',
  collapsed = false,
  mobileOpen,
  defaultMobileOpen = false,
  collapsible = true,
  ariaLabel = 'Primary navigation',
  onItemSelect,
  onWorkspaceClick,
  onUserClick,
  onCollapsedChange,
  onMobileOpenChange,
  className = '',
}) => {
  const [internalMobileOpen, setInternalMobileOpen] =
    useState(defaultMobileOpen);

  const isMobileControlled = mobileOpen !== undefined;
  const isMobileOpen = isMobileControlled
    ? mobileOpen
    : internalMobileOpen;

  const workspaceInitials = useMemo(
    () => workspace?.initials || getInitials(workspace?.name),
    [workspace?.initials, workspace?.name],
  );

  const userInitials = useMemo(
    () => user?.initials || getInitials(user?.name),
    [user?.initials, user?.name],
  );

  const setMobileOpen = (nextOpen: boolean) => {
    if (!isMobileControlled) {
      setInternalMobileOpen(nextOpen);
    }

    onMobileOpenChange?.(nextOpen);
  };

  const handleItemSelect = (item: AppSidebarNavigationItem) => {
    if (item.disabled) return;

    onItemSelect?.(item);

    if (isMobileOpen) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    if (!isMobileOpen || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  const desktopWidth = collapsed ? 'lg:w-[76px]' : 'lg:w-[272px]';

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        aria-expanded={isMobileOpen}
        className="
          fixed left-4 top-4 z-40
          flex h-11 w-11 items-center justify-center
          rounded-xl border border-slate-200
          bg-white text-slate-700 shadow-sm
          transition
          hover:bg-slate-50 hover:text-slate-950
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-indigo-500
          focus-visible:ring-offset-2
          dark:border-slate-800
          dark:bg-slate-950
          dark:text-slate-300
          dark:hover:bg-slate-900
          dark:hover:text-white
          dark:focus-visible:ring-offset-slate-950
          lg:hidden
        "
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="
            fixed inset-0 z-40
            cursor-default
            bg-slate-950/40
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[min(88vw,320px)] flex-col
          border-r border-slate-200
          bg-white text-slate-900
          shadow-2xl
          transition-[transform,width] duration-200 ease-out

          dark:border-slate-800
          dark:bg-slate-950
          dark:text-slate-100

          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }

          lg:static
          lg:z-auto
          lg:h-full
          lg:min-h-0
          lg:translate-x-0
          lg:shadow-none

          ${desktopWidth}
          ${className}
        `}
      >
        {/* Workspace */}
        <div
          className={`
            flex min-h-[76px] shrink-0
            items-center gap-2
            border-b border-slate-100
            p-3
            dark:border-slate-900

            ${collapsed ? 'lg:justify-center' : ''}
          `}
        >
          {workspace && (
            <button
              type="button"
              onClick={onWorkspaceClick}
              aria-label={`Open ${workspace.name} workspace`}
              className={`
                group flex min-w-0 flex-1 items-center
                gap-3 rounded-xl p-2
                text-left
                transition-colors

                hover:bg-slate-100
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:hover:bg-slate-900

                ${
                  collapsed
                    ? 'lg:flex-none lg:justify-center'
                    : ''
                }
              `}
            >
              <span
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  overflow-hidden rounded-xl
                  bg-gradient-to-br
                  from-indigo-500 to-violet-600
                  text-xs font-bold text-white
                  shadow-sm shadow-indigo-500/20
                "
              >
                {workspace.logoUrl ? (
                  <img
                    src={workspace.logoUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  workspaceInitials
                )}
              </span>

              <span
                className={`
                  min-w-0 flex-1
                  ${collapsed ? 'lg:hidden' : ''}
                `}
              >
                <span
                  className="
                    block truncate
                    text-sm font-semibold
                    text-slate-900
                    dark:text-slate-100
                  "
                >
                  {workspace.name}
                </span>

                {workspace.subtitle && (
                  <span
                    className="
                      mt-0.5 block truncate
                      text-xs text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {workspace.subtitle}
                  </span>
                )}
              </span>

              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`
                  shrink-0 text-slate-400
                  transition-transform
                  group-hover:text-slate-600
                  dark:group-hover:text-slate-300

                  ${collapsed ? 'lg:hidden' : ''}
                `}
              />
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-lg
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              dark:text-slate-400
              dark:hover:bg-slate-900
              dark:hover:text-white
              lg:hidden
            "
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label={ariaLabel}
          className="
            min-h-0 flex-1
            overflow-y-auto overflow-x-hidden
            px-3 py-4
            [scrollbar-width:thin]
          "
        >
          {navigationLabel && (
            <div
              className={`
                mb-2 px-3
                text-[10px] font-semibold
                uppercase tracking-[0.12em]
                text-slate-400
                dark:text-slate-500

                ${collapsed ? 'lg:hidden' : ''}
              `}
            >
              {navigationLabel}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon
                ? ICONS[item.icon]
                : undefined;

              const isActive =
                item.id === activeItemId;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  aria-current={
                    isActive ? 'page' : undefined
                  }
                  aria-label={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  title={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  onClick={() =>
                    handleItemSelect(item)
                  }
                  className={`
                    group relative
                    flex min-h-11 w-full
                    items-center gap-3
                    rounded-xl
                    border border-transparent
                    px-3 py-2
                    text-left text-sm
                    transition-all

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    disabled:pointer-events-none
                    disabled:opacity-40

                    ${
                      isActive
                        ? `
                          border-indigo-100
                          bg-indigo-50
                          font-medium
                          text-indigo-700

                          dark:border-indigo-500/20
                          dark:bg-indigo-500/10
                          dark:text-indigo-300
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100
                          hover:text-slate-950

                          dark:text-slate-400
                          dark:hover:bg-slate-900
                          dark:hover:text-slate-100
                        `
                    }

                    ${
                      collapsed
                        ? 'lg:justify-center lg:px-0'
                        : ''
                    }
                  `}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="
                        absolute -left-[13px]
                        top-1/2
                        h-6 w-[3px]
                        -translate-y-1/2
                        rounded-r-full
                        bg-indigo-600
                        dark:bg-indigo-400
                      "
                    />
                  )}

                  {Icon && (
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      aria-hidden="true"
                      className="shrink-0"
                    />
                  )}

                  <span
                    className={`
                      min-w-0 flex-1 truncate
                      ${collapsed ? 'lg:hidden' : ''}
                    `}
                  >
                    {item.label}
                  </span>

                  {item.badge !== undefined &&
                    item.badge !== null && (
                      <span
                        className={`
                          inline-flex min-w-6
                          shrink-0 items-center
                          justify-center rounded-full
                          px-1.5 py-0.5
                          text-[10px] font-semibold

                          ${
                            isActive
                              ? `
                                bg-white
                                text-indigo-600
                                dark:bg-indigo-500/15
                                dark:text-indigo-300
                              `
                              : `
                                bg-slate-100
                                text-slate-500
                                dark:bg-slate-800
                                dark:text-slate-400
                              `
                          }

                          ${
                            collapsed
                              ? 'lg:hidden'
                              : ''
                          }
                        `}
                      >
                        {item.badge}
                      </span>
                    )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div
          className="
            shrink-0
            border-t border-slate-200
            p-3
            dark:border-slate-800
          "
        >
          {user && (
            <button
              type="button"
              onClick={onUserClick}
              aria-label={`Open ${user.name} profile`}
              className={`
                flex w-full items-center
                gap-3 rounded-xl p-2
                text-left
                transition-colors

                hover:bg-slate-100
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:hover:bg-slate-900

                ${
                  collapsed
                    ? 'lg:justify-center'
                    : ''
                }
              `}
            >
              <span
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  overflow-hidden rounded-full
                  border border-slate-200
                  bg-slate-900
                  text-[11px] font-semibold
                  text-white

                  dark:border-slate-700
                  dark:bg-slate-800
                "
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </span>

              <span
                className={`
                  min-w-0 flex-1
                  ${collapsed ? 'lg:hidden' : ''}
                `}
              >
                <span
                  className="
                    block truncate
                    text-xs font-semibold
                    text-slate-900
                    dark:text-slate-100
                  "
                >
                  {user.name}
                </span>

                {user.email && (
                  <span
                    className="
                      mt-0.5 block truncate
                      text-[10px]
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {user.email}
                  </span>
                )}
              </span>
            </button>
          )}

          {collapsible && (
            <button
              type="button"
              onClick={() =>
                onCollapsedChange?.(!collapsed)
              }
              aria-label={
                collapsed
                  ? 'Expand sidebar'
                  : 'Collapse sidebar'
              }
              title={
                collapsed
                  ? 'Expand sidebar'
                  : 'Collapse sidebar'
              }
              className={`
                mt-2 hidden min-h-9 w-full
                items-center gap-3
                rounded-lg px-3
                text-xs text-slate-500
                transition-colors

                hover:bg-slate-100
                hover:text-slate-900

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:text-slate-500
                dark:hover:bg-slate-900
                dark:hover:text-slate-200

                lg:flex

                ${
                  collapsed
                    ? 'justify-center px-0'
                    : ''
                }
              `}
            >
              {collapsed ? (
                <PanelLeftOpen
                  size={17}
                  aria-hidden="true"
                />
              ) : (
                <PanelLeftClose
                  size={17}
                  aria-hidden="true"
                />
              )}

              {!collapsed && (
                <span>Collapse sidebar</span>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;