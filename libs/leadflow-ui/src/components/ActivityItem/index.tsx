import React from 'react';
import {
  Activity,
  Calendar,
  Check,
  CircleDollarSign,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  StickyNote,
  Trophy,
  UserPlus,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

export interface ActivityItemProps {
  /**
   * Unique activity identifier.
   */
  id?: string;

  /**
   * Primary activity text.
   * @translate
   */
  title?: string;

  /**
   * Optional supporting description.
   * @translate
   */
  description?: string;

  /**
   * Human-readable time displayed to the user.
   *
   * Examples:
   * "2 minutes ago"
   * "Yesterday"
   * "Sep 24, 10:30 AM"
   */
  timestamp?: string;

  /**
   * Activity type used for semantic styling.
   * @select|default|lead|email|note|call|meeting|stage|won|document
   */
  type?:
  | 'default'
  | 'lead'
  | 'email'
  | 'note'
  | 'call'
  | 'meeting'
  | 'stage'
  | 'won'
  | 'document';

  /**
   * Optional Lucide icon override.
   * @icon
   */
  icon?: string;

  /**
   * Optional actor name.
   */
  actorName?: string;

  /**
   * Optional actor avatar URL.
   */
  actorAvatarUrl?: string;

  /**
   * Optional actor initials used when no avatar exists.
   */
  actorInitials?: string;

  /**
   * Optional entity label associated with the activity.
   *
   * Example: "Acme Labs"
   */
  entityLabel?: string;

  /**
   * Optional metadata displayed as a compact badge.
   *
   * Example: "Qualified"
   */
  metaLabel?: string;

  /**
   * Whether the activity should show its timeline connector.
   */
  showConnector?: boolean;

  /**
   * Whether this activity can be selected.
   */
  clickable?: boolean;

  /**
   * Accessible label when clickable.
   */
  ariaLabel?: string;

  /**
   * Emits the activity ID when selected.
   */
  onClick?: (activityId: string) => void;

  /**
   * Utility classes exposed to Rudra.
   * @type|class
   */
  className?: string;
}

const ICONS: Record<string, LucideIcon> = {
  Activity,
  Calendar,
  Check,
  CircleDollarSign,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  StickyNote,
  Trophy,
  UserPlus,
  UsersRound,
};

const TYPE_CONFIG: Record<
  NonNullable<ActivityItemProps['type']>,
  {
    icon: LucideIcon;
    iconClassName: string;
  }
> = {
  default: {
    icon: Activity,
    iconClassName: `
      bg-slate-100
      text-slate-600
      ring-slate-200
      dark:bg-slate-800
      dark:text-slate-300
      dark:ring-slate-700
    `,
  },

  lead: {
    icon: UserPlus,
    iconClassName: `
      bg-blue-50
      text-blue-600
      ring-blue-100
      dark:bg-blue-500/10
      dark:text-blue-300
      dark:ring-blue-500/20
    `,
  },

  email: {
    icon: Mail,
    iconClassName: `
      bg-indigo-50
      text-indigo-600
      ring-indigo-100
      dark:bg-indigo-500/10
      dark:text-indigo-300
      dark:ring-indigo-500/20
    `,
  },

  note: {
    icon: StickyNote,
    iconClassName: `
      bg-amber-50
      text-amber-600
      ring-amber-100
      dark:bg-amber-500/10
      dark:text-amber-300
      dark:ring-amber-500/20
    `,
  },

  call: {
    icon: Phone,
    iconClassName: `
      bg-violet-50
      text-violet-600
      ring-violet-100
      dark:bg-violet-500/10
      dark:text-violet-300
      dark:ring-violet-500/20
    `,
  },

  meeting: {
    icon: Calendar,
    iconClassName: `
      bg-cyan-50
      text-cyan-600
      ring-cyan-100
      dark:bg-cyan-500/10
      dark:text-cyan-300
      dark:ring-cyan-500/20
    `,
  },

  stage: {
    icon: RefreshCw,
    iconClassName: `
      bg-violet-50
      text-violet-600
      ring-violet-100
      dark:bg-violet-500/10
      dark:text-violet-300
      dark:ring-violet-500/20
    `,
  },

  won: {
    icon: Trophy,
    iconClassName: `
      bg-emerald-50
      text-emerald-600
      ring-emerald-100
      dark:bg-emerald-500/10
      dark:text-emerald-300
      dark:ring-emerald-500/20
    `,
  },

  document: {
    icon: FileText,
    iconClassName: `
      bg-slate-100
      text-slate-600
      ring-slate-200
      dark:bg-slate-800
      dark:text-slate-300
      dark:ring-slate-700
    `,
  },
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

const ActivityItem: React.FC<ActivityItemProps> = ({
  id = '',
  title = '',
  description = '',
  timestamp = '',
  type = 'default',
  icon = '',
  actorName = '',
  actorAvatarUrl = '',
  actorInitials = '',
  entityLabel = '',
  metaLabel = '',
  showConnector = false,
  clickable = false,
  ariaLabel = '',
  onClick,
  className = '',
}) => {
  const config = TYPE_CONFIG[type];

  const Icon =
    (icon && ICONS[icon]) ||
    config.icon;

  const initials =
    actorInitials ||
    getInitials(actorName);

  const handleClick = () => {
    if (!clickable) return;

    onClick?.(id);
  };

  const content = (
    <>
      {/* Timeline marker */}
      <div
        className="
          relative
          flex shrink-0
          flex-col items-center
        "
      >
        <span
          className={`
            relative z-10
            flex h-9 w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            ring-1 ring-inset

            ${config.iconClassName}
          `}
        >
          <Icon
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        {showConnector && (
          <span
            aria-hidden="true"
            className="
              absolute
              left-1/2
              top-9
              h-[calc(100%+16px)]
              w-px
              -translate-x-1/2
              bg-slate-200

              dark:bg-slate-800
            "
          />
        )}
      </div>

      {/* Content */}
      <div
        className="
          min-w-0
          flex-1
          pb-1
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-col
            gap-1

            sm:flex-row
            sm:items-start
            sm:justify-between
            sm:gap-4
          "
        >
          <div className="min-w-0">
            {title && (
              <p
                className="
                  text-sm
                  font-medium
                  leading-5
                  text-slate-800

                  dark:text-slate-200
                "
              >
                {title}
              </p>
            )}

            {description && (
              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500

                  dark:text-slate-400
                "
              >
                {description}
              </p>
            )}
          </div>

          {timestamp && (
            <time
              className="
                shrink-0
                text-[11px]
                text-slate-400

                dark:text-slate-500

                sm:pt-0.5
              "
            >
              {timestamp}
            </time>
          )}
        </div>

        {(actorName ||
          entityLabel ||
          metaLabel) && (
            <div
              className="
              mt-3
              flex
              min-w-0
              flex-wrap
              items-center
              gap-2
            "
            >
              {actorName && (
                <div
                  className="
                  flex
                  min-w-0
                  items-center
                  gap-1.5
                "
                >
                  <span
                    className="
                    flex h-5 w-5
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    bg-slate-100
                    text-[8px]
                    font-semibold
                    text-slate-600

                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                  >
                    {actorAvatarUrl ? (
                      <img
                        src={actorAvatarUrl}
                        alt=""
                        className="
                        h-full w-full
                        object-cover
                      "
                      />
                    ) : (
                      initials
                    )}
                  </span>

                  <span
                    className="
                    max-w-[140px]
                    truncate
                    text-[11px]
                    font-medium
                    text-slate-500

                    dark:text-slate-400
                  "
                  >
                    {actorName}
                  </span>
                </div>
              )}

              {entityLabel && (
                <span
                  className="
                  max-w-[160px]
                  truncate
                  rounded-md
                  bg-slate-100
                  px-2 py-1
                  text-[10px]
                  font-medium
                  text-slate-600

                  dark:bg-slate-800
                  dark:text-slate-300
                "
                >
                  {entityLabel}
                </span>
              )}

              {metaLabel && (
                <span
                  className="
                  rounded-md
                  bg-indigo-50
                  px-2 py-1
                  text-[10px]
                  font-medium
                  text-indigo-600

                  dark:bg-indigo-500/10
                  dark:text-indigo-300
                "
                >
                  {metaLabel}
                </span>
              )}
            </div>
          )}
      </div>
    </>
  );

  const commonClassName = `
    relative
    flex w-full
    min-w-0
    items-start
    gap-3
    rounded-xl
    text-left

    ${clickable
      ? `
        cursor-pointer
        transition-colors

        hover:bg-slate-50

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-500

        dark:hover:bg-slate-900/60
      `
      : ''
    }

    ${className}
  `;

  if (clickable) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          ariaLabel ||
          title ||
          'View activity'
        }
        className={`
          ${commonClassName}
          p-2
        `}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={commonClassName}>
      {content}
    </div>
  );
};

export default ActivityItem;