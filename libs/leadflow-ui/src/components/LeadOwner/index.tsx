import React from 'react';
import {
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export interface LeadOwnerProps {
  /**
   * Stable owner/user identifier.
   */
  ownerId?: string;

  /**
   * Owner display name.
   */
  name?: string;

  /**
   * Optional secondary text.
   *
   * Examples:
   * "Sales Manager"
   * "siva@rudra.app"
   */
  description?: string;

  /**
   * Avatar image URL.
   */
  avatarUrl?: string;

  /**
   * Initials displayed when no avatar is available.
   */
  initials?: string;

  /**
   * Layout density.
   *
   * @select|compact|default|detailed
   */
  variant?:
    | 'compact'
    | 'default'
    | 'detailed';

  /**
   * Avatar size.
   *
   * @select|small|medium|large
   */
  size?:
    | 'small'
    | 'medium'
    | 'large';

  /**
   * Optional label displayed before the owner.
   *
   * Example: "Owner"
   *
   * @translate
   */
  label?: string;

  /**
   * Show the owner name.
   */
  showName?: boolean;

  /**
   * Show secondary description.
   *
   * Used primarily with detailed variant.
   */
  showDescription?: boolean;

  /**
   * Whether the owner can be selected.
   */
  clickable?: boolean;

  /**
   * Accessible label when interactive.
   */
  ariaLabel?: string;

  /**
   * Emits the stable owner ID.
   */
  onClick?: (ownerId: string) => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const AVATAR_SIZES: Record<
  NonNullable<LeadOwnerProps['size']>,
  {
    container: string;
    text: string;
    icon: number;
  }
> = {
  small: {
    container: 'h-6 w-6',
    text: 'text-[9px]',
    icon: 13,
  },

  medium: {
    container: 'h-8 w-8',
    text: 'text-[10px]',
    icon: 15,
  },

  large: {
    container: 'h-10 w-10',
    text: 'text-xs',
    icon: 18,
  },
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

const LeadOwner: React.FC<
  LeadOwnerProps
> = ({
  ownerId = '',
  name = '',
  description = '',
  avatarUrl = '',
  initials = '',
  variant = 'default',
  size = 'medium',
  label = '',
  showName = true,
  showDescription = true,
  clickable = false,
  ariaLabel = '',
  onClick,
  className = '',
}) => {
  const avatarSize =
    AVATAR_SIZES[size];

  const displayInitials =
    initials || getInitials(name);

  const showSecondary =
    variant === 'detailed' &&
    showDescription &&
    description;

  const handleClick = () => {
    if (!clickable) return;

    onClick?.(ownerId);
  };

  const content = (
    <>
      {/* Avatar */}
      <span
        className={`
          relative
          flex
          shrink-0
          items-center
          justify-center
          overflow-hidden

          rounded-full

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

          ${avatarSize.container}
          ${avatarSize.text}
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
            size={avatarSize.icon}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )}
      </span>

      {/* Text */}
      {variant !== 'compact' &&
        (showName ||
          showSecondary) && (
          <span
            className="
              min-w-0
              flex-1
            "
          >
            {showName && name && (
              <span
                className="
                  block
                  truncate

                  text-xs
                  font-medium
                  text-slate-700

                  dark:text-slate-200
                "
              >
                {name}
              </span>
            )}

            {showSecondary && (
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
                {description}
              </span>
            )}
          </span>
        )}
    </>
  );

  const ownerClasses = `
    inline-flex
    min-w-0
    items-center

    ${variant === 'compact'
      ? ''
      : 'gap-2'
    }

    ${
      clickable
        ? `
          cursor-pointer
          rounded-lg

          transition-colors

          hover:bg-slate-100

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-indigo-500
          focus-visible:ring-offset-1

          dark:hover:bg-slate-800
          dark:focus-visible:ring-indigo-400
          dark:focus-visible:ring-offset-slate-950
        `
        : ''
    }
  `;

  return (
    <div
      className={`
        flex
        min-w-0
        items-center
        gap-2

        ${className}
      `}
    >
      {label && (
        <span
          className="
            shrink-0

            text-[10px]
            font-medium
            uppercase
            tracking-[0.06em]

            text-slate-400

            dark:text-slate-500
          "
        >
          {label}
        </span>
      )}

      {clickable ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label={
            ariaLabel ||
            (name
              ? `View ${name}`
              : 'View owner')
          }
          className={`
            ${ownerClasses}
            p-1
          `}
        >
          {content}
        </button>
      ) : (
        <div className={ownerClasses}>
          {content}
        </div>
      )}
    </div>
  );
};

export default LeadOwner;