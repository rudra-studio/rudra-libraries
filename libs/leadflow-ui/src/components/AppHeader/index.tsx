import React, { useEffect, useRef, useState } from 'react';

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  User,
  type LucideIcon,
} from 'lucide-react';

export interface AppHeaderProps {
  /**
   * Main page title.
   * @translate
   */
  title?: string;

  /**
   * Supporting text displayed below the title.
   * @translate
   */
  description?: string;

  /**
   * Whether the search control is displayed.
   */
  showSearch?: boolean;

  /**
   * Current search value.
   */
  searchValue?: string;

  /**
   * Placeholder displayed inside search.
   * @translate
   */
  searchPlaceholder?: string;

  /**
   * Whether the notification control is displayed.
   */
  showNotifications?: boolean;

  /**
   * Number displayed on the notification badge.
   */
  notificationCount?: number;

  /**
   * Whether the primary action is displayed.
   */
  showPrimaryAction?: boolean;

  /**
   * Primary action label.
   * @translate
   */
  primaryActionLabel?: string;

  /**
   * Lucide icon name used by the primary action.
   * @icon
   */
  primaryActionIcon?: string;

  /**
   * Controls whether the mobile navigation trigger is displayed.
   */
  showMenuTrigger?: boolean;

  /**
   * Whether the signed-in user control is displayed.
   */
  showUserMenu?: boolean;

  /**
   * Signed-in user's display name.
   */
  userName?: string;

  /**
   * Signed-in user's email address.
   */
  userEmail?: string;

  /**
   * Signed-in user's avatar image.
   */
  userAvatarUrl?: string;

  /**
   * Whether Account settings is displayed in the user menu.
   */
  showAccountSettings?: boolean;

  /**
   * Account settings menu label.
   * @translate
   */
  accountSettingsLabel?: string;

  /**
   * Sign out menu label.
   * @translate
   */
  signOutLabel?: string;

  /**
   * Accessible label for the header.
   */
  ariaLabel?: string;

  /**
   * Emits the current search value.
   */
  onSearchChange?: (value: string) => void;

  /**
   * Emits when the primary action is selected.
   */
  onPrimaryAction?: () => void;

  /**
   * Emits when notifications are selected.
   */
  onNotificationsClick?: () => void;

  /**
   * Emits when the mobile navigation trigger is selected.
   */
  onMenuClick?: () => void;

  /**
   * Emits when Account settings is selected.
   */
  onAccountClick?: () => void;

  /**
   * Emits when Sign out is selected.
   */
  onSignOut?: () => void;

  /**
   * Utility classes exposed to the Rudra builder.
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
   *   },
   *   {
   *     "key": "Horizontal Padding",
   *     "prefix": "px",
   *     "type": "select",
   *     "options": [
   *       { "key": "0", "label": "None" },
   *       { "key": "4", "label": "Medium" },
   *       { "key": "6", "label": "Large" },
   *       { "key": "8", "label": "Extra Large" }
   *     ]
   *   }
   * ]
   */
  className?: string;
}

const ICONS: Record<string, LucideIcon> = {
  Plus,
  Search,
  Bell,
  Menu,
};

const AppHeader: React.FC<AppHeaderProps> = ({
  title = '',
  description = '',
  showSearch = true,
  searchValue = '',
  searchPlaceholder = 'Search...',
  showNotifications = true,
  notificationCount = 0,
  showPrimaryAction = true,
  primaryActionLabel = 'Add',
  primaryActionIcon = 'Plus',
  showMenuTrigger = true,

  showUserMenu = true,
  userName = '',
  userEmail = '',
  userAvatarUrl = '',
  showAccountSettings = true,
  accountSettingsLabel = 'Account settings',
  signOutLabel = 'Sign out',

  ariaLabel = 'Page header',

  onSearchChange,
  onPrimaryAction,
  onNotificationsClick,
  onMenuClick,
  onAccountClick,
  onSignOut,

  className = '',
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const PrimaryActionIcon =
    ICONS[primaryActionIcon] || Plus;

  const visibleNotificationCount =
    notificationCount > 99
      ? '99+'
      : notificationCount;

  const initials = userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || 'U';

  useEffect(() => {
    if (!userMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMenuOpen]);

  const handleAccountClick = () => {
    setUserMenuOpen(false);
    onAccountClick?.();
  };

  const handleSignOut = () => {
    setUserMenuOpen(false);
    onSignOut?.();
  };

  return (
    <header
      aria-label={ariaLabel}
      className={`
        w-full
        border-b border-slate-200
        bg-white
        text-slate-900

        dark:border-slate-800
        dark:bg-slate-950
        dark:text-slate-100

        ${className}
      `}
    >
      <div
        className="
          flex min-h-[72px] w-full
          flex-col gap-4
          px-4 py-3

          sm:px-5

          md:flex-row
          md:items-center
          md:justify-between
          md:px-6

          lg:px-8
        "
      >
        {/* Page identity */}
        <div
          className="
            flex min-w-0
            items-center gap-3
          "
        >
          {showMenuTrigger && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open navigation"
              className="
                flex h-10 w-10
                shrink-0 items-center
                justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-600
                transition-colors

                hover:bg-slate-50
                hover:text-slate-950

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2

                dark:border-slate-800
                dark:bg-slate-950
                dark:text-slate-400
                dark:hover:bg-slate-900
                dark:hover:text-white
                dark:focus-visible:ring-offset-slate-950

                lg:hidden
              "
            >
              <Menu
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          )}

          <div className="min-w-0">
            {title && (
              <h1
                className="
                  truncate
                  text-lg font-semibold
                  tracking-[-0.02em]
                  text-slate-950

                  dark:text-white

                  sm:text-xl
                "
              >
                {title}
              </h1>
            )}

            {description && (
              <p
                className="
                  mt-0.5
                  line-clamp-1
                  text-xs
                  text-slate-500

                  dark:text-slate-400

                  sm:text-sm
                "
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          className="
            flex min-w-0
            items-center gap-2

            sm:gap-3
          "
        >
          {showSearch && (
            <label
              className="
                group relative
                min-w-0 flex-1

                md:w-[220px]
                md:flex-none

                lg:w-[280px]
              "
            >
              <span className="sr-only">
                {searchPlaceholder}
              </span>

              <Search
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition-colors

                  group-focus-within:text-indigo-500

                  dark:text-slate-500
                  dark:group-focus-within:text-indigo-400
                "
              />

              <input
                type="search"
                value={searchValue}
                placeholder={searchPlaceholder}
                onChange={(event) =>
                  onSearchChange?.(event.target.value)
                }
                className="
                  h-10 w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  py-2 pl-9 pr-3

                  text-sm
                  text-slate-900
                  outline-none

                  transition-all

                  placeholder:text-slate-400

                  hover:border-slate-300

                  focus:border-indigo-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-500/10

                  dark:border-slate-800
                  dark:bg-slate-900/70
                  dark:text-slate-100
                  dark:placeholder:text-slate-500
                  dark:hover:border-slate-700
                  dark:focus:border-indigo-500
                  dark:focus:bg-slate-900
                  dark:focus:ring-indigo-400/10
                "
              />
            </label>
          )}

          {showNotifications && (
            <button
              type="button"
              onClick={onNotificationsClick}
              aria-label={
                notificationCount > 0
                  ? `${notificationCount} notifications`
                  : 'Notifications'
              }
              className="
                relative flex
                h-10 w-10
                shrink-0 items-center
                justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-500

                transition-colors

                hover:bg-slate-50
                hover:text-slate-950

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2

                dark:border-slate-800
                dark:bg-slate-950
                dark:text-slate-400
                dark:hover:bg-slate-900
                dark:hover:text-white
                dark:focus-visible:ring-offset-slate-950
              "
            >
              <Bell
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {notificationCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1 -top-1
                    flex min-h-[18px]
                    min-w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    border-2 border-white
                    bg-indigo-600
                    px-1
                    text-[9px]
                    font-bold
                    leading-none
                    text-white

                    dark:border-slate-950
                    dark:bg-indigo-500
                  "
                >
                  {visibleNotificationCount}
                </span>
              )}
            </button>
          )}

          {showPrimaryAction && (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="
                inline-flex h-10
                shrink-0 items-center
                justify-center gap-2
                rounded-xl
                bg-indigo-600
                px-3.5

                text-sm font-medium
                text-white

                shadow-sm
                shadow-indigo-600/10

                transition-all

                hover:bg-indigo-700

                active:scale-[0.98]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2

                dark:bg-indigo-500
                dark:hover:bg-indigo-400
                dark:focus-visible:ring-indigo-400
                dark:focus-visible:ring-offset-slate-950

                sm:px-4
              "
            >
              <PrimaryActionIcon
                size={17}
                strokeWidth={2}
                aria-hidden="true"
              />

              <span className="hidden sm:inline">
                {primaryActionLabel}
              </span>
            </button>
          )}

          {/* User menu */}
          {showUserMenu && (
            <div
              ref={userMenuRef}
              className="relative shrink-0"
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-label="Open user menu"
                onClick={() =>
                  setUserMenuOpen((open) => !open)
                }
                className="
                  flex h-10
                  items-center gap-2
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-1.5

                  transition-colors

                  hover:bg-slate-50

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-indigo-500
                  focus-visible:ring-offset-2

                  dark:border-slate-800
                  dark:bg-slate-950
                  dark:hover:bg-slate-900
                  dark:focus-visible:ring-offset-slate-950

                  sm:pr-2.5
                "
              >
                <span
                  className="
                    flex h-7 w-7
                    shrink-0 items-center
                    justify-center
                    overflow-hidden
                    rounded-lg
                    bg-indigo-100

                    text-xs font-semibold
                    text-indigo-700

                    dark:bg-indigo-500/15
                    dark:text-indigo-300
                  "
                >
                  {userAvatarUrl ? (
                    <img
                      src={userAvatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>

                {userName && (
                  <span
                    className="
                      hidden max-w-[120px]
                      truncate
                      text-sm font-medium
                      text-slate-700

                      dark:text-slate-200

                      sm:block
                    "
                  >
                    {userName}
                  </span>
                )}

                <ChevronDown
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className={`
                    hidden text-slate-400
                    transition-transform
                    sm:block

                    ${userMenuOpen ? 'rotate-180' : ''}
                  `}
                />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="
                    absolute right-0
                    top-[calc(100%+8px)]
                    z-50
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    p-1.5

                    shadow-xl
                    shadow-slate-900/10

                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:shadow-black/30
                  "
                >
                  {(userName || userEmail) && (
                    <div
                      className="
                        border-b
                        border-slate-100
                        px-3 py-2.5

                        dark:border-slate-800
                      "
                    >
                      {userName && (
                        <p
                          className="
                            truncate
                            text-sm font-semibold
                            text-slate-900

                            dark:text-white
                          "
                        >
                          {userName}
                        </p>
                      )}

                      {userEmail && (
                        <p
                          className="
                            mt-0.5 truncate
                            text-xs
                            text-slate-500

                            dark:text-slate-400
                          "
                        >
                          {userEmail}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="py-1">
                    {showAccountSettings && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleAccountClick}
                        className="
                          flex w-full
                          items-center gap-2.5
                          rounded-xl
                          px-3 py-2

                          text-left text-sm
                          text-slate-700

                          transition-colors

                          hover:bg-slate-50
                          hover:text-slate-950

                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-indigo-500

                          dark:text-slate-300
                          dark:hover:bg-slate-800
                          dark:hover:text-white
                        "
                      >
                        <Settings
                          size={16}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />

                        {accountSettingsLabel}
                      </button>
                    )}

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="
                        flex w-full
                        items-center gap-2.5
                        rounded-xl
                        px-3 py-2

                        text-left text-sm
                        text-red-600

                        transition-colors

                        hover:bg-red-50

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-500

                        dark:text-red-400
                        dark:hover:bg-red-500/10
                      "
                    >
                      <LogOut
                        size={16}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />

                      {signOutLabel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;