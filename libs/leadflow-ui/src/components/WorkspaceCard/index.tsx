import React, { useEffect, useRef, useState } from 'react';

import {
  ArrowRight,
  Building2,
  MoreHorizontal,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';

export interface WorkspaceCardProps {
  /**
   * Workspace name.
   * @translate
   */
  name?: string;

  /**
   * Optional workspace description.
   * @translate
   */
  description?: string;

  /**
   * Workspace logo image URL.
   */
  logoUrl?: string;

  /**
   * Fallback initials when no logo is available.
   */
  initials?: string;

  /**
   * Number of members in the workspace.
   */
  memberCount?: number;

  /**
   * Current user's role in this workspace.
   * @translate
   */
  role?: string;

  /**
   * Whether the role badge is displayed.
   */
  showRole?: boolean;

  /**
   * Whether the member count is displayed.
   */
  showMemberCount?: boolean;

  /**
   * Whether the workspace options menu is displayed.
   */
  showMenu?: boolean;

  /**
   * Whether the settings option is displayed.
   */
  showSettings?: boolean;

  /**
   * Whether the delete option is displayed.
   */
  showDelete?: boolean;

  /**
   * Label displayed for the primary action.
   * @translate
   */
  actionLabel?: string;

  /**
   * Emits when the workspace is selected.
   */
  onSelect?: () => void;

  /**
   * Emits when workspace settings is selected.
   */
  onSettings?: () => void;

  /**
   * Emits when workspace deletion is selected.
   */
  onDelete?: () => void;

  /**
   * Utility classes exposed to the Rudra builder.
   * @type|class
   */
  className?: string;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  name = 'Workspace',
  description = '',
  logoUrl = '',
  initials = '',
  memberCount = 0,
  role = '',
  showRole = true,
  showMemberCount = true,
  showMenu = true,
  showSettings = true,
  showDelete = false,
  actionLabel = 'Open workspace',
  onSelect,
  onSettings,
  onDelete,
  className = '',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const fallbackInitials =
    initials ||
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase() ||
    'W';

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleSettings = () => {
    setMenuOpen(false);
    onSettings?.();
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete?.();
  };

  return (
    <article
      className={`
        group relative
        flex h-full min-h-[220px]
        flex-col
        rounded-2xl
        border border-slate-200
        bg-white
        p-5

        shadow-sm
        shadow-slate-900/[0.03]

        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:shadow-lg
        hover:shadow-indigo-950/[0.06]

        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-black/10

        dark:hover:border-indigo-500/40
        dark:hover:shadow-black/20

        ${className}
      `}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex h-12 w-12
            shrink-0 items-center
            justify-center
            overflow-hidden
            rounded-xl
            bg-indigo-50

            text-sm font-semibold
            text-indigo-700

            dark:bg-indigo-500/10
            dark:text-indigo-300
          "
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : fallbackInitials ? (
            fallbackInitials
          ) : (
            <Building2
              size={21}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </div>

        {showMenu && (
          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              aria-label={`Workspace options for ${name}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen((open) => !open)
              }
              className="
                flex h-9 w-9
                items-center
                justify-center
                rounded-lg
                text-slate-400

                transition-colors

                hover:bg-slate-100
                hover:text-slate-700

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:text-slate-500
                dark:hover:bg-slate-800
                dark:hover:text-slate-200
              "
            >
              <MoreHorizontal
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="
                  absolute right-0
                  top-[calc(100%+6px)]
                  z-30
                  w-44
                  rounded-xl
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
                {showSettings && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSettings}
                    className="
                      flex w-full
                      items-center gap-2.5
                      rounded-lg
                      px-3 py-2

                      text-left text-sm
                      text-slate-700

                      transition-colors

                      hover:bg-slate-50

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-indigo-500

                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                  >
                    <Settings
                      size={15}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    Workspace settings
                  </button>
                )}

                {showDelete && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleDelete}
                    className="
                      flex w-full
                      items-center gap-2.5
                      rounded-lg
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
                    <Trash2
                      size={15}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    Delete workspace
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Workspace identity */}
      <div className="mt-5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            className="
              truncate
              text-base font-semibold
              tracking-[-0.01em]
              text-slate-950

              dark:text-white
            "
          >
            {name}
          </h2>

          {showRole && role && (
            <span
              className="
                rounded-full
                bg-indigo-50
                px-2 py-0.5

                text-[11px]
                font-medium
                text-indigo-700

                dark:bg-indigo-500/10
                dark:text-indigo-300
              "
            >
              {role}
            </span>
          )}
        </div>

        {description && (
          <p
            className="
              mt-1.5
              line-clamp-2
              text-sm leading-5
              text-slate-500

              dark:text-slate-400
            "
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        className="
          mt-auto
          flex items-end
          justify-between
          gap-4
          pt-6
        "
      >
        {showMemberCount ? (
          <div
            className="
              flex items-center gap-1.5
              text-xs
              text-slate-500

              dark:text-slate-400
            "
          >
            <Users
              size={15}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              {memberCount}{' '}
              {memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={onSelect}
          className="
            inline-flex
            items-center gap-1.5

            text-sm font-medium
            text-indigo-600

            transition-colors

            hover:text-indigo-800

            focus-visible:rounded-md
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            focus-visible:ring-offset-2

            dark:text-indigo-400
            dark:hover:text-indigo-300
            dark:focus-visible:ring-offset-slate-900
          "
        >
          {actionLabel}

          <ArrowRight
            size={15}
            strokeWidth={2}
            aria-hidden="true"
            className="
              transition-transform
              group-hover:translate-x-0.5
            "
          />
        </button>
      </div>
    </article>
  );
};

export default WorkspaceCard;