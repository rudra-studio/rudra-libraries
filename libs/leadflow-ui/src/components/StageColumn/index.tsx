import React from 'react';
import {
  Circle,
  MoreHorizontal,
  Plus,
} from 'lucide-react';

export interface StageColumnProps {
  /**
   * Unique stage/column identifier.
   */
  id?: string;

  /**
   * Column title.
   * @translate
   */
  title?: string;

  /**
   * Records rendered inside the column.
   * @type|json
   */
  items?: any[];

  /**
   * Optional count override.
   *
   * When omitted, items.length is used.
   */
  count?: number;

  /**
   * Optional formatted total displayed in the header.
   *
   * Example: "₹4.8L"
   */
  totalValue?: string;

  /**
   * Column accent.
   * @select|slate|blue|indigo|violet|amber|emerald|rose
   */
  accent?:
    | 'slate'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'amber'
    | 'emerald'
    | 'rose';

  /**
   * Whether the add button is displayed.
   */
  showAddAction?: boolean;

  /**
   * Whether the options button is displayed.
   */
  showMenu?: boolean;

  /**
   * Text displayed when the column has no records.
   * @translate
   */
  emptyText?: string;

  /**
   * Repeated content renderer.
   *
   * Rudra receives the current item and index
   * for every record in items.
   *
   * @nodeFunction
   */
  children?: (
    context: {
      item: any;
      index: number;
    }
  ) => React.ReactNode;

  /**
   * Emits this stage ID when Add is selected.
   */
  onAddClick?: (stageId: string) => void;

  /**
   * Emits this stage ID when the menu is selected.
   */
  onMenuClick?: (stageId: string) => void;

  /**
   * Utility classes exposed to Rudra.
   * @type|class
   */
  className?: string;
}

const ACCENTS: Record<
  NonNullable<StageColumnProps['accent']>,
  {
    dot: string;
    count: string;
  }
> = {
  slate: {
    dot: 'text-slate-400 dark:text-slate-500',
    count: `
      bg-slate-100 text-slate-600
      dark:bg-slate-800 dark:text-slate-300
    `,
  },

  blue: {
    dot: 'text-blue-500 dark:text-blue-400',
    count: `
      bg-blue-50 text-blue-700
      dark:bg-blue-500/10 dark:text-blue-300
    `,
  },

  indigo: {
    dot: 'text-indigo-500 dark:text-indigo-400',
    count: `
      bg-indigo-50 text-indigo-700
      dark:bg-indigo-500/10 dark:text-indigo-300
    `,
  },

  violet: {
    dot: 'text-violet-500 dark:text-violet-400',
    count: `
      bg-violet-50 text-violet-700
      dark:bg-violet-500/10 dark:text-violet-300
    `,
  },

  amber: {
    dot: 'text-amber-500 dark:text-amber-400',
    count: `
      bg-amber-50 text-amber-700
      dark:bg-amber-500/10 dark:text-amber-300
    `,
  },

  emerald: {
    dot: 'text-emerald-500 dark:text-emerald-400',
    count: `
      bg-emerald-50 text-emerald-700
      dark:bg-emerald-500/10 dark:text-emerald-300
    `,
  },

  rose: {
    dot: 'text-rose-500 dark:text-rose-400',
    count: `
      bg-rose-50 text-rose-700
      dark:bg-rose-500/10 dark:text-rose-300
    `,
  },
};

const StageColumn: React.FC<StageColumnProps> = ({
  id = '',
  title = '',
  items = [],
  count,
  totalValue = '',
  accent = 'slate',
  showAddAction = true,
  showMenu = true,
  emptyText = 'No items',
  children,
  onAddClick,
  onMenuClick,
  className = '',
}) => {
  const styles = ACCENTS[accent];

  const displayCount =
    count ?? items.length;

  return (
    <section
      aria-label={title || 'Stage'}
      className={`
        flex
        min-h-0
        min-w-[280px]
        flex-col

        rounded-2xl

        border border-slate-200
        bg-slate-50/70

        dark:border-slate-800
        dark:bg-slate-900/40

        sm:min-w-[300px]

        ${className}
      `}
    >
      {/* Header */}
      <div
        className="
          flex
          shrink-0
          items-center
          gap-2

          border-b
          border-slate-200/80

          px-3.5
          py-3

          dark:border-slate-800
        "
      >
        <Circle
          size={9}
          fill="currentColor"
          strokeWidth={0}
          aria-hidden="true"
          className={`
            shrink-0
            ${styles.dot}
          `}
        />

        <h2
          className="
            min-w-0
            flex-1
            truncate

            text-xs
            font-semibold
            text-slate-700

            dark:text-slate-200
          "
        >
          {title}
        </h2>

        <span
          aria-label={`${displayCount} items`}
          className={`
            inline-flex
            min-w-6
            shrink-0
            items-center
            justify-center

            rounded-full

            px-1.5
            py-0.5

            text-[10px]
            font-semibold

            ${styles.count}
          `}
        >
          {displayCount}
        </span>

        {showAddAction && (
          <button
            type="button"
            aria-label={`Add to ${title || 'stage'}`}
            onClick={() =>
              onAddClick?.(id)
            }
            className="
              flex h-7 w-7
              shrink-0
              items-center
              justify-center

              rounded-lg

              text-slate-400

              transition-colors

              hover:bg-white
              hover:text-indigo-600

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500

              dark:text-slate-500
              dark:hover:bg-slate-800
              dark:hover:text-indigo-300
            "
          >
            <Plus
              size={15}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        )}

        {showMenu && (
          <button
            type="button"
            aria-label={`More options for ${
              title || 'stage'
            }`}
            onClick={() =>
              onMenuClick?.(id)
            }
            className="
              flex h-7 w-7
              shrink-0
              items-center
              justify-center

              rounded-lg

              text-slate-400

              transition-colors

              hover:bg-white
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

      {/* Stage summary */}
      {totalValue && (
        <div
          className="
            shrink-0

            px-4
            pb-1
            pt-3
          "
        >
          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.08em]

              text-slate-400

              dark:text-slate-500
            "
          >
            Total
          </span>

          <div
            className="
              mt-0.5

              text-sm
              font-semibold
              tracking-[-0.02em]

              text-slate-700

              dark:text-slate-200
            "
          >
            {totalValue}
          </div>
        </div>
      )}

      {/* Repeated content */}
      <div
        className="
          min-h-[120px]
          flex-1

          overflow-y-auto
          overflow-x-hidden

          p-2.5

          [scrollbar-width:thin]
        "
      >
        {items.length > 0 ? (
          <div
            className="
              flex
              flex-col
              gap-2.5
            "
          >
            {items.map(
              (item, index) => (
                <React.Fragment
                  key={
                    item?.id ??
                    index
                  }
                >
                  {typeof children ===
                  'function'
                    ? children({
                        item,
                        index,
                      })
                    : null}
                </React.Fragment>
              ),
            )}
          </div>
        ) : (
          <div
            className="
              flex
              min-h-[110px]
              items-center
              justify-center

              rounded-xl

              border
              border-dashed
              border-slate-200

              bg-white/60

              px-4

              text-center
              text-xs
              text-slate-400

              dark:border-slate-800
              dark:bg-slate-950/30
              dark:text-slate-500
            "
          >
            {emptyText}
          </div>
        )}
      </div>
    </section>
  );
};

export default StageColumn;