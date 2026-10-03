import React from 'react';
import {
  Check,
  ChevronDown,
  Filter,
  RotateCcw,
  X,
} from 'lucide-react';

export interface LeadFilterOption {
  label: string;
  value: string;
}

export interface LeadFilterDefinition {
  id: string;
  label: string;
  placeholder?: string;
  options: LeadFilterOption[];
}

export interface LeadFiltersProps {
  /**
   * Filter definitions rendered by the component.
   *
   * @type|complex
   * @schema {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "id": { "type": "string" },
   *       "label": { "type": "string" },
   *       "placeholder": { "type": "string" },
   *       "options": {
   *         "type": "array",
   *         "items": {
   *           "type": "object",
   *           "properties": {
   *             "label": { "type": "string" },
   *             "value": { "type": "string" }
   *           },
   *           "required": ["label", "value"]
   *         }
   *       }
   *     },
   *     "required": ["id", "label", "options"]
   *   }
   * }
   */
  filters?: LeadFilterDefinition[];

  /**
   * Current filter values.
   *
   * Keys correspond to filter IDs.
   *
   * Example:
   * {
   *   "stage": "proposal",
   *   "owner": "user-siva"
   * }
   *
   * @type|json
   */
  values?: Record<string, string>;

  /**
   * Label shown on the filter trigger.
   *
   * @translate
   */
  label?: string;

  /**
   * Label for clearing all filters.
   *
   * @translate
   */
  clearLabel?: string;

  /**
   * Whether the main filter icon is displayed.
   */
  showIcon?: boolean;

  /**
   * Whether active filter chips are displayed.
   */
  showActiveFilters?: boolean;

  /**
   * Whether the clear-all action is displayed.
   */
  showClear?: boolean;

  /**
   * Visual density.
   *
   * @select|compact|default
   */
  size?: 'compact' | 'default';

  /**
   * Whether the filter controls are disabled.
   */
  disabled?: boolean;

  /**
   * Emits the filter ID and newly selected value.
   */
  onFilterChange?: (
    filterId: string,
    value: string,
  ) => void;

  /**
   * Emits the filter ID when one filter is cleared.
   */
  onFilterClear?: (
    filterId: string,
  ) => void;

  /**
   * Called when all filters are cleared.
   */
  onClearAll?: () => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const LeadFilters: React.FC<
  LeadFiltersProps
> = ({
  filters = [],
  values = {},
  label = 'Filters',
  clearLabel = 'Clear all',
  showIcon = true,
  showActiveFilters = true,
  showClear = true,
  size = 'default',
  disabled = false,
  onFilterChange,
  onFilterClear,
  onClearAll,
  className = '',
}) => {
  const activeFilters =
    filters.filter((filter) => {
      const value =
        values[filter.id];

      return Boolean(value);
    });

  const getSelectedOption = (
    filter: LeadFilterDefinition,
  ) => {
    const value =
      values[filter.id];

    return filter.options.find(
      (option) =>
        option.value === value,
    );
  };

  const handleChange = (
    filterId: string,
    value: string,
  ) => {
    if (disabled) return;

    onFilterChange?.(
      filterId,
      value,
    );
  };

  const handleClear = (
    filterId: string,
  ) => {
    if (disabled) return;

    /*
     * Emit an empty value as well so a simple
     * Rudra value binding can immediately clear.
     */
    onFilterChange?.(
      filterId,
      '',
    );

    onFilterClear?.(
      filterId,
    );
  };

  const handleClearAll = () => {
    if (disabled) return;

    /*
     * Clear each bound filter value individually.
     * onClearAll remains available for any
     * additional application-level action.
     */
    activeFilters.forEach(
      (filter) => {
        onFilterChange?.(
          filter.id,
          '',
        );
      },
    );

    onClearAll?.();
  };

  const controlHeight =
    size === 'compact'
      ? 'h-9'
      : 'h-10';

  const controlText =
    size === 'compact'
      ? 'text-xs'
      : 'text-sm';

  return (
    <div
      className={`
        min-w-0
        ${className}
      `}
    >
      {/* Controls */}
      <div
        className="
          flex
          min-w-0
          flex-wrap
          items-center
          gap-2
        "
      >
        {/* Label */}
        {(showIcon || label) && (
          <div
            className="
              mr-1
              flex
              shrink-0
              items-center
              gap-1.5

              text-xs
              font-medium
              text-slate-500

              dark:text-slate-400
            "
          >
            {showIcon && (
              <Filter
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}

            {label && (
              <span>
                {label}
              </span>
            )}
          </div>
        )}

        {/* Filter selects */}
        {filters.map((filter) => {
          const selected =
            getSelectedOption(
              filter,
            );

          return (
            <div
              key={filter.id}
              className="
                relative
                min-w-[130px]
                max-w-full
              "
            >
              <select
                value={
                  values[
                    filter.id
                  ] ?? ''
                }
                disabled={disabled}
                aria-label={
                  filter.label
                }
                onChange={(
                  event,
                ) =>
                  handleChange(
                    filter.id,
                    event.target
                      .value,
                  )
                }
                className={`
                  block
                  w-full

                  appearance-none

                  rounded-xl

                  border
                  border-slate-200

                  bg-white

                  pl-3
                  pr-9

                  font-medium
                  text-slate-600

                  outline-none

                  transition-[border-color,box-shadow,background-color]

                  hover:border-slate-300

                  focus:border-indigo-400
                  focus:ring-4
                  focus:ring-indigo-500/10

                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                  disabled:opacity-60

                  dark:border-slate-800
                  dark:bg-slate-950
                  dark:text-slate-300

                  dark:hover:border-slate-700

                  dark:focus:border-indigo-500
                  dark:focus:ring-indigo-500/10

                  dark:disabled:bg-slate-900

                  ${controlHeight}
                  ${controlText}

                  ${
                    selected
                      ? `
                        border-indigo-200
                        bg-indigo-50/50
                        text-indigo-700

                        dark:border-indigo-500/30
                        dark:bg-indigo-500/5
                        dark:text-indigo-300
                      `
                      : ''
                  }
                `}
              >
                <option value="">
                  {filter.placeholder ||
                    filter.label}
                </option>

                {filter.options.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  ),
                )}
              </select>

              <ChevronDown
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute
                  right-3
                  top-1/2

                  -translate-y-1/2

                  text-slate-400

                  dark:text-slate-500
                "
              />
            </div>
          );
        })}

        {/* Clear all */}
        {showClear &&
          activeFilters.length >
            0 && (
            <button
              type="button"
              disabled={disabled}
              onClick={
                handleClearAll
              }
              className={`
                inline-flex
                shrink-0
                items-center
                gap-1.5

                rounded-lg

                px-2.5

                font-medium
                text-slate-500

                transition-colors

                hover:bg-slate-100
                hover:text-slate-800

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:text-slate-400
                dark:hover:bg-slate-800
                dark:hover:text-slate-200

                ${controlHeight}
                ${
                  size ===
                  'compact'
                    ? 'text-[11px]'
                    : 'text-xs'
                }
              `}
            >
              <RotateCcw
                size={13}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {clearLabel}
            </button>
          )}
      </div>

      {/* Active filters */}
      {showActiveFilters &&
        activeFilters.length >
          0 && (
          <div
            className="
              mt-2.5
              flex
              min-w-0
              flex-wrap
              items-center
              gap-1.5
            "
          >
            {activeFilters.map(
              (filter) => {
                const selected =
                  getSelectedOption(
                    filter,
                  );

                if (!selected) {
                  return null;
                }

                return (
                  <span
                    key={
                      filter.id
                    }
                    className="
                      inline-flex
                      max-w-full
                      items-center
                      gap-1.5

                      rounded-full

                      border
                      border-indigo-100

                      bg-indigo-50

                      py-1
                      pl-2.5
                      pr-1

                      text-[11px]
                      font-medium
                      text-indigo-700

                      dark:border-indigo-500/20
                      dark:bg-indigo-500/10
                      dark:text-indigo-300
                    "
                  >
                    <span
                      className="
                        max-w-[180px]
                        truncate
                      "
                    >
                      <span
                        className="
                          opacity-60
                        "
                      >
                        {filter.label}:
                      </span>{' '}

                      {
                        selected.label
                      }
                    </span>

                    <button
                      type="button"
                      disabled={
                        disabled
                      }
                      aria-label={`Clear ${filter.label} filter`}
                      onClick={() =>
                        handleClear(
                          filter.id,
                        )
                      }
                      className="
                        flex h-5 w-5
                        shrink-0
                        items-center
                        justify-center

                        rounded-full

                        transition-colors

                        hover:bg-indigo-100

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        dark:hover:bg-indigo-500/20
                      "
                    >
                      <X
                        size={11}
                        strokeWidth={
                          2
                        }
                        aria-hidden="true"
                      />
                    </button>
                  </span>
                );
              },
            )}
          </div>
        )}

      {/* Screen-reader active count */}
      <span className="sr-only">
        {activeFilters.length}{' '}
        active filters
      </span>
    </div>
  );
};

export default LeadFilters;