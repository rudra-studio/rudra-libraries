import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ExpandedState,
} from "@tanstack/react-table";
import {
  ChevronDown, ChevronRight, ChevronsLeft, ChevronLeft,
  ChevronsRight, Search, LayoutTemplate
} from "lucide-react";

// Context is completely removed! Data injection is now pure functional execution.

// Reusable payload type for the builder to pass into functions
type TableRowPayload = { 
  item: any; 
  index: number; 
  isExpanded: boolean; 
  toggleExpanded: () => void; 
};

export interface RepeaterTableProps {
  data?: any[];                                 /* @optional */
  headerTemplates?: React.ReactNode[];          /* @optional */
  cellTemplates?: (
    | React.ReactNode 
    | ((context: TableRowPayload) => React.ReactNode)
  )[];                                          /* @optional @nodeFunction[] */
  expandedContent?: 
    | React.ReactNode 
    | ((context: TableRowPayload) => React.ReactNode); /* @optional  */
  
  pageSize?: number;                            /* @optional */
  globalFilterPlaceholder?: string;             /* @optional */
  className?: string;                           /* @optional */
}

export default function RepeaterTable({
  data = [],
  headerTemplates = [],
  cellTemplates = [],
  expandedContent,
  pageSize = 5,
  globalFilterPlaceholder = "Search anywhere...",
  className = "",
}: RepeaterTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Safely fallback props for the builder
  const safeData = Array.isArray(data) ? data : [];
  const safeHeaders = Array.isArray(headerTemplates) ? headerTemplates : [];
  const safeCells = Array.isArray(cellTemplates) ? cellTemplates : [];

  const columns = useMemo<ColumnDef<any, any>[]>(() => {
    const colCount = Math.max(safeHeaders.length, safeCells.length);
    
    return Array.from({ length: colCount }).map((_, index) => ({
      id: `col_${index}`,
      accessorFn: (row) => row,
      
      // 🚀 RENDER HEADER SLOT
      header: () => {
        const template = safeHeaders[index];
        return template ? template : (
          <div className="py-1 px-2 border border-dashed border-slate-300 dark:border-slate-700 rounded text-slate-400 dark:text-slate-500 text-[10px] font-mono flex items-center gap-1">
            <LayoutTemplate size={10} /> H-Slot {index + 1}
          </div>
        );
      },
      
      // 🚀 RENDER CELL SLOT (Render Props Architecture applied here)
      cell: ({ row }) => {
        const item = row.original;
        const template = safeCells[index];
        const isFirstCol = index === 0;
        
        // Define the runtime payload for this specific cell
        const contextPayload: TableRowPayload = {
          item, 
          index: row.index, 
          isExpanded: row.getIsExpanded(), 
          toggleExpanded: row.getToggleExpandedHandler()
        };

        return (
          <div className="flex items-center gap-3">
            {/* Auto-inject expand chevron on the first column if expandedContent exists */}
            {isFirstCol && expandedContent && (
              <button 
                onClick={row.getToggleExpandedHandler()} 
                className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-500 transition-colors shrink-0"
              >
                {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            
            <div className="flex-1 w-full min-w-0">
              {/* Execute the function if it's a render prop, otherwise render the static node */}
              {typeof template === 'function' 
                ? template(contextPayload) 
                : template ? template : (
                <div className="py-2 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded text-slate-400 dark:text-slate-500 text-xs italic flex items-center gap-2">
                  <LayoutTemplate size={12} /> C-Slot {index + 1}
                </div>
              )}
            </div>
          </div>
        );
      }
    }));
  }, [safeHeaders, safeCells, expandedContent]);

  const table = useReactTable({
    data: safeData,
    columns,
    state: { sorting, globalFilter, expanded },
    initialState: { pagination: { pageSize } },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchStr = String(filterValue).toLowerCase();
      return Object.values(row.original).some(val => 
        String(val).toLowerCase().includes(searchStr)
      );
    },
  });

  useEffect(() => { table.setPageSize(pageSize); }, [pageSize, table]);

  if (safeData.length === 0 && safeHeaders.length === 0 && safeCells.length === 0) {
    return (
      <div className="w-full p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0A0A] rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <LayoutTemplate size={32} className="mb-4 opacity-50" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Repeater Table Empty</p>
        <p className="text-xs mt-1 text-slate-500">Provide Data, Header Templates, or Cell Templates to begin.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {/* Search Bar */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={globalFilterPlaceholder}
          className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm dark:shadow-none"
        />
      </div>

      {/* Table Core */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Main Row */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Expanded Content Row (Render Props Architecture applied here) */}
                  {row.getIsExpanded() && expandedContent && (
                    <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                      <td colSpan={columns.length} className="p-0 border-b border-slate-200 dark:border-white/5">
                        <div className="p-6">
                          {typeof expandedContent === 'function' 
                            ? expandedContent({ item: row.original, index: row.index, isExpanded: true, toggleExpanded: row.getToggleExpandedHandler() })
                            : expandedContent}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              
              {table.getRowModel().rows.length === 0 && (
                 <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                      No results found matching your filters.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex-1">
          Page <span className="font-semibold text-slate-700 dark:text-slate-200">{table.getState().pagination.pageIndex + 1}</span> of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{table.getPageCount() || 1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"><ChevronsLeft size={16} /></button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"><ChevronLeft size={16} /></button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"><ChevronRight size={16} /></button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"><ChevronsRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}