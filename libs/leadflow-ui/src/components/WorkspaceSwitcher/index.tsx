import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Building2,
  Check,
  ChevronsUpDown,
  Plus,
  Search,
  X,
} from 'lucide-react';

export interface WorkspaceSwitcherItem {
  id: string;
  name: string;
  subtitle?: string;
  logoUrl?: string;
  initials?: string;
  disabled?: boolean;
}

export interface WorkspaceSwitcherProps {
  /**
   * Available workspaces.
   *
   * @type|complex
   * @schema {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "id": { "type": "string" },
   *       "name": { "type": "string" },
   *       "subtitle": { "type": "string" },
   *       "logoUrl": { "type": "string" },
   *       "initials": { "type": "string" },
   *       "disabled": { "type": "boolean" }
   *     },
   *     "required": ["id", "name"]
   *   }
   * }
   */
  items?: WorkspaceSwitcherItem[];

  /**
   * Currently selected workspace ID.
   */
  activeWorkspaceId?: string;

  /**
   * Controlled menu state.
   *
   * When provided, Rudra owns open/close state.
   */
  open?: boolean;

  /**
   * Initial state when `open`
   * is not controlled.
   */
  defaultOpen?: boolean;

  /**
   * Label shown above the workspace name.
   *
   * @translate
   */
  label?: string;

  /**
   * Search input placeholder.
   *
   * @translate
   */
  searchPlaceholder?: string;

  /**
   * Empty-state text.
   *
   * @translate
   */
  emptyText?: string;

  /**
   * Create workspace action label.
   *
   * @translate
   */
  createLabel?: string;

  /**
   * Whether the small label is displayed.
   */
  showLabel?: boolean;

  /**
   * Whether workspace subtitles are displayed.
   */
  showSubtitles?: boolean;

  /**
   * Whether search is available.
   */
  searchable?: boolean;

  /**
   * Number of workspaces required before
   * the search input is displayed.
   */
  searchThreshold?: number;

  /**
   * Whether the create-workspace action
   * is displayed.
   */
  showCreateAction?: boolean;

  /**
   * Visual presentation.
   *
   * @select|default|compact
   */
  variant?: 'default' | 'compact';

  /**
   * Whether the switcher is disabled.
   */
  disabled?: boolean;

  /**
   * Accessible switcher label.
   */
  ariaLabel?: string;

  /**
   * Emits only the selected workspace ID.
   */
  onWorkspaceSelect?: (
    workspaceId: string,
  ) => void;

  /**
   * Emits menu open state.
   */
  onOpenChange?: (
    open: boolean,
  ) => void;

  /**
   * Requests creation of a workspace.
   */
  onCreateWorkspace?: () => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const getInitials = (
  name?: string,
): string => {
  if (!name) {
    return '';
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join('');
};

const WorkspaceAvatar: React.FC<{
  item?: WorkspaceSwitcherItem;
  size?: 'small' | 'default';
}> = ({
  item,
  size = 'default',
}) => {
  const initials =
    item?.initials ||
    getInitials(item?.name);

  const sizeClass =
    size === 'small'
      ? 'h-7 w-7 rounded-lg'
      : 'h-9 w-9 rounded-xl';

  return (
    <span
      className={`
        flex
        shrink-0
        items-center
        justify-center
        overflow-hidden

        ${sizeClass}

        border
        border-slate-200

        bg-gradient-to-br
        from-slate-50
        to-slate-100

        text-[10px]
        font-bold

        text-slate-600

        shadow-sm

        dark:border-slate-700
        dark:from-slate-800
        dark:to-slate-900
        dark:text-slate-300
      `}
    >
      {item?.logoUrl ? (
        <img
          src={item.logoUrl}
          alt=""
          className="
            h-full
            w-full
            object-cover
          "
        />
      ) : initials ? (
        initials
      ) : (
        <Building2
          size={
            size === 'small'
              ? 13
              : 16
          }
          strokeWidth={1.8}
          aria-hidden="true"
        />
      )}
    </span>
  );
};

const WorkspaceSwitcher: React.FC<
  WorkspaceSwitcherProps
> = ({
  items = [],
  activeWorkspaceId = '',

  open,
  defaultOpen = false,

  label = 'Workspace',
  searchPlaceholder =
    'Search workspaces...',
  emptyText =
    'No workspaces found.',
  createLabel =
    'Create workspace',

  showLabel = true,
  showSubtitles = true,

  searchable = true,
  searchThreshold = 5,

  showCreateAction = true,

  variant = 'default',
  disabled = false,

  ariaLabel =
    'Switch workspace',

  onWorkspaceSelect,
  onOpenChange,
  onCreateWorkspace,

  className = '',
}) => {
  const rootRef =
    useRef<HTMLDivElement>(null);

  const searchRef =
    useRef<HTMLInputElement>(null);

  const [internalOpen, setInternalOpen] =
    useState(defaultOpen);

  const [search, setSearch] =
    useState('');

  const isControlled =
    open !== undefined;

  const isOpen =
    isControlled
      ? Boolean(open)
      : internalOpen;

  const activeWorkspace =
    items.find(
      (item) =>
        item.id ===
        activeWorkspaceId,
    );

  const compact =
    variant === 'compact';

  const shouldShowSearch =
    searchable &&
    items.length >=
      searchThreshold;

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredItems =
    normalizedSearch
      ? items.filter(
          (item) =>
            item.name
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            item.subtitle
              ?.toLowerCase()
              .includes(
                normalizedSearch,
              ),
        )
      : items;

  const setOpenState = (
    nextOpen: boolean,
  ) => {
    if (!isControlled) {
      setInternalOpen(
        nextOpen,
      );
    }

    onOpenChange?.(
      nextOpen,
    );

    if (!nextOpen) {
      setSearch('');
    }
  };

  const handleSelect = (
    workspaceId: string,
  ) => {
    const workspace =
      items.find(
        (item) =>
          item.id ===
          workspaceId,
      );

    if (
      !workspace ||
      workspace.disabled
    ) {
      return;
    }

    onWorkspaceSelect?.(
      workspaceId,
    );

    setOpenState(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        rootRef.current &&
        !rootRef.current.contains(
          target,
        )
      ) {
        setOpenState(false);
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === 'Escape'
      ) {
        setOpenState(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handlePointerDown,
    );

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handlePointerDown,
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isControlled,
    onOpenChange,
  ]);

  useEffect(() => {
    if (
      !isOpen ||
      !shouldShowSearch
    ) {
      return;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          searchRef.current?.focus();
        },
      );

    return () =>
      window.cancelAnimationFrame(
        frame,
      );
  }, [
    isOpen,
    shouldShowSearch,
  ]);

  return (
    <div
      ref={rootRef}
      className={`
        relative
        min-w-0

        ${className}
      `}
    >
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() =>
          setOpenState(
            !isOpen,
          )
        }
        className={`
          flex
          w-full
          min-w-0
          items-center

          rounded-xl

          border
          border-transparent

          text-left

          transition-colors

          hover:border-slate-200
          hover:bg-slate-50

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-indigo-500

          disabled:cursor-not-allowed
          disabled:opacity-50

          dark:hover:border-slate-800
          dark:hover:bg-slate-900

          ${
            compact
              ? `
                gap-2
                p-1.5
              `
              : `
                gap-3
                p-2
              `
          }
        `}
      >
        <WorkspaceAvatar
          item={
            activeWorkspace
          }
          size={
            compact
              ? 'small'
              : 'default'
          }
        />

        <span
          className="
            min-w-0
            flex-1
          "
        >
          {showLabel &&
            !compact && (
              <span
                className="
                  block

                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]

                  text-slate-400

                  dark:text-slate-500
                "
              >
                {label}
              </span>
            )}

          <span
            className={`
              block
              truncate

              font-semibold

              text-slate-800

              dark:text-slate-200

              ${
                compact
                  ? 'text-xs'
                  : 'mt-0.5 text-sm'
              }
            `}
          >
            {activeWorkspace
              ?.name ||
              'Select workspace'}
          </span>

          {!compact &&
            showSubtitles &&
            activeWorkspace
              ?.subtitle && (
              <span
                className="
                  mt-0.5
                  block
                  truncate

                  text-[10px]

                  text-slate-400

                  dark:text-slate-500
                "
              >
                {
                  activeWorkspace
                    .subtitle
                }
              </span>
            )}
        </span>

        <ChevronsUpDown
          size={15}
          strokeWidth={1.8}
          aria-hidden="true"
          className="
            shrink-0

            text-slate-400

            dark:text-slate-500
          "
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            left-0
            top-[calc(100%+8px)]
            z-50

            w-full
            min-w-[260px]

            overflow-hidden

            rounded-2xl

            border
            border-slate-200

            bg-white

            shadow-xl
            shadow-slate-950/10

            dark:border-slate-800
            dark:bg-slate-950
            dark:shadow-black/30
          "
        >
          {/* Search */}
          {shouldShowSearch && (
            <div
              className="
                border-b
                border-slate-100

                p-2.5

                dark:border-slate-900
              "
            >
              <div className="relative">
                <Search
                  size={14}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute
                    left-3
                    top-1/2

                    -translate-y-1/2

                    text-slate-400

                    dark:text-slate-500
                  "
                />

                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  placeholder={
                    searchPlaceholder
                  }
                  onChange={(
                    event,
                  ) =>
                    setSearch(
                      event.target
                        .value,
                    )
                  }
                  className="
                    h-9
                    w-full

                    rounded-xl

                    border
                    border-slate-200

                    bg-slate-50

                    pl-9
                    pr-8

                    text-xs

                    text-slate-800

                    outline-none

                    placeholder:text-slate-400

                    focus:border-indigo-400
                    focus:bg-white
                    focus:ring-3
                    focus:ring-indigo-500/10

                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:text-slate-200
                    dark:placeholder:text-slate-600

                    dark:focus:border-indigo-500
                    dark:focus:bg-slate-950
                  "
                />

                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() =>
                      setSearch('')
                    }
                    className="
                      absolute
                      right-2
                      top-1/2

                      flex
                      h-6
                      w-6

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-md

                      text-slate-400

                      hover:bg-slate-200
                      hover:text-slate-700

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-indigo-500

                      dark:hover:bg-slate-800
                      dark:hover:text-slate-200
                    "
                  >
                    <X
                      size={12}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Workspace list */}
          <div
            role="listbox"
            aria-label={
              ariaLabel
            }
            className="
              max-h-72
              overflow-y-auto

              p-1.5
            "
          >
            {filteredItems.length >
            0 ? (
              filteredItems.map(
                (item) => {
                  const selected =
                    item.id ===
                    activeWorkspaceId;

                  return (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      role="option"
                      aria-selected={
                        selected
                      }
                      disabled={
                        item.disabled
                      }
                      onClick={() =>
                        handleSelect(
                          item.id,
                        )
                      }
                      className={`
                        flex
                        w-full
                        min-w-0
                        items-center
                        gap-2.5

                        rounded-xl

                        px-2.5
                        py-2

                        text-left

                        transition-colors

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        disabled:cursor-not-allowed
                        disabled:opacity-40

                        ${
                          selected
                            ? `
                              bg-indigo-50

                              dark:bg-indigo-500/10
                            `
                            : `
                              hover:bg-slate-50

                              dark:hover:bg-slate-900
                            `
                        }
                      `}
                    >
                      <WorkspaceAvatar
                        item={item}
                        size="small"
                      />

                      <span
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <span
                          className={`
                            block
                            truncate

                            text-xs
                            font-semibold

                            ${
                              selected
                                ? `
                                  text-indigo-700

                                  dark:text-indigo-300
                                `
                                : `
                                  text-slate-700

                                  dark:text-slate-300
                                `
                            }
                          `}
                        >
                          {
                            item.name
                          }
                        </span>

                        {showSubtitles &&
                          item.subtitle && (
                            <span
                              className="
                                mt-0.5
                                block
                                truncate

                                text-[10px]

                                text-slate-400

                                dark:text-slate-500
                              "
                            >
                              {
                                item.subtitle
                              }
                            </span>
                          )}
                      </span>

                      {selected && (
                        <Check
                          size={14}
                          strokeWidth={
                            2
                          }
                          aria-hidden="true"
                          className="
                            shrink-0

                            text-indigo-600

                            dark:text-indigo-300
                          "
                        />
                      )}
                    </button>
                  );
                },
              )
            ) : (
              <div
                className="
                  px-4
                  py-8

                  text-center

                  text-xs

                  text-slate-400

                  dark:text-slate-500
                "
              >
                {emptyText}
              </div>
            )}
          </div>

          {/* Create workspace */}
          {showCreateAction && (
            <div
              className="
                border-t
                border-slate-100

                p-1.5

                dark:border-slate-900
              "
            >
              <button
                type="button"
                onClick={() => {
                  setOpenState(
                    false,
                  );

                  onCreateWorkspace?.();
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-2.5

                  rounded-xl

                  px-2.5
                  py-2.5

                  text-xs
                  font-semibold

                  text-slate-600

                  transition-colors

                  hover:bg-slate-50
                  hover:text-indigo-600

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-indigo-500

                  dark:text-slate-400
                  dark:hover:bg-slate-900
                  dark:hover:text-indigo-300
                "
              >
                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center

                    rounded-lg

                    border
                    border-dashed
                    border-slate-300

                    dark:border-slate-700
                  "
                >
                  <Plus
                    size={13}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                {createLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;