import React from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  UserRound,
} from 'lucide-react';

export interface LeadTableColumn {
  id: string;
  label: string;
  field: string;
  type?:
    | 'text'
    | 'status'
    | 'owner'
    | 'value'
    | 'date';
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface LeadTableItem {
  id: string;
  [key: string]: any;
}

export interface LeadTableProps {
  /**
   * Column definitions.
   *
   * @type|complex
   * @schema {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "id": { "type": "string" },
   *       "label": { "type": "string" },
   *       "field": { "type": "string" },
   *       "type": {
   *         "type": "string",
   *         "enum": ["text", "status", "owner", "value", "date"]
   *       },
   *       "width": { "type": "string" },
   *       "align": {
   *         "type": "string",
   *         "enum": ["left", "center", "right"]
   *       },
   *       "sortable": { "type": "boolean" }
   *     },
   *     "required": ["id", "label", "field"]
   *   }
   * }
   */
  columns?: LeadTableColumn[];

  /**
   * Table records.
   *
   * Every item should contain a stable id.
   *
   * @type|json
   */
  items?: LeadTableItem[];

  /**
   * Currently selected row IDs.
   *
   * @type|json
   */
  selectedIds?: string[];

  /**
   * Current sorting column.
   */
  sortBy?: string;

  /**
   * Current sorting direction.
   *
   * @select|asc|desc
   */
  sortDirection?: 'asc' | 'desc';

  /**
   * Whether row selection checkboxes are displayed.
   */
  selectable?: boolean;

  /**
   * Whether the final row actions column is displayed.
   */
  showRowActions?: boolean;

  /**
   * Whether rows can be opened.
   */
  clickableRows?: boolean;

  /**
   * Text displayed when there are no records.
   *
   * @translate
   */
  emptyText?: string;

  /**
   * Accessible table label.
   */
  ariaLabel?: string;

  /**
   * Emits the selected row ID.
   */
  onRowClick?: (leadId: string) => void;

  /**
   * Emits row ID and selected state.
   */
  onSelectionChange?: (
    leadId: string,
    selected: boolean,
  ) => void;

  /**
   * Emits whether all visible rows should be selected.
   */
  onSelectAllChange?: (
    selected: boolean,
  ) => void;

  /**
   * Emits the column ID and requested sort direction.
   */
  onSortChange?: (
    columnId: string,
    direction: 'asc' | 'desc',
  ) => void;

  /**
   * Emits the selected row ID.
   */
  onRowMenuClick?: (
    leadId: string,
  ) => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const STATUS_STYLES: Record<
  string,
  string
> = {
  new: `
    bg-slate-100 text-slate-600
    dark:bg-slate-800 dark:text-slate-300
  `,
  qualified: `
    bg-blue-50 text-blue-700
    dark:bg-blue-500/10 dark:text-blue-300
  `,
  proposal: `
    bg-violet-50 text-violet-700
    dark:bg-violet-500/10 dark:text-violet-300
  `,
  negotiation: `
    bg-amber-50 text-amber-700
    dark:bg-amber-500/10 dark:text-amber-300
  `,
  won: `
    bg-emerald-50 text-emerald-700
    dark:bg-emerald-500/10 dark:text-emerald-300
  `,
  lost: `
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

const getAlignClass = (
  align: LeadTableColumn['align'],
) => {
  switch (align) {
    case 'center':
      return 'text-center';

    case 'right':
      return 'text-right';

    default:
      return 'text-left';
  }
};

const LeadTable: React.FC<
  LeadTableProps
> = ({
  columns = [],
  items = [],
  selectedIds = [],
  sortBy = '',
  sortDirection = 'asc',
  selectable = false,
  showRowActions = true,
  clickableRows = true,
  emptyText = 'No leads found',
  ariaLabel = 'Leads',
  onRowClick,
  onSelectionChange,
  onSelectAllChange,
  onSortChange,
  onRowMenuClick,
  className = '',
}) => {
  const selectedSet =
    new Set(selectedIds);

  const allSelected =
    items.length > 0 &&
    items.every((item) =>
      selectedSet.has(item.id),
    );

  const partiallySelected =
    items.some((item) =>
      selectedSet.has(item.id),
    ) && !allSelected;

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    itemId: string,
  ) => {
    if (!clickableRows) return;

    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      onRowClick?.(itemId);
    }
  };

  const handleSort = (
    column: LeadTableColumn,
  ) => {
    if (!column.sortable) return;

    const direction =
      sortBy === column.id
        ? sortDirection === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc';

    onSortChange?.(
      column.id,
      direction,
    );
  };

  const renderCell = (
    item: LeadTableItem,
    column: LeadTableColumn,
  ) => {
    const rawValue =
      item[column.field];

    if (
      rawValue === undefined ||
      rawValue === null ||
      rawValue === ''
    ) {
      return (
        <span
          className="
            text-slate-300
            dark:text-slate-700
          "
        >
          —
        </span>
      );
    }

    switch (column.type) {
      case 'status': {
        /*
         * Supports either:
         *
         * status: "Proposal"
         *
         * or:
         *
         * status: {
         *   label: "Proposal",
         *   tone: "proposal"
         * }
         */
        const label =
          typeof rawValue === 'object'
            ? rawValue.label
            : String(rawValue);

        const tone =
          typeof rawValue === 'object'
            ? rawValue.tone
            : String(rawValue)
                .toLowerCase()
                .replace(/\s+/g, '-');

        return (
          <span
            className={`
              inline-flex
              max-w-full
              items-center
              gap-1.5

              rounded-full

              px-2
              py-1

              text-[10px]
              font-semibold

              ${
                STATUS_STYLES[tone] ??
                STATUS_STYLES.new
              }
            `}
          >
            <span
              aria-hidden="true"
              className="
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-current
                opacity-70
              "
            />

            <span className="truncate">
              {label}
            </span>
          </span>
        );
      }

      case 'owner': {
        /*
         * Expected value:
         *
         * {
         *   id: "...",
         *   name: "...",
         *   avatarUrl: "...",
         *   initials: "..."
         * }
         */
        const owner =
          typeof rawValue === 'object'
            ? rawValue
            : {
                name: String(
                  rawValue,
                ),
              };

        const initials =
          owner.initials ||
          getInitials(
            owner.name,
          );

        return (
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            <span
              className="
                flex
                h-7 w-7
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
              {owner.avatarUrl ? (
                <img
                  src={
                    owner.avatarUrl
                  }
                  alt=""
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : initials ? (
                initials
              ) : (
                <UserRound
                  size={13}
                  strokeWidth={
                    1.8
                  }
                  aria-hidden="true"
                />
              )}
            </span>

            <span
              className="
                max-w-[150px]
                truncate

                text-xs
                font-medium
                text-slate-600

                dark:text-slate-300
              "
            >
              {owner.name}
            </span>
          </div>
        );
      }

      case 'value':
        return (
          <span
            className="
              whitespace-nowrap

              text-sm
              font-semibold
              text-slate-800

              dark:text-slate-200
            "
          >
            {String(rawValue)}
          </span>
        );

      case 'date':
        return (
          <span
            className="
              whitespace-nowrap

              text-xs
              text-slate-500

              dark:text-slate-400
            "
          >
            {String(rawValue)}
          </span>
        );

      case 'text':
      default:
        return (
          <span
            className="
              block
              max-w-[240px]
              truncate

              text-sm
              text-slate-600

              dark:text-slate-300
            "
          >
            {String(rawValue)}
          </span>
        );
    }
  };

  return (
    <div
      className={`
        min-w-0
        overflow-hidden

        rounded-2xl

        border
        border-slate-200

        bg-white

        shadow-sm
        shadow-slate-950/[0.025]

        dark:border-slate-800
        dark:bg-slate-950
        dark:shadow-black/10

        ${className}
      `}
    >
      <div
        className="
          w-full
          overflow-x-auto

          [scrollbar-width:thin]
        "
      >
        <table
          aria-label={ariaLabel}
          className="
            w-full
            min-w-[720px]

            border-collapse
          "
        >
          {/* Header */}
          <thead>
            <tr
              className="
                border-b
                border-slate-200

                bg-slate-50/80

                dark:border-slate-800
                dark:bg-slate-900/60
              "
            >
              {selectable && (
                <th
                  scope="col"
                  className="
                    w-12
                    px-4
                    py-3
                    text-left
                  "
                >
                  <input
                    type="checkbox"
                    checked={
                      allSelected
                    }
                    ref={(element) => {
                      if (
                        element
                      ) {
                        element.indeterminate =
                          partiallySelected;
                      }
                    }}
                    aria-label="Select all visible leads"
                    onChange={(
                      event,
                    ) =>
                      onSelectAllChange?.(
                        event.target
                          .checked,
                      )
                    }
                    className="
                      h-4
                      w-4

                      rounded

                      border-slate-300

                      accent-indigo-600

                      dark:border-slate-700
                      dark:bg-slate-900
                    "
                  />
                </th>
              )}

              {columns.map(
                (column) => {
                  const isSorted =
                    sortBy ===
                    column.id;

                  const SortIcon =
                    !isSorted
                      ? ArrowUpDown
                      : sortDirection ===
                          'asc'
                        ? ArrowUp
                        : ArrowDown;

                  return (
                    <th
                      key={
                        column.id
                      }
                      scope="col"
                      style={{
                        width:
                          column.width,
                      }}
                      className={`
                        whitespace-nowrap

                        px-4
                        py-3

                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.07em]

                        text-slate-400

                        dark:text-slate-500

                        ${getAlignClass(
                          column.align,
                        )}
                      `}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleSort(
                              column,
                            )
                          }
                          className={`
                            inline-flex
                            items-center
                            gap-1.5

                            rounded-md

                            transition-colors

                            hover:text-slate-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            dark:hover:text-slate-200

                            ${
                              isSorted
                                ? `
                                  text-indigo-600
                                  dark:text-indigo-300
                                `
                                : ''
                            }
                          `}
                        >
                          {
                            column.label
                          }

                          <SortIcon
                            size={12}
                            strokeWidth={
                              1.8
                            }
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  );
                },
              )}

              {showRowActions && (
                <th
                  scope="col"
                  className="
                    w-12
                    px-3
                    py-3
                  "
                >
                  <span className="sr-only">
                    Actions
                  </span>
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody
            className="
              divide-y
              divide-slate-100

              dark:divide-slate-900
            "
          >
            {items.map((item) => {
              const selected =
                selectedSet.has(
                  item.id,
                );

              return (
                <tr
                  key={item.id}
                  tabIndex={
                    clickableRows
                      ? 0
                      : undefined
                  }
                  aria-selected={
                    selectable
                      ? selected
                      : undefined
                  }
                  onClick={() => {
                    if (
                      clickableRows
                    ) {
                      onRowClick?.(
                        item.id,
                      );
                    }
                  }}
                  onKeyDown={(
                    event,
                  ) =>
                    handleRowKeyDown(
                      event,
                      item.id,
                    )
                  }
                  className={`
                    group

                    transition-colors

                    ${
                      clickableRows
                        ? `
                          cursor-pointer

                          hover:bg-slate-50

                          focus-visible:outline-none
                          focus-visible:bg-indigo-50/50

                          dark:hover:bg-slate-900/60
                          dark:focus-visible:bg-indigo-500/5
                        `
                        : ''
                    }

                    ${
                      selected
                        ? `
                          bg-indigo-50/40
                          dark:bg-indigo-500/5
                        `
                        : ''
                    }
                  `}
                >
                  {selectable && (
                    <td
                      className="
                        px-4
                        py-3.5
                      "
                      onClick={(
                        event,
                      ) =>
                        event.stopPropagation()
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          selected
                        }
                        aria-label={`Select ${
                          item.name ??
                          'lead'
                        }`}
                        onChange={(
                          event,
                        ) =>
                          onSelectionChange?.(
                            item.id,
                            event
                              .target
                              .checked,
                          )
                        }
                        className="
                          h-4
                          w-4

                          rounded

                          border-slate-300

                          accent-indigo-600

                          dark:border-slate-700
                          dark:bg-slate-900
                        "
                      />
                    </td>
                  )}

                  {columns.map(
                    (column) => (
                      <td
                        key={
                          column.id
                        }
                        className={`
                          px-4
                          py-3.5

                          ${getAlignClass(
                            column.align,
                          )}
                        `}
                      >
                        {renderCell(
                          item,
                          column,
                        )}
                      </td>
                    ),
                  )}

                  {showRowActions && (
                    <td
                      className="
                        px-3
                        py-3.5
                        text-right
                      "
                    >
                      <button
                        type="button"
                        aria-label={`More options for ${
                          item.name ??
                          'lead'
                        }`}
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();

                          onRowMenuClick?.(
                            item.id,
                          );
                        }}
                        className="
                          inline-flex
                          h-8
                          w-8

                          items-center
                          justify-center

                          rounded-lg

                          text-slate-400

                          opacity-70

                          transition-colors

                          hover:bg-slate-100
                          hover:text-slate-700

                          focus-visible:opacity-100
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-indigo-500

                          group-hover:opacity-100

                          dark:text-slate-500
                          dark:hover:bg-slate-800
                          dark:hover:text-slate-200
                        "
                      >
                        <MoreHorizontal
                          size={17}
                          strokeWidth={
                            1.8
                          }
                          aria-hidden="true"
                        />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div
          className="
            flex
            min-h-[220px]
            items-center
            justify-center

            px-6
            py-10

            text-center
          "
        >
          <div>
            <div
              className="
                mx-auto

                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                bg-slate-100

                text-slate-400

                dark:bg-slate-900
                dark:text-slate-500
              "
            >
              <UserRound
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
                text-slate-500

                dark:text-slate-400
              "
            >
              {emptyText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTable;