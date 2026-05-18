import React, { useState, useRef, useMemo, useEffect } from 'react';
import styles from './styles.module.scss';

export interface DataTableColumn {
  key: string;
  label: string;
  width?: string | number;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  rowHeight?: number;
  containerHeight?: number;
  pageSize?: number;
  currentPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: any) => void;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  filterSlot?: React.ReactNode;
  paginationSlot?: React.ReactNode;
  emptySlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function DataTable({
  columns = [],
  data = [],
  rowHeight = 48,
  containerHeight = 400,
  pageSize,
  currentPage = 1,
  totalCount,
  onPageChange,
  onRowClick,
  headerSlot,
  footerSlot,
  filterSlot,
  paginationSlot,
  emptySlot,
  children,
  className = '',
  style
}: DataTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Virtualization logic
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const visibleRows = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight);
    const end = Math.min(
      data.length,
      Math.ceil((scrollTop + containerHeight) / rowHeight)
    );
    
    // Adding a buffer of 2 rows for smoother scrolling
    const bufferStart = Math.max(0, start - 2);
    const bufferEnd = Math.min(data.length, end + 2);

    return data.slice(bufferStart, bufferEnd).map((row, index) => ({
      row,
      index: bufferStart + index,
    }));
  }, [data, scrollTop, rowHeight, containerHeight]);

  const totalContentHeight = data.length * rowHeight;

  return (
    <div className={`${styles.rootContainer} ${className}`} style={style}>
      {headerSlot && <div className={styles.headerSlot}>{headerSlot}</div>}
      {filterSlot && <div className={styles.filterSlot}>{filterSlot}</div>}

      <div className={styles.tableWrapper}>
        <div className={styles.thead}>
          <div className={styles.tr}>
            {columns.map((col) => (
              <div 
                key={col.key} 
                className={styles.th} 
                style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
              >
                {col.label}
              </div>
            ))}
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className={styles.scrollArea}
          onScroll={handleScroll}
          style={{ height: containerHeight }}
        >
          <div className={styles.virtualContent} style={{ height: totalContentHeight }}>
            {data.length === 0 ? (
              <div className={styles.emptyState}>
                {emptySlot || 'No data available'}
              </div>
            ) : (
              visibleRows.map(({ row, index }) => (
                <div
                  key={index}
                  className={`${styles.tr} ${styles.tbodyRow}`}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    height: rowHeight,
                    transform: `translateY(${index * rowHeight}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0
                  }}
                >
                  {columns.map((col) => (
                    <div 
                      key={col.key} 
                      className={styles.td} 
                      style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {paginationSlot ? (
        <div className={styles.paginationSlot}>{paginationSlot}</div>
      ) : pageSize && totalCount && (
        <div className={styles.defaultPagination}>
          <button 
            disabled={currentPage <= 1} 
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            Prev
          </button>
          <span>Page {currentPage} of {Math.ceil(totalCount / pageSize)}</span>
          <button 
            disabled={currentPage >= Math.ceil(totalCount / pageSize)} 
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {children}
      {footerSlot && <div className={styles.footerSlot}>{footerSlot}</div>}
    </div>
  );
}
