import React, { useMemo, useState } from "react";
import styles from "./styles.module.scss";

export type RepeaterTableThemeMode = "light" | "dark";

export interface RepeaterTableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  template?: (ctx: { row: T; value: unknown; rowIndex: number }) => React.ReactNode;
}

export interface RepeaterTableProps<T = Record<string, unknown>>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: RepeaterTableThemeMode;

  /**
   * Row records to render.
   */
  data?: T[];

  /**
   * Column definitions.
   */
  columns?: RepeaterTableColumn<T>[];

  /**
   * Optional expandable row detail renderer.
   */
  expandedContent?: (ctx: { row: T; rowIndex: number }) => React.ReactNode;

  /**
   * Rows per page.
   */
  pageSize?: number;

  /**
   * Enable global search input.
   *
   * @schema {"type":"boolean"}
   */
  searchable?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_COLUMNS: RepeaterTableColumn<Record<string, unknown>>[] = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
  { key: "status", header: "Status" },
];

const DEFAULT_ROWS: Record<string, unknown>[] = [
  { name: "Aarav", role: "Frontend", status: "Active" },
  { name: "Meera", role: "Backend", status: "Active" },
  { name: "Karthik", role: "Design", status: "Review" },
];

export default function RepeaterTable<T = Record<string, unknown>>({
  themeMode = "light",
  data = DEFAULT_ROWS as unknown as T[],
  columns = DEFAULT_COLUMNS as unknown as RepeaterTableColumn<T>[],
  expandedContent,
  pageSize = 5,
  searchable = true,
  className = "w-full",
  ...props
}: RepeaterTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const filteredData = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return data;
    return data.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(trimmed)
    );
  }, [data, query]);

  const safePageSize = Math.max(1, Math.floor(pageSize) || 5);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / safePageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = filteredData.slice(
    currentPage * safePageSize,
    currentPage * safePageSize + safePageSize
  );

  const toggleExpand = (idx: number) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      {searchable && (
        <div className={styles.toolbar}>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search rows..."
            aria-label="Search rows"
            className={styles.searchInput}
          />
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {expandedContent && <th className={styles.th} />}
              {columns.map((col) => (
                <th key={col.key} className={styles.th}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length > 0 ? (
              pageRows.map((row, rIdx) => {
                const absIdx = currentPage * safePageSize + rIdx;
                const isExpanded = Boolean(expandedRows[absIdx]);
                const record = row as Record<string, unknown>;

                return (
                  <React.Fragment key={absIdx}>
                    <tr className={styles.tr}>
                      {expandedContent && (
                        <td className={styles.td}>
                          <button
                            type="button"
                            onClick={() => toggleExpand(absIdx)}
                            className={styles.expandBtn}
                          >
                            {isExpanded ? "−" : "+"}
                          </button>
                        </td>
                      )}
                      {columns.map((col) => {
                        const val = record?.[col.key];
                        return (
                          <td key={col.key} className={styles.td}>
                            {col.template
                              ? col.template({ row, value: val, rowIndex: absIdx })
                              : String(val ?? "")}
                          </td>
                        );
                      })}
                    </tr>
                    {expandedContent && isExpanded && (
                      <tr className={styles.expandedTr}>
                        <td
                          colSpan={columns.length + 1}
                          className={styles.expandedTd}
                        >
                          {expandedContent({ row, rowIndex: absIdx })}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (expandedContent ? 1 : 0)}
                  className={styles.emptyTd}
                >
                  No matching records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
