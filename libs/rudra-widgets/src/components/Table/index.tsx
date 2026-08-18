import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

export interface DataTableProps {
  columns: ColumnDef<any, any>[];
  data: any[];

  /** @optional */
  pageSize?: number;

  /** @optional @select|pagination|infinite */
  mode?: "pagination" | "infinite";

  /** @optional */
  onLoadMore?: () => void;

  /** @optional */
  isFetching?: boolean;

  /** @optional */
  hasMore?: boolean;

  /** @optional */
  globalFilterPlaceholder?: string;
}

/**
 * Stable fallback references.
 *
 * Defining these outside the component prevents a new empty array from being
 * created during every render when a prop is omitted.
 */
const EMPTY_COLUMNS: ColumnDef<any, any>[] = [];
const EMPTY_DATA: any[] = [];

export default function DataTable({
  columns = EMPTY_COLUMNS,
  data = EMPTY_DATA,
  pageSize = 10,
  mode = "pagination",
  onLoadMore,
  isFetching = false,
  hasMore = false,
  globalFilterPlaceholder = "Search all records...",
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Pagination is controlled explicitly.
   *
   * This replaces the previous table.setPageSize() effect, which could cause
   * TanStack Table to continuously update its internal state.
   */
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize,
  }));

  useEffect(() => {
    setPagination((current) => {
      if (current.pageSize === pageSize) {
        return current;
      }

      return {
        pageIndex: 0,
        pageSize,
      };
    });
  }, [pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel:
      mode === "pagination" ? getPaginationRowModel() : undefined,
  });

  /*
   * Infinite-scroll handling.
   *
   * The DOM ref and observer lifecycle are kept separate so changing props
   * does not repeatedly detach and recreate a callback ref.
   */
  const loadMoreElementRef = useRef<HTMLDivElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const loadRequestedRef = useRef(false);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!isFetching) {
      loadRequestedRef.current = false;
    }
  }, [isFetching, data.length]);

  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    loadMoreElementRef.current = node;
  }, []);

  useEffect(() => {
    const node = loadMoreElementRef.current;

    if (
      mode !== "infinite" ||
      !node ||
      isFetching ||
      !hasMore ||
      !onLoadMoreRef.current
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry?.isIntersecting ||
          loadRequestedRef.current ||
          !onLoadMoreRef.current
        ) {
          return;
        }

        loadRequestedRef.current = true;
        onLoadMoreRef.current();
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [mode, isFetching, hasMore, data.length]);

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

          <input
            type="text"
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
            }}
            placeholder={globalFilterPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-[#0A0A0A] dark:text-slate-200 dark:shadow-none dark:placeholder:text-slate-600 dark:focus:border-cyan-500/50"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setShowFilters((current) => !current);
          }}
          className={`flex w-full items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors sm:w-auto dark:shadow-none ${
            showFilters
              ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-white/20 dark:bg-white/10 dark:text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0A0A0A] dark:text-slate-300 dark:hover:bg-white/5"
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
        </button>
      </div>

      {/* Table */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0A0A0A] dark:shadow-none">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className="whitespace-nowrap px-6 py-4 align-top"
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex flex-col gap-3">
                            <button
                              type="button"
                              disabled={!header.column.getCanSort()}
                              onClick={
                                header.column.getToggleSortingHandler()
                              }
                              className={
                                header.column.getCanSort()
                                  ? "flex cursor-pointer select-none items-center gap-2 transition-colors hover:text-slate-900 dark:hover:text-white"
                                  : "flex cursor-default items-center gap-2"
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}

                              {sorted === "asc" ? (
                                <ChevronUp
                                  size={14}
                                  className="text-blue-500 dark:text-cyan-400"
                                />
                              ) : sorted === "desc" ? (
                                <ChevronDown
                                  size={14}
                                  className="text-blue-500 dark:text-cyan-400"
                                />
                              ) : header.column.getCanSort() ? (
                                <ChevronsUpDown
                                  size={14}
                                  className="opacity-50"
                                />
                              ) : null}
                            </button>

                            {showFilters &&
                            header.column.getCanFilter() ? (
                              <input
                                type="text"
                                value={
                                  (header.column.getFilterValue() ??
                                    "") as string
                                }
                                onChange={(event) => {
                                  header.column.setFilterValue(
                                    event.target.value,
                                  );
                                }}
                                placeholder="Filter..."
                                className="w-full min-w-[120px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-normal normal-case text-slate-700 shadow-inner transition-colors focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-black/40 dark:text-slate-300 dark:focus:border-cyan-500/50"
                              />
                            ) : null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-6 py-4 text-slate-700 dark:text-slate-300"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={Math.max(columns.length, 1)}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No results found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Infinite-scroll sentinel */}
        {mode === "infinite" && (
          <div
            ref={loadMoreRef}
            className="flex items-center justify-center border-t border-slate-200 p-4 text-slate-500 dark:border-white/10"
          >
            {isFetching ? (
              <span className="flex items-center gap-2 text-sm">
                <Loader2 className="animate-spin" size={14} />
                Loading more...
              </span>
            ) : hasMore ? (
              <span className="text-sm">Scroll for more</span>
            ) : (
              <span className="text-sm">End of results</span>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {mode === "pagination" && (
        <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex-1">
            Page{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {pageCount || 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="First page"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              type="button"
              aria-label="Previous page"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              aria-label="Next page"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              aria-label="Last page"
              onClick={() => {
                table.setPageIndex(Math.max(pageCount - 1, 0));
              }}
              disabled={!table.getCanNextPage()}
              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}