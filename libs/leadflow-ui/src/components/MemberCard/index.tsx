import React from 'react';
import {
  Clock3,
  Mail,
  MoreHorizontal,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

export interface MemberCardProps {
  /**
   * Stable member/user identifier.
   */
  memberId?: string;

  /**
   * Member display name.
   */
  name?: string;

  /**
   * Member email.
   */
  email?: string;

  /**
   * Optional job title or supporting text.
   */
  description?: string;

  /**
   * Avatar image URL.
   */
  avatarUrl?: string;

  /**
   * Initials used when no avatar exists.
   */
  initials?: string;

  /**
   * Organization role.
   */
  role?: string;

  /**
   * Membership status label.
   */
  status?: string;

  /**
   * Status appearance.
   *
   * @select|slate|blue|amber|emerald|rose
   */
  statusTone?:
    | 'slate'
    | 'blue'
    | 'amber'
    | 'emerald'
    | 'rose';

  /**
   * Optional activity text.
   *
   * Example: "Active 2h ago"
   */
  lastActive?: string;

  /**
   * Card presentation.
   *
   * @select|default|compact
   */
  variant?: 'default' | 'compact';

  /**
   * Whether the role is displayed.
   */
  showRole?: boolean;

  /**
   * Whether membership status is displayed.
   */
  showStatus?: boolean;

  /**
   * Whether last activity is displayed.
   */
  showLastActive?: boolean;

  /**
   * Whether email action is displayed.
   */
  showEmailAction?: boolean;

  /**
   * Whether menu action is displayed.
   */
  showMenuAction?: boolean;

  /**
   * Whether the entire member card is clickable.
   */
  clickable?: boolean;

  /**
   * Accessible card label.
   */
  ariaLabel?: string;

  /**
   * Emits the stable member ID.
   */
  onClick?: (memberId: string) => void;

  /**
   * Emits the stable member ID.
   */
  onEmailClick?: (memberId: string) => void;

  /**
   * Emits the stable member ID.
   */
  onMenuClick?: (memberId: string) => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const STATUS_STYLES: Record<
  NonNullable<MemberCardProps['statusTone']>,
  string
> = {
  slate: `
    bg-slate-100 text-slate-600
    dark:bg-slate-800 dark:text-slate-300
  `,
  blue: `
    bg-blue-50 text-blue-700
    dark:bg-blue-500/10 dark:text-blue-300
  `,
  amber: `
    bg-amber-50 text-amber-700
    dark:bg-amber-500/10 dark:text-amber-300
  `,
  emerald: `
    bg-emerald-50 text-emerald-700
    dark:bg-emerald-500/10 dark:text-emerald-300
  `,
  rose: `
    bg-rose-50 text-rose-700
    dark:bg-rose-500/10 dark:text-rose-300
  `,
};

const getInitials = (
  value?: string,
): string => {
  if (!value) return '';

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join('');
};

const MemberCard: React.FC<
  MemberCardProps
> = ({
  memberId = '',
  name = '',
  email = '',
  description = '',
  avatarUrl = '',
  initials = '',
  role = '',
  status = '',
  statusTone = 'slate',
  lastActive = '',
  variant = 'default',
  showRole = true,
  showStatus = true,
  showLastActive = true,
  showEmailAction = true,
  showMenuAction = true,
  clickable = false,
  ariaLabel = '',
  onClick,
  onEmailClick,
  onMenuClick,
  className = '',
}) => {
  const displayInitials =
    initials || getInitials(name);

  const compact =
    variant === 'compact';

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (!clickable) return;

    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      onClick?.(memberId);
    }
  };

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={
        clickable
          ? ariaLabel ||
            (name
              ? `View ${name}`
              : 'View member')
          : undefined
      }
      onClick={() => {
        if (clickable) {
          onClick?.(memberId);
        }
      }}
      onKeyDown={handleKeyDown}
      className={`
        group

        min-w-0

        rounded-2xl

        border
        border-slate-200

        bg-white

        shadow-sm
        shadow-slate-950/[0.025]

        transition-[border-color,box-shadow,background-color]

        dark:border-slate-800
        dark:bg-slate-950
        dark:shadow-black/10

        ${
          clickable
            ? `
              cursor-pointer

              hover:border-slate-300
              hover:shadow-md
              hover:shadow-slate-950/[0.04]

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:hover:border-slate-700
              dark:focus-visible:ring-indigo-400
              dark:focus-visible:ring-offset-slate-950
            `
            : ''
        }

        ${
          compact
            ? 'p-3'
            : 'p-4'
        }

        ${className}
      `}
    >
      <div
        className="
          flex
          min-w-0
          items-start
          gap-3
        "
      >
        {/* Avatar */}
        <span
          className={`
            flex
            shrink-0
            items-center
            justify-center
            overflow-hidden

            rounded-xl

            bg-gradient-to-br
            from-slate-100
            to-slate-200

            font-semibold
            text-slate-600

            ring-1
            ring-slate-200

            dark:from-slate-800
            dark:to-slate-900
            dark:text-slate-300
            dark:ring-slate-700

            ${
              compact
                ? `
                  h-9
                  w-9
                  text-[10px]
                `
                : `
                  h-11
                  w-11
                  text-xs
                `
            }
          `}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : displayInitials ? (
            displayInitials
          ) : (
            <UserRound
              size={compact ? 16 : 19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </span>

        {/* Main information */}
        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              min-w-0
              items-start
              justify-between
              gap-2
            "
          >
            <div className="min-w-0">
              {name && (
                <div
                  className="
                    truncate

                    text-sm
                    font-semibold

                    text-slate-900

                    dark:text-slate-100
                  "
                >
                  {name}
                </div>
              )}

              {email && (
                <div
                  className="
                    mt-0.5
                    truncate

                    text-[11px]

                    text-slate-400

                    dark:text-slate-500
                  "
                >
                  {email}
                </div>
              )}
            </div>

            {/* Actions */}
            {(showEmailAction ||
              showMenuAction) && (
              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-0.5
                "
              >
                {showEmailAction &&
                  email && (
                    <button
                      type="button"
                      aria-label={`Email ${
                        name || 'member'
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();

                        onEmailClick?.(
                          memberId,
                        );
                      }}
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center

                        rounded-lg

                        text-slate-400

                        transition-colors

                        hover:bg-indigo-50
                        hover:text-indigo-600

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        dark:text-slate-500
                        dark:hover:bg-indigo-500/10
                        dark:hover:text-indigo-300
                      "
                    >
                      <Mail
                        size={14}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </button>
                  )}

                {showMenuAction && (
                  <button
                    type="button"
                    aria-label={`More options for ${
                      name || 'member'
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();

                      onMenuClick?.(
                        memberId,
                      );
                    }}
                    className="
                      flex
                      h-8
                      w-8
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
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            )}
          </div>

          {description &&
            !compact && (
              <p
                className="
                  mt-2

                  line-clamp-2

                  text-xs
                  leading-5

                  text-slate-500

                  dark:text-slate-400
                "
              >
                {description}
              </p>
            )}

          {/* Metadata */}
          {(showRole ||
            showStatus ||
            showLastActive) && (
            <div
              className="
                mt-3

                flex
                min-w-0
                flex-wrap
                items-center
                gap-1.5
              "
            >
              {showRole && role && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1

                    rounded-full

                    bg-slate-100

                    px-2
                    py-1

                    text-[10px]
                    font-semibold

                    text-slate-600

                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  <ShieldCheck
                    size={11}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  {role}
                </span>
              )}

              {showStatus &&
                status && (
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5

                      rounded-full

                      px-2
                      py-1

                      text-[10px]
                      font-semibold

                      ${STATUS_STYLES[
                        statusTone
                      ]}
                    `}
                  >
                    <span
                      aria-hidden="true"
                      className="
                        h-1.5
                        w-1.5

                        rounded-full

                        bg-current

                        opacity-70
                      "
                    />

                    {status}
                  </span>
                )}

              {showLastActive &&
                lastActive && (
                  <span
                    className="
                      inline-flex
                      min-w-0
                      items-center
                      gap-1

                      px-1

                      text-[10px]

                      text-slate-400

                      dark:text-slate-500
                    "
                  >
                    <Clock3
                      size={11}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span className="truncate">
                      {lastActive}
                    </span>
                  </span>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;