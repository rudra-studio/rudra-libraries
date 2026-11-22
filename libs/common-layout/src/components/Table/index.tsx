import React, { useMemo, useState } from "react";
import styles from "./styles.module.scss";

export type TableThemeMode = "light" | "dark";
export type TableMode = "pagination" | "infinite";

export interface TableColumnDef {
  accessorKey: string;
  header: string;
}

export interface TableProps<T = Record<string, unknown>>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: TableThemeMode;

  /**
   * Table data rows.
   */
  data?: T[];

  /**
   * Column definitions.
   */
  columns?: TableColumnDef[];

  /**
   * Pagination or infinite scroll mode.
   *
   * @select|pagination|infinite
   */
  mode?: TableMode;

  /**
   * Page size in pagination mode.
   */
  pageSize?: number;

  /**
   * Callback invoked in infinite mode when loading more rows.
   */
  onLoadMore?: () => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_COLS: TableColumnDef[] = [
  { accessorKey: "project", header: "Project" },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "progress", header: "Progress" },
];

const DEFAULT_DATA: Record<string, unknown>[] = [
  { project: "Rudra Canvas", owner: "Siva", progress: "85%" },
  { project: "Lumora App", owner: "Team", progress: "100%" },
  { project: "Layout Lib", owner: "Siva", progress: "60%" },
];

export default function Table<T = Record<string, unknown>>({
  themeMode = "light",
  data = DEFAULT_DATA as unknown as T[],
  columns = DEFAULT_COLS,
  mode = "pagination",
  pageSize = 5,
  onLoadMore,
  className = "w-full",
  ...props
}: TableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const processedData = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? data.filter((row) =>
          JSON.stringify(row).toLowerCase().includes(q)
        )
      : [...data];

    if (sortKey) {
      filtered.sort((a, b) => {
        const av = String((a as Record<string, unknown>)?.[sortKey] ?? "");
        const bv = String((b as Record<string, unknown>)?.[sortKey] ?? "");
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    return filtered;
  }, [data, search, sortKey, sortAsc]);

  const safePageSize = Math.max(1, Math.floor(pageSize) || 5);
  const totalPages = Math.max(1, Math.ceil(processedData.length / safePageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleRows =
    mode === "infinite"
      ? processedData
      : processedData.slice(
          currentPage * safePageSize,
          currentPage * safePageSize + safePageSize
        );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.toolbar}>
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Filter table..."
          aria-label="Filter table"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.accessorKey;
                return (
                  <th key={col.accessorKey} className={styles.th}>
                    <button
                      type="button"
                      onClick={() => handleSort(col.accessorKey)}
                      className={styles.sortBtn}
                    >
                      <span>{col.header}</span>
                      <span className={styles.sortIcon}>
                        {isSorted ? (sortAsc ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row, rIdx) => {
                const record = row as Record<string, unknown>;
                return (
                  <tr key={rIdx} className={styles.tr}>
                    {columns.map((col) => (
                      <td key={col.accessorKey} className={styles.td}>
                        {String(record?.[col.accessorKey] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.emptyTd}>
                  No rows available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mode === "infinite" ? (
        <div className={styles.footer}>
          <button
            type="button"
            onClick={() => onLoadMore?.()}
            className={styles.pageBtn}
          >
            Load more
          </button>
        </div>
      ) : (
        totalPages > 1 && (
          <div className={styles.footer}>
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className={styles.pageBtn}
            >
              Prev
            </button>
            <span className={styles.pageInfo}>
              {currentPage + 1} / {totalPages}
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
        )
      )}
    </div>
  );
}
