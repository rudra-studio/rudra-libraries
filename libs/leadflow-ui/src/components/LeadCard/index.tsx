import React from 'react';
import {
  Building2,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  IndianRupee,
  Mail,
  MoreHorizontal,
  Phone,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export interface LeadCardProps {
  /**
   * Unique lead identifier.
   */
  id?: string;

  /**
   * Lead/contact name.
   */
  name?: string;

  /**
   * Company or organization name.
   */
  company?: string;

  /**
   * Optional job title.
   */
  jobTitle?: string;

  /**
   * Lead avatar URL.
   */
  avatarUrl?: string;

  /**
   * Initials displayed when no avatar exists.
   */
  initials?: string;

  /**
   * Formatted opportunity value.
   *
   * Example: "₹2.4L"
   */
  value?: string;

  /**
   * Optional email address.
   */
  email?: string;

  /**
   * Optional phone number.
   */
  phone?: string;

  /**
   * Current lead stage/status label.
   *
   * Example: "Qualified"
   */
  status?: string;

  /**
   * Status visual style.
   * @select|slate|blue|indigo|violet|amber|emerald|rose
   */
  statusTone?:
    | 'slate'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'amber'
    | 'emerald'
    | 'rose';

  /**
   * Assigned owner name.
   */
  ownerName?: string;

  /**
   * Assigned owner avatar URL.
   */
  ownerAvatarUrl?: string;

  /**
   * Assigned owner initials.
   */
  ownerInitials?: string;

  /**
   * Human-readable last activity.
   *
   * Example: "2h ago"
   */
  lastActivity?: string;

  /**
   * Human-readable expected close date.
   *
   * Example: "Oct 18"
   */
  expectedClose?: string;

  /**
   * Whether the options button is displayed.
   */
  showMenu?: boolean;

  /**
   * Whether email quick action is displayed.
   */
  showEmailAction?: boolean;

  /**
   * Whether phone quick action is displayed.
   */
  showPhoneAction?: boolean;

  /**
   * Whether the entire card can be selected.
   */
  clickable?: boolean;

  /**
   * Accessible label for the card.
   */
  ariaLabel?: string;

  /**
   * Emits the lead ID when the card is selected.
   */
  onClick?: (leadId: string) => void;

  /**
   * Emits the lead ID when email is selected.
   */
  onEmailClick?: (leadId: string) => void;

  /**
   * Emits the lead ID when phone is selected.
   */
  onPhoneClick?: (leadId: string) => void;

  /**
   * Emits the lead ID when the options menu is selected.
   */
  onMenuClick?: (leadId: string) => void;

  /**
   * Utility classes exposed to Rudra.
   * @type|class
   */
  className?: string;
}

const STATUS_STYLES: Record<
  NonNullable<LeadCardProps['statusTone']>,
  string
> = {
  slate: `
    bg-slate-100
    text-slate-600
    dark:bg-slate-800
    dark:text-slate-300
  `,
  blue: `
    bg-blue-50
    text-blue-700
    dark:bg-blue-500/10
    dark:text-blue-300
  `,
  indigo: `
    bg-indigo-50
    text-indigo-700
    dark:bg-indigo-500/10
    dark:text-indigo-300
  `,
  violet: `
    bg-violet-50
    text-violet-700
    dark:bg-violet-500/10
    dark:text-violet-300
  `,
  amber: `
    bg-amber-50
    text-amber-700
    dark:bg-amber-500/10
    dark:text-amber-300
  `,
  emerald: `
    bg-emerald-50
    text-emerald-700
    dark:bg-emerald-500/10
    dark:text-emerald-300
  `,
  rose: `
    bg-rose-50
    text-rose-700
    dark:bg-rose-500/10
    dark:text-rose-300
  `,
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

const LeadCard: React.FC<LeadCardProps> = ({
  id = '',
  name = '',
  company = '',
  jobTitle = '',
  avatarUrl = '',
  initials = '',
  value = '',
  email = '',
  phone = '',
  status = '',
  statusTone = 'slate',
  ownerName = '',
  ownerAvatarUrl = '',
  ownerInitials = '',
  lastActivity = '',
  expectedClose = '',
  showMenu = true,
  showEmailAction = true,
  showPhoneAction = false,
  clickable = true,
  ariaLabel = '',
  onClick,
  onEmailClick,
  onPhoneClick,
  onMenuClick,
  className = '',
}) => {
  const leadInitials =
    initials || getInitials(name);

  const assignedOwnerInitials =
    ownerInitials ||
    getInitials(ownerName);

  const handleCardClick = () => {
    if (!clickable) return;

    onClick?.(id);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (!clickable) return;

    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      onClick?.(id);
    }
  };

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    action?: (leadId: string) => void,
  ) => {
    event.stopPropagation();
    action?.(id);
  };

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={
        clickable
          ? ariaLabel ||
            (name
              ? `Open ${name}`
              : 'Open lead')
          : undefined
      }
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={`
        group
        relative
        min-w-0
        rounded-2xl
        border border-slate-200
        bg-white
        p-4
        text-left
        shadow-sm
        shadow-slate-950/[0.025]

        transition-all duration-200

        dark:border-slate-800
        dark:bg-slate-950
        dark:shadow-black/10

        ${
          clickable
            ? `
              cursor-pointer

              hover:-translate-y-0.5
              hover:border-slate-300
              hover:shadow-md
              hover:shadow-slate-950/[0.05]

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:hover:border-slate-700
              dark:hover:shadow-black/20
              dark:focus-visible:ring-indigo-400
              dark:focus-visible:ring-offset-slate-950
            `
            : ''
        }

        ${className}
      `}
    >
      {/* Header */}
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
          className="
            flex h-10 w-10
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            bg-gradient-to-br
            from-slate-100
            to-slate-200

            text-xs
            font-semibold
            text-slate-600

            ring-1
            ring-slate-200/70

            dark:from-slate-800
            dark:to-slate-900
            dark:text-slate-300
            dark:ring-slate-700
          "
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="
                h-full w-full
                object-cover
              "
            />
          ) : (
            leadInitials || (
              <UserRound
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )
          )}
        </span>

        {/* Identity */}
        <div className="min-w-0 flex-1">
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

          {(company || jobTitle) && (
            <div
              className="
                mt-0.5
                flex min-w-0
                items-center gap-1.5
                text-xs
                text-slate-500

                dark:text-slate-400
              "
            >
              {company && (
                <>
                  <Building2
                    size={12}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {company}
                  </span>
                </>
              )}

              {company && jobTitle && (
                <span
                  aria-hidden="true"
                  className="
                    shrink-0
                    text-slate-300
                    dark:text-slate-700
                  "
                >
                  ·
                </span>
              )}

              {jobTitle && (
                <span className="truncate">
                  {jobTitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Menu */}
        {showMenu && (
          <button
            type="button"
            aria-label={`More options${
              name ? ` for ${name}` : ''
            }`}
            onClick={(event) =>
              handleAction(
                event,
                onMenuClick,
              )
            }
            className="
              flex h-8 w-8
              shrink-0
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
              dark:hover:bg-slate-900
              dark:hover:text-slate-200
            "
          >
            <MoreHorizontal
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Value + status */}
      {(value || status) && (
        <div
          className="
            mt-4
            flex
            flex-wrap
            items-center
            justify-between
            gap-2
          "
        >
          {value && (
            <div
              className="
                flex items-center
                gap-1.5
                text-sm
                font-semibold
                text-slate-900

                dark:text-slate-100
              "
            >
              <IndianRupee
                size={14}
                strokeWidth={1.9}
                aria-hidden="true"
                className="
                  text-slate-400
                  dark:text-slate-500
                "
              />

              <span>{value}</span>
            </div>
          )}

          {status && (
            <span
              className={`
                inline-flex
                items-center
                rounded-full
                px-2 py-1
                text-[10px]
                font-semibold

                ${STATUS_STYLES[statusTone]}
              `}
            >
              {status}
            </span>
          )}
        </div>
      )}

      {/* Meta */}
      {(expectedClose ||
        lastActivity) && (
        <div
          className="
            mt-4
            flex
            min-w-0
            flex-wrap
            items-center
            gap-x-3 gap-y-2
            border-t
            border-slate-100
            pt-3

            dark:border-slate-900
          "
        >
          {expectedClose && (
            <div
              className="
                flex min-w-0
                items-center gap-1.5
                text-[11px]
                text-slate-500

                dark:text-slate-400
              "
            >
              <CalendarDays
                size={13}
                strokeWidth={1.8}
                aria-hidden="true"
                className="shrink-0"
              />

              <span className="truncate">
                {expectedClose}
              </span>
            </div>
          )}

          {lastActivity && (
            <div
              className="
                flex min-w-0
                items-center gap-1.5
                text-[11px]
                text-slate-400

                dark:text-slate-500
              "
            >
              <Clock3
                size={13}
                strokeWidth={1.8}
                aria-hidden="true"
                className="shrink-0"
              />

              <span className="truncate">
                {lastActivity}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {(ownerName ||
        (showEmailAction && email) ||
        (showPhoneAction && phone)) && (
        <div
          className="
            mt-3
            flex
            min-w-0
            items-center
            justify-between
            gap-3
          "
        >
          {/* Owner */}
          {ownerName ? (
            <div
              className="
                flex min-w-0
                items-center gap-2
              "
            >
              <span
                className="
                  flex h-6 w-6
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-slate-100
                  text-[9px]
                  font-semibold
                  text-slate-600

                  ring-1
                  ring-slate-200

                  dark:bg-slate-800
                  dark:text-slate-300
                  dark:ring-slate-700
                "
              >
                {ownerAvatarUrl ? (
                  <img
                    src={ownerAvatarUrl}
                    alt=""
                    className="
                      h-full w-full
                      object-cover
                    "
                  />
                ) : (
                  assignedOwnerInitials
                )}
              </span>

              <span
                className="
                  max-w-[120px]
                  truncate
                  text-[11px]
                  font-medium
                  text-slate-500

                  dark:text-slate-400
                "
              >
                {ownerName}
              </span>
            </div>
          ) : (
            <span />
          )}

          {/* Quick actions */}
          <div
            className="
              flex shrink-0
              items-center gap-1
            "
          >
            {showPhoneAction &&
              phone && (
                <button
                  type="button"
                  aria-label={`Call ${
                    name || 'lead'
                  }`}
                  onClick={(event) =>
                    handleAction(
                      event,
                      onPhoneClick,
                    )
                  }
                  className="
                    flex h-8 w-8
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
                    dark:hover:bg-slate-900
                    dark:hover:text-slate-200
                  "
                >
                  <Phone
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              )}

            {showEmailAction &&
              email && (
                <button
                  type="button"
                  aria-label={`Email ${
                    name || 'lead'
                  }`}
                  onClick={(event) =>
                    handleAction(
                      event,
                      onEmailClick,
                    )
                  }
                  className="
                    flex h-8 w-8
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
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadCard;