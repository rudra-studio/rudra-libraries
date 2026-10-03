import React from 'react';
import {
  Check,
  Circle,
  Clock3,
  X,
  type LucideIcon,
} from 'lucide-react';

export interface LeadStatusBadgeProps {
  /**
   * Status text displayed inside the badge.
   *
   * @translate
   */
  label?: string;

  /**
   * Visual status tone.
   *
   * @select|slate|blue|indigo|violet|amber|emerald|rose
   */
  tone?:
  | 'slate'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'amber'
  | 'emerald'
  | 'rose';

  /**
   * Optional Lucide icon name.
   *
   * @icon
   */
  icon?: string;

  /**
   * Badge size.
   *
   * @select|small|default
   */
  size?: 'small' | 'default';

  /**
   * Badge shape.
   *
   * @select|pill|rounded
   */
  shape?: 'pill' | 'rounded';

  /**
   * Show a small status dot before the label.
   *
   * Ignored when an explicit icon is provided.
   */
  showDot?: boolean;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const ICONS: Record<string, LucideIcon> = {
  Check,
  Circle,
  Clock3,
  X,
};

const TONES: Record<
  NonNullable<LeadStatusBadgeProps['tone']>,
  {
    badge: string;
    dot: string;
  }
> = {
  slate: {
    badge: `
      bg-slate-100
      text-slate-600
      ring-slate-200

      dark:bg-slate-800
      dark:text-slate-300
      dark:ring-slate-700
    `,
    dot: `
      bg-slate-400
      dark:bg-slate-500
    `,
  },

  blue: {
    badge: `
      bg-blue-50
      text-blue-700
      ring-blue-100

      dark:bg-blue-500/10
      dark:text-blue-300
      dark:ring-blue-500/20
    `,
    dot: `
      bg-blue-500
      dark:bg-blue-400
    `,
  },

  indigo: {
    badge: `
      bg-indigo-50
      text-indigo-700
      ring-indigo-100

      dark:bg-indigo-500/10
      dark:text-indigo-300
      dark:ring-indigo-500/20
    `,
    dot: `
      bg-indigo-500
      dark:bg-indigo-400
    `,
  },

  violet: {
    badge: `
      bg-violet-50
      text-violet-700
      ring-violet-100

      dark:bg-violet-500/10
      dark:text-violet-300
      dark:ring-violet-500/20
    `,
    dot: `
      bg-violet-500
      dark:bg-violet-400
    `,
  },

  amber: {
    badge: `
      bg-amber-50
      text-amber-700
      ring-amber-100

      dark:bg-amber-500/10
      dark:text-amber-300
      dark:ring-amber-500/20
    `,
    dot: `
      bg-amber-500
      dark:bg-amber-400
    `,
  },

  emerald: {
    badge: `
      bg-emerald-50
      text-emerald-700
      ring-emerald-100

      dark:bg-emerald-500/10
      dark:text-emerald-300
      dark:ring-emerald-500/20
    `,
    dot: `
      bg-emerald-500
      dark:bg-emerald-400
    `,
  },

  rose: {
    badge: `
      bg-rose-50
      text-rose-700
      ring-rose-100

      dark:bg-rose-500/10
      dark:text-rose-300
      dark:ring-rose-500/20
    `,
    dot: `
      bg-rose-500
      dark:bg-rose-400
    `,
  },
};

const SIZES: Record<
  NonNullable<LeadStatusBadgeProps['size']>,
  string
> = {
  small: `
    gap-1
    px-1.5
    py-0.5
    text-[10px]
  `,

  default: `
    gap-1.5
    px-2.5
    py-1
    text-xs
  `,
};

const LeadStatusBadge: React.FC<
  LeadStatusBadgeProps
> = ({
  label = '',
  tone = 'slate',
  icon = '',
  size = 'default',
  shape = 'pill',
  showDot = true,
  className = '',
}) => {
    const toneStyle = TONES[tone];

    const Icon = icon
      ? ICONS[icon]
      : undefined;

    if (!label) {
      return null;
    }

    return (
      <span
        className={`
        inline-flex
        max-w-full
        items-center

        font-semibold
        leading-none

        ring-1
        ring-inset

        ${shape === 'pill'
            ? 'rounded-full'
            : 'rounded-md'
          }

        ${SIZES[size]}
        ${toneStyle.badge}
        ${className}
      `}
      >
        {Icon ? (
          <Icon
            size={size === 'small' ? 10 : 12}
            strokeWidth={2}
            aria-hidden="true"
            className="shrink-0"
          />
        ) : showDot ? (
          <span
            aria-hidden="true"
            className={`
            h-1.5
            w-1.5
            shrink-0
            rounded-full

            ${toneStyle.dot}
          `}
          />
        ) : null}

        <span className="truncate">
          {label}
        </span>
      </span>
    );
  };

export default LeadStatusBadge;