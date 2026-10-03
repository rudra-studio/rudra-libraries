import React from 'react';
import {
  Activity,
  BadgeDollarSign,
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  Clock3,
  DollarSign,
  IndianRupee,
  Percent,
  Target,
  TrendingDown,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';

export interface MetricCardProps {
  /**
   * Metric label.
   * @translate
   */
  label?: string;

  /**
   * Main formatted value displayed by the card.
   *
   * Keep this as a string so the consuming application can
   * control formatting such as ₹18.4L, $24K, 68%, or 1.2K.
   */
  value?: string;

  /**
   * Optional supporting text below the metric.
   * @translate
   */
  description?: string;

  /**
   * Lucide icon name.
   * @icon
   */
  icon?: string;

  /**
   * Visual accent applied to the icon area.
   * @select|indigo|blue|emerald|amber|rose|violet|slate
   */
  accent?:
  | 'indigo'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'slate';

  /**
   * Optional trend direction.
   * @select|none|up|down|neutral
   */
  trend?: 'none' | 'up' | 'down' | 'neutral';

  /**
   * Formatted trend value.
   *
   * Examples: "12.5%", "₹1.2L", "8 leads".
   */
  trendValue?: string;

  /**
   * Context shown beside the trend value.
   * @translate
   */
  trendLabel?: string;

  /**
   * Visual card density.
   * @select|compact|default
   */
  size?: 'compact' | 'default';

  /**
   * Whether the card should behave as an interactive control.
   */
  clickable?: boolean;

  /**
   * Accessible label used when the card is clickable.
   */
  ariaLabel?: string;

  /**
   * Emits when the metric card is selected.
   */
  onClick?: () => void;

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
   *     "key": "Width",
   *     "prefix": "w",
   *     "type": "select",
   *     "options": [
   *       { "key": "full", "label": "Full Width" },
   *       { "key": "auto", "label": "Auto" }
   *     ]
   *   }
   * ]
   */
  className?: string;
}

const ICONS: Record<string, LucideIcon> = {
  Activity,
  BadgeDollarSign,
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  Clock3,
  DollarSign,
  IndianRupee,
  Percent,
  Target,
  TrendingDown,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
  WalletCards,
};

const ACCENT_STYLES: Record<
  NonNullable<MetricCardProps['accent']>,
  string
> = {
  indigo: `
    bg-indigo-50 text-indigo-600
    ring-indigo-100
    dark:bg-indigo-500/10
    dark:text-indigo-300
    dark:ring-indigo-500/20
  `,
  blue: `
    bg-blue-50 text-blue-600
    ring-blue-100
    dark:bg-blue-500/10
    dark:text-blue-300
    dark:ring-blue-500/20
  `,
  emerald: `
    bg-emerald-50 text-emerald-600
    ring-emerald-100
    dark:bg-emerald-500/10
    dark:text-emerald-300
    dark:ring-emerald-500/20
  `,
  amber: `
    bg-amber-50 text-amber-600
    ring-amber-100
    dark:bg-amber-500/10
    dark:text-amber-300
    dark:ring-amber-500/20
  `,
  rose: `
    bg-rose-50 text-rose-600
    ring-rose-100
    dark:bg-rose-500/10
    dark:text-rose-300
    dark:ring-rose-500/20
  `,
  violet: `
    bg-violet-50 text-violet-600
    ring-violet-100
    dark:bg-violet-500/10
    dark:text-violet-300
    dark:ring-violet-500/20
  `,
  slate: `
    bg-slate-100 text-slate-600
    ring-slate-200
    dark:bg-slate-800
    dark:text-slate-300
    dark:ring-slate-700
  `,
};

const TREND_STYLES: Record<
  NonNullable<MetricCardProps['trend']>,
  string
> = {
  none: '',
  up: `
    bg-emerald-50 text-emerald-700
    dark:bg-emerald-500/10
    dark:text-emerald-300
  `,
  down: `
    bg-rose-50 text-rose-700
    dark:bg-rose-500/10
    dark:text-rose-300
  `,
  neutral: `
    bg-slate-100 text-slate-600
    dark:bg-slate-800
    dark:text-slate-300
  `,
};

const MetricCard: React.FC<MetricCardProps> = ({
  label = '',
  value = '',
  description = '',
  icon = 'BarChart3',
  accent = 'indigo',
  trend = 'none',
  trendValue = '',
  trendLabel = '',
  size = 'default',
  clickable = false,
  ariaLabel,
  onClick,
  className = '',
}) => {
  const Icon = ICONS[icon] || BarChart3;

  const TrendIcon =
    trend === 'up'
      ? TrendingUp
      : trend === 'down'
        ? TrendingDown
        : null;

  const isCompact = size === 'compact';

  const cardClasses = `
    relative
    w-full
    overflow-hidden
    rounded-2xl
    border border-slate-200
    bg-white
    text-left
    shadow-sm
    shadow-slate-950/[0.025]

    transition-all duration-200

    dark:border-slate-800
    dark:bg-slate-950
    dark:shadow-black/10

    ${isCompact
      ? 'p-4'
      : 'p-5 sm:p-6'
    }

    ${clickable
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

          active:translate-y-0
        `
      : ''
    }

    ${className}
  `;

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {label && (
            <p
              className="
                truncate
                text-xs font-medium
                text-slate-500
                dark:text-slate-400

                sm:text-sm
              "
            >
              {label}
            </p>
          )}

          {value && (
            <p
              className={`
                mt-2
                truncate
                font-semibold
                tracking-[-0.035em]
                text-slate-950
                dark:text-white

                ${isCompact
                  ? 'text-2xl'
                  : 'text-2xl sm:text-[28px]'
                }
              `}
            >
              {value}
            </p>
          )}
        </div>

        <span
          className={`
            flex shrink-0
            items-center justify-center
            rounded-xl
            ring-1 ring-inset

            ${isCompact
              ? 'h-9 w-9'
              : 'h-10 w-10 sm:h-11 sm:w-11'
            }

            ${ACCENT_STYLES[accent]}
          `}
        >
          <Icon
            size={isCompact ? 18 : 20}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>
      </div>

      {(trend !== 'none' ||
        description ||
        trendLabel) && (
          <div
            className="
            mt-4 flex
            min-w-0
            flex-wrap
            items-center
            gap-x-2 gap-y-1.5
          "
          >
            {trend !== 'none' &&
              trendValue && (
                <span
                  className={`
                  inline-flex
                  shrink-0
                  items-center gap-1
                  rounded-full
                  px-2 py-1
                  text-[11px]
                  font-semibold

                  ${TREND_STYLES[trend]}
                `}
                >
                  {TrendIcon && (
                    <TrendIcon
                      size={12}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}

                  {trendValue}
                </span>
              )}

            {trendLabel && (
              <span
                className="
                min-w-0
                text-xs
                text-slate-400
                dark:text-slate-500
              "
              >
                {trendLabel}
              </span>
            )}

            {description && (
              <span
                className="
                min-w-0
                text-xs
                text-slate-500
                dark:text-slate-400
              "
              >
                {description}
              </span>
            )}
          </div>
        )}
    </>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={
          ariaLabel ||
          (label
            ? `View ${label}`
            : 'View metric')
        }
        className={cardClasses}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  );
};

export default MetricCard;