import React from 'react';
import {
  Activity,
  Clock3,
} from 'lucide-react';

export interface ActivityTimelineProps {
  /**
   * Activity records rendered by the timeline.
   *
   * @type|json
   */
  items?: any[];

  /**
   * Optional timeline heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Optional supporting text.
   *
   * @translate
   */
  description?: string;

  /**
   * Whether the timeline header is displayed.
   */
  showHeader?: boolean;

  /**
   * Whether the total item count is displayed.
   */
  showCount?: boolean;

  /**
   * Maximum number of activities displayed.
   *
   * Set to 0 to display all activities.
   */
  limit?: number;

  /**
   * Text displayed when there are no activities.
   *
   * @translate
   */
  emptyText?: string;

  /**
   * Optional empty-state supporting text.
   *
   * @translate
   */
  emptyDescription?: string;

  /**
   * Visual spacing between repeated items.
   *
   * @select|compact|default|relaxed
   */
  spacing?:
    | 'compact'
    | 'default'
    | 'relaxed';

  /**
   * Node renderer called once for each activity.
   *
   * @nodeFunction
   */
  children?: (
    context: {
      item: any;
      index: number;
      isFirst: boolean;
      isLast: boolean;
    },
  ) => React.ReactNode;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const SPACING: Record<
  NonNullable<
    ActivityTimelineProps['spacing']
  >,
  string
> = {
  compact: 'space-y-0',
  default: 'space-y-1',
  relaxed: 'space-y-2',
};

const ActivityTimeline: React.FC<
  ActivityTimelineProps
> = ({
  items = [],
  title = 'Activity',
  description = '',
  showHeader = true,
  showCount = true,
  limit = 0,
  emptyText = 'No activity yet',
  emptyDescription =
    'Activity will appear here as this record is updated.',
  spacing = 'default',
  children,
  className = '',
}) => {
  const visibleItems =
    limit > 0
      ? items.slice(0, limit)
      : items;

  const totalCount =
    items.length;

  return (
    <section
      className={`
        min-w-0
        ${className}
      `}
    >
      {/* Header */}
      {showHeader && (
        <div
          className="
            mb-4

            flex
            min-w-0
            items-start
            justify-between
            gap-3
          "
        >
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
                items-center
                gap-2
              "
            >
              <h3
                className="
                  truncate

                  text-sm
                  font-semibold

                  text-slate-900

                  dark:text-slate-100
                "
              >
                {title}
              </h3>

              {showCount &&
                totalCount > 0 && (
                  <span
                    className="
                      inline-flex
                      min-w-5
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-slate-100

                      px-1.5
                      py-0.5

                      text-[10px]
                      font-semibold
                      tabular-nums

                      text-slate-500

                      dark:bg-slate-800
                      dark:text-slate-400
                    "
                  >
                    {totalCount}
                  </span>
                )}
            </div>

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
        </div>
      )}

      {/* Timeline */}
      {visibleItems.length >
      0 ? (
        <div
          className={`
            min-w-0
            ${SPACING[spacing]}
          `}
        >
          {visibleItems.map(
            (item, index) => {
              const isFirst =
                index === 0;

              const isLast =
                index ===
                visibleItems.length -
                  1;

              return (
                <div
                  key={
                    item?.id ??
                    index
                  }
                  className="
                    min-w-0
                  "
                >
                  {typeof children ===
                  'function'
                    ? children({
                        item,
                        index,
                        isFirst,
                        isLast,
                      })
                    : children}
                </div>
              );
            },
          )}
        </div>
      ) : (
        <div
          className="
            flex
            min-h-[180px]
            items-center
            justify-center

            rounded-2xl

            border
            border-dashed
            border-slate-200

            bg-slate-50/50

            px-6
            py-8

            text-center

            dark:border-slate-800
            dark:bg-slate-900/30
          "
        >
          <div
            className="
              max-w-[280px]
            "
          >
            <div
              className="
                mx-auto

                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                bg-white

                text-slate-400

                shadow-sm
                ring-1
                ring-slate-200

                dark:bg-slate-900
                dark:text-slate-500
                dark:ring-slate-800
              "
            >
              <Activity
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <p
              className="
                mt-3

                text-sm
                font-medium

                text-slate-600

                dark:text-slate-300
              "
            >
              {emptyText}
            </p>

            {emptyDescription && (
              <p
                className="
                  mt-1

                  text-xs
                  leading-5

                  text-slate-400

                  dark:text-slate-500
                "
              >
                {
                  emptyDescription
                }
              </p>
            )}
          </div>
        </div>
      )}

      {/* Limited results indicator */}
      {limit > 0 &&
        totalCount >
          visibleItems.length && (
          <div
            className="
              mt-3

              flex
              items-center
              gap-1.5

              text-[11px]
              text-slate-400

              dark:text-slate-500
            "
          >
            <Clock3
              size={12}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Showing{' '}
            {visibleItems.length} of{' '}
            {totalCount} activities
          </div>
        )}
    </section>
  );
};

export default ActivityTimeline;