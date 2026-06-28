import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ChevronDown, ChevronUp, ChevronsUpDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, SlidersHorizontal, Loader2
} from "lucide-react";

export interface DataTableProps {
  columns: ColumnDef<any, any>[];
  data: any[];
  pageSize?: number /* @optional */;
  mode?: "pagination" | "infinite" /* @optional @select|pagination|infinite*/;
  onLoadMore?: () => void /* @optional */;
  isFetching?: boolean /* @optional */;
  hasMore?: boolean /* @optional */;
  globalFilterPlaceholder?: string /* @optional */;
}

export default function DataTable({
  columns = [],
  data = [],
  pageSize = 10,
  mode = "pagination",
  onLoadMore,
  isFetching = false,
  hasMore = false,
  globalFilterPlaceholder = "Search all records...",
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // 🚀 NEW: State to toggle the column-specific filter row
  const [showFilters, setShowFilters] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && onLoadMore) {
          onLoadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, hasMore, onLoadMore]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: mode === "pagination" ? getPaginationRowModel() : undefined,
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div className="space-y-4 w-full">
      {/* --- Toolbar --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={globalFilterPlaceholder}
            className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500/50 transition-colors shadow-sm dark:shadow-none"
          />
        </div>

        {/* 🚀 FIX: Button now toggles the 'showFilters' state */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors w-full sm:w-auto shadow-sm dark:shadow-none ${showFilters
              ? "bg-blue-50 dark:bg-white/10 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white"
              : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
            }`}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
        </button>
      </div>

      {/* --- Table Core --- */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] overflow-hidden shadow-sm dark:shadow-none flex flex-col">
        {/* Using custom-scrollbar class to make the scrollbar look better in dark mode */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-bold">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 whitespace-nowrap align-top">
                      {header.isPlaceholder ? null : (
                        <div className="flex flex-col gap-3">
                          <div
                            className={header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors" : "flex items-center gap-2"}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <ChevronUp size={14} className="text-blue-500 dark:text-cyan-400" />,
                              desc: <ChevronDown size={14} className="text-blue-500 dark:text-cyan-400" />,
                            }[header.column.getIsSorted() as string] ??
                              (header.column.getCanSort() ? <ChevronsUpDown size={14} className="opacity-0 group-hover:opacity-50" /> : null)}
                          </div>

                          {/* 🚀 FIX: Individual Column Filter Inputs appear here when toggled */}
                          {showFilters && header.column.getCanFilter() ? (
                            <input
                              type="text"
                              value={(header.column.getFilterValue() ?? '') as string}
                              onChange={e => header.column.setFilterValue(e.target.value)}
                              placeholder={`Filter...`}
                              className="w-full min-w-[120px] px-2 py-1.5 text-xs font-normal normal-case border rounded-lg bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500/50 transition-colors shadow-inner"
                              onClick={e => e.stopPropagation()} // Prevent sorting when clicking the input
                            />
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                    No results found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Infinite Scroll Trigger --- */}
        {mode === "infinite" && (
          <div ref={loadMoreRef} className="flex items-center justify-center p-4 text-slate-500 border-t border-slate-200 dark:border-white/10">
            {isFetching ? (
              <span className="flex items-center gap-2 text-sm"><Loader2 className="animate-spin" size={14} /> Loading more...</span>
            ) : hasMore ? (
              <span className="text-sm">Scroll for more</span>
            ) : (
              <span className="text-sm">End of results</span>
            )}
          </div>
        )}
      </div>

      {/* --- Pagination Controls --- */}
      {mode === "pagination" && (
        <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex-1">
            Page <span className="font-semibold text-slate-700 dark:text-slate-200">{table.getState().pagination.pageIndex + 1}</span> of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{table.getPageCount() || 1}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors">
              <ChevronsLeft size={16} />
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors">
              <ChevronRight size={16} />
            </button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors">
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}