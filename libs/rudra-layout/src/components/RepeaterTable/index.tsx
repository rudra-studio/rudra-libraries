import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getExpandedRowModel, flexRender,
  ColumnDef, SortingState, ExpandedState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, ChevronsLeft, ChevronLeft, ChevronsRight, Search, LayoutTemplate } from "lucide-react";

type TableRowPayload = { item: any; index: number; isExpanded: boolean; toggleExpanded: () => void; };

export interface RepeaterTableProps {
  data?: any[];                                 

  /**
   * @optional
   * @type|complex
   * @schema { "type": "array", "items": { "type": "object", "properties": { "label": { "type": "string", "default": "Header" }, "accessor": { "type": "string", "default": "id" }, "template": { "type": "nodeFunction" } } } }
   */
  columns?: { 
    label: string; 
    accessor: string; 
    template?: (context: TableRowPayload) => React.ReactNode 
  }[];

  expandedContent?: | React.ReactNode | ((context: TableRowPayload) => React.ReactNode); 
  pageSize?: number;                            
  globalFilterPlaceholder?: string;             
  className?: string;                           
}

export default function RepeaterTable({
  data = [],
  columns = [],
  expandedContent,
  pageSize = 5,
  globalFilterPlaceholder = "Search anywhere...",
  className = "",
}: RepeaterTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // 1. Ref stabilization for the entire complex object
  const columnsRef = useRef(columns);
  useEffect(() => { columnsRef.current = columns; }, [columns]);

  const tableCols = useMemo<ColumnDef<any, any>[]>(() => {
    const safeCols = Array.isArray(columnsRef.current) ? columnsRef.current : [];

    return safeCols.map((col, index) => {
      return {
        id: `col_${index}`,
        accessorFn: (row) => row[col.accessor] ?? row,

        header: () => (
          <div className="font-semibold text-slate-700 dark:text-slate-200 uppercase text-xs">
            {col.label}
          </div>
        ),

        cell: ({ row }) => {
          // 2. Safely extract the dynamically injected template slot!
          const currentTemplate = columnsRef.current?.[index]?.template;
          const isFirstCol = index === 0;

          const contextPayload: TableRowPayload = {
            item: row.original,
            index: row.index,
            isExpanded: row.getIsExpanded(),
            toggleExpanded: row.getToggleExpandedHandler()
          };

          return (
            <div className="flex items-center gap-3">
              {isFirstCol && expandedContent && (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-500 transition-colors shrink-0"
                >
                  {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}

              <div className="flex-1 w-full min-w-0">
                {typeof currentTemplate === 'function'
                  ? currentTemplate(contextPayload)
                  : currentTemplate ? currentTemplate : (
                    <div className="py-2 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded text-slate-400 dark:text-slate-500 text-xs italic flex items-center gap-2">
                      <LayoutTemplate size={12} /> Drop {col.label} Cell
                    </div>
                  )}
              </div>
            </div>
          );
        }
      };
    });
  }, [columns?.length, expandedContent]); // Only depend on length

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: tableCols,
    state: { sorting, globalFilter, expanded },
    initialState: { pagination: { pageSize } },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: (row, _, filterValue) => {
      const searchStr = String(filterValue).toLowerCase();
      return Object.values(row.original).some(val =>
        String(val).toLowerCase().includes(searchStr)
      );
    },
  });

  useEffect(() => { table.setPageSize(pageSize); }, [pageSize, table]);

  if (data.length === 0 && (!columns || columns.length === 0)) {
    return (
      <div className="w-full p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0A0A] rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <LayoutTemplate size={32} className="mb-4 opacity-50" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Repeater Table Empty</p>
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
          className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 outline-none"
        />
      </div>

      {/* Table Core */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] overflow-hidden">
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
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && expandedContent && (
                    <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                      <td colSpan={tableCols.length} className="p-0 border-b border-slate-200 dark:border-white/5">
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