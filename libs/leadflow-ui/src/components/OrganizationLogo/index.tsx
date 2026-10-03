import React from 'react';
import {
  Building2,
  Camera,
} from 'lucide-react';

export interface OrganizationLogoProps {
  /**
   * Stable organization identifier.
   */
  organizationId?: string;

  /**
   * Organization display name.
   */
  name?: string;

  /**
   * Optional secondary text.
   */
  subtitle?: string;

  /**
   * Organization logo URL.
   */
  logoUrl?: string;

  /**
   * Explicit fallback initials.
   */
  initials?: string;

  /**
   * Component presentation.
   *
   * @select|logo|identity
   */
  variant?: 'logo' | 'identity';

  /**
   * Logo size.
   *
   * @select|small|medium|large|xlarge
   */
  size?:
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge';

  /**
   * Logo shape.
   *
   * @select|rounded|square|circle
   */
  shape?:
    | 'rounded'
    | 'square'
    | 'circle';

  /**
   * Whether the organization name is shown
   * in identity mode.
   */
  showName?: boolean;

  /**
   * Whether the subtitle is shown
   * in identity mode.
   */
  showSubtitle?: boolean;

  /**
   * Whether the logo can trigger
   * an edit/upload action.
   */
  editable?: boolean;

  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;

  /**
   * Accessible label.
   */
  ariaLabel?: string;

  /**
   * Emits the organization ID when
   * the identity is clicked.
   */
  onClick?: (
    organizationId: string,
  ) => void;

  /**
   * Requests logo editing/uploading.
   */
  onLogoEdit?: (
    organizationId: string,
  ) => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const SIZE_STYLES = {
  small: {
    logo: 'h-8 w-8',
    icon: 14,
    initials: 'text-[10px]',
    name: 'text-xs',
    subtitle: 'text-[10px]',
    gap: 'gap-2',
  },

  medium: {
    logo: 'h-10 w-10',
    icon: 17,
    initials: 'text-xs',
    name: 'text-sm',
    subtitle: 'text-[11px]',
    gap: 'gap-2.5',
  },

  large: {
    logo: 'h-14 w-14',
    icon: 21,
    initials: 'text-sm',
    name: 'text-base',
    subtitle: 'text-xs',
    gap: 'gap-3',
  },

  xlarge: {
    logo: 'h-20 w-20',
    icon: 28,
    initials: 'text-lg',
    name: 'text-lg',
    subtitle: 'text-sm',
    gap: 'gap-4',
  },
} as const;

const SHAPE_STYLES: Record<
  NonNullable<
    OrganizationLogoProps['shape']
  >,
  string
> = {
  rounded: 'rounded-xl',
  square: 'rounded-md',
  circle: 'rounded-full',
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

const OrganizationLogo: React.FC<
  OrganizationLogoProps
> = ({
  organizationId = '',
  name = '',
  subtitle = '',
  logoUrl = '',
  initials = '',
  variant = 'identity',
  size = 'medium',
  shape = 'rounded',
  showName = true,
  showSubtitle = true,
  editable = false,
  disabled = false,
  ariaLabel = '',
  onClick,
  onLogoEdit,
  className = '',
}) => {
  const config =
    SIZE_STYLES[size];

  const displayInitials =
    initials ||
    getInitials(name);

  const showIdentity =
    variant === 'identity';

  const clickable =
    Boolean(onClick) &&
    !disabled;

  const handleClick = () => {
    if (!clickable) return;

    onClick?.(
      organizationId,
    );
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

      onClick?.(
        organizationId,
      );
    }
  };

  return (
    <div
      role={
        clickable
          ? 'button'
          : undefined
      }
      tabIndex={
        clickable ? 0 : undefined
      }
      aria-label={
        clickable
          ? ariaLabel ||
            (name
              ? `Open ${name}`
              : 'Open organization')
          : undefined
      }
      onClick={handleClick}
      onKeyDown={
        handleKeyDown
      }
      className={`
        inline-flex
        min-w-0
        items-center

        ${config.gap}

        ${
          clickable
            ? `
              cursor-pointer

              rounded-xl

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:focus-visible:ring-indigo-400
              dark:focus-visible:ring-offset-slate-950
            `
            : ''
        }

        ${
          disabled
            ? `
              cursor-not-allowed
              opacity-60
            `
            : ''
        }

        ${className}
      `}
    >
      {/* Logo */}
      <div
        className={`
          group/logo
          relative

          shrink-0

          ${config.logo}
          ${SHAPE_STYLES[shape]}
        `}
      >
        <div
          className={`
            flex
            h-full
            w-full
            items-center
            justify-center
            overflow-hidden

            ${SHAPE_STYLES[shape]}

            border
            border-slate-200

            bg-gradient-to-br
            from-slate-50
            to-slate-100

            font-semibold

            text-slate-600

            shadow-sm

            dark:border-slate-700
            dark:from-slate-800
            dark:to-slate-900
            dark:text-slate-300
          `}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={
                name
                  ? `${name} logo`
                  : 'Organization logo'
              }
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : displayInitials ? (
            <span
              className={
                config.initials
              }
            >
              {displayInitials}
            </span>
          ) : (
            <Building2
              size={config.icon}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Edit overlay */}
        {editable && (
          <button
            type="button"
            disabled={disabled}
            aria-label={
              name
                ? `Change ${name} logo`
                : 'Change organization logo'
            }
            onClick={(
              event,
            ) => {
              event.stopPropagation();

              onLogoEdit?.(
                organizationId,
              );
            }}
            className={`
              absolute
              inset-0

              flex
              items-center
              justify-center

              ${SHAPE_STYLES[shape]}

              bg-slate-950/55

              text-white

              opacity-0

              transition-opacity

              hover:opacity-100

              focus:opacity-100

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              disabled:cursor-not-allowed

              group-hover/logo:opacity-100

              dark:focus-visible:ring-indigo-400
              dark:focus-visible:ring-offset-slate-950
            `}
          >
            <Camera
              size={
                Math.max(
                  13,
                  config.icon - 1,
                )
              }
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Identity */}
      {showIdentity &&
        (showName ||
          showSubtitle) && (
          <div
            className="
              min-w-0
              flex-1
            "
          >
            {showName &&
              name && (
                <div
                  className={`
                    truncate
                    font-semibold

                    text-slate-900

                    dark:text-slate-100

                    ${config.name}
                  `}
                >
                  {name}
                </div>
              )}

            {showSubtitle &&
              subtitle && (
                <div
                  className={`
                    mt-0.5
                    truncate

                    text-slate-400

                    dark:text-slate-500

                    ${config.subtitle}
                  `}
                >
                  {subtitle}
                </div>
              )}
          </div>
        )}
    </div>
  );
};

export default OrganizationLogo;