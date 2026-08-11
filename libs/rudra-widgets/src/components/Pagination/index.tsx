import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

export interface PaginationProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  items?: any[]; /* @optional */

  pageSize?: number;
  currentPage?: number;
  defaultPage?: number;
  siblingCount?: number;

  showPrevious?: boolean;
  showNext?: boolean;

  children?:
    | React.ReactNode
    | ((context: {
        item: any;
        index: number;
      }) => React.ReactNode); /* @nodeFunction */

  /**
   * Items container customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Display",
   *     "prefix":"",
   *     "type":"select",
   *     "options":[
   *       {"key":"grid","label":"Grid"},
   *       {"key":"flex","label":"Flex"},
   *       {"key":"block","label":"Block"}
   *     ]
   *   },
   *   {
   *     "key":"Grid Columns",
   *     "prefix":"grid-cols",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"1 Column"},
   *       {"key":"2","label":"2 Columns"},
   *       {"key":"3","label":"3 Columns"},
   *       {"key":"4","label":"4 Columns"},
   *       {"key":"6","label":"6 Columns"}
   *     ]
   *   },
   *   {
   *     "key":"Flex Direction",
   *     "prefix":"flex",
   *     "type":"select",
   *     "options":[
   *       {"key":"row","label":"Row"},
   *       {"key":"col","label":"Column"}
   *     ]
   *   },
   *   {
   *     "key":"Wrap",
   *     "prefix":"flex",
   *     "type":"select",
   *     "options":[
   *       {"key":"wrap","label":"Wrap"},
   *       {"key":"nowrap","label":"No Wrap"}
   *     ]
   *   },
   *   {
   *     "key":"Justify",
   *     "prefix":"justify",
   *     "type":"select",
   *     "options":[
   *       {"key":"start","label":"Start"},
   *       {"key":"center","label":"Center"},
   *       {"key":"end","label":"End"},
   *       {"key":"between","label":"Space Between"}
   *     ]
   *   },
   *   {
   *     "key":"Align",
   *     "prefix":"items",
   *     "type":"select",
   *     "options":[
   *       {"key":"start","label":"Start"},
   *       {"key":"center","label":"Center"},
   *       {"key":"end","label":"End"},
   *       {"key":"stretch","label":"Stretch"}
   *     ]
   *   },
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"},
   *       {"key":"8","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Pagination controls customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Justify",
   *     "prefix":"justify",
   *     "type":"select",
   *     "options":[
   *       {"key":"start","label":"Start"},
   *       {"key":"center","label":"Center"},
   *       {"key":"end","label":"End"},
   *       {"key":"between","label":"Space Between"}
   *     ]
   *   }
   * ]
   */
  paginationClassName?: string;

  /**
   * Page button customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"8","label":"Small"},
   *       {"key":"9","label":"Medium"},
   *       {"key":"10","label":"Large"},
   *       {"key":"12","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Height",
   *     "prefix":"h",
   *     "type":"select",
   *     "options":[
   *       {"key":"8","label":"Small"},
   *       {"key":"9","label":"Medium"},
   *       {"key":"10","label":"Large"},
   *       {"key":"12","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"full","label":"Circle"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-800","label":"Gray 800"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-500","label":"Gray 500"},
   *       {"key":"gray-700","label":"Gray 700"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"white","label":"White"},
   *       {"key":"blue-600","label":"Blue"}
   *     ]
   *   }
   * ]
   */
  pageClassName?: string;

  /**
   * Active page customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"blue-600","label":"Blue"},
   *       {"key":"black","label":"Black"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"white","label":"White"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"black","label":"Black"},
   *       {"key":"blue-600","label":"Blue"}
   *     ]
   *   }
   * ]
   */
  activePageClassName?: string;

  /**
   * Previous / next button customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-800","label":"Gray 800"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"full","label":"Circle"}
   *     ]
   *   }
   * ]
   */
  navigationClassName?: string;

  /** @type|function */
  onPageChange?: (page: number) => void;
}

type PageEntry =
  | {
      type: "page";
      page: number;
    }
  | {
      type: "ellipsis";
      id: string;
    };

function createPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): PageEntry[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => ({
      type: "page" as const,
      page: index + 1,
    }));
  }

  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

  const pages: PageEntry[] = [
    {
      type: "page",
      page: 1,
    },
  ];

  if (start > 2) {
    pages.push({
      type: "ellipsis",
      id: "ellipsis-start",
    });
  }

  for (let page = start; page <= end; page++) {
    pages.push({
      type: "page",
      page,
    });
  }

  if (end < totalPages - 1) {
    pages.push({
      type: "ellipsis",
      id: "ellipsis-end",
    });
  }

  pages.push({
    type: "page",
    page: totalPages,
  });

  return pages;
}

export default function Pagination({
  items = [],
  pageSize = 6,
  currentPage,
  defaultPage = 1,
  siblingCount = 1,
  showPrevious = true,
  showNext = true,
  children,
  className = "",
  paginationClassName = "",
  pageClassName = "",
  activePageClassName = "",
  navigationClassName = "",
  onPageChange,
  ...props
}: PaginationProps) {
  const safeItems = Array.isArray(items) ? items : [];
  const safePageSize = Math.max(Number(pageSize) || 1, 1);

  const totalPages = Math.ceil(
    safeItems.length / safePageSize
  );

  const controlled = currentPage !== undefined;

  const [internalPage, setInternalPage] =
    useState(defaultPage);

  const firstPageRef =
    useRef<HTMLDivElement>(null);

  const [firstPageHeight, setFirstPageHeight] =
    useState<number | null>(null);

  const requestedPage = controlled
    ? currentPage
    : internalPage;

  const activePage =
    totalPages > 0
      ? Math.min(
          Math.max(requestedPage || 1, 1),
          totalPages
        )
      : 1;

  useEffect(() => {
    if (
      !controlled &&
      totalPages > 0 &&
      internalPage > totalPages
    ) {
      setInternalPage(totalPages);
    }
  }, [
    controlled,
    internalPage,
    totalPages,
  ]);

  const startIndex =
    (activePage - 1) *
    safePageSize;

  const endIndex =
    startIndex + safePageSize;

  const visibleItems =
    safeItems.slice(
      startIndex,
      endIndex
    );

  useEffect(() => {
    if (
      activePage !== 1 ||
      !firstPageRef.current
    ) {
      return;
    }

    const element =
      firstPageRef.current;

    const measure = () => {
      const height =
        element.getBoundingClientRect().height;

      if (height > 0) {
        setFirstPageHeight(
          Math.ceil(height)
        );
      }
    };

    measure();

    if (
      typeof ResizeObserver ===
      "undefined"
    ) {
      return;
    }

    const observer =
      new ResizeObserver(measure);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    activePage,
    safePageSize,
    safeItems.length,
    className,
    children,
  ]);

  const changePage = (page: number) => {
    if (totalPages === 0) return;

    const nextPage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    if (nextPage === activePage) {
      return;
    }

    if (!controlled) {
      setInternalPage(nextPage);
    }

    onPageChange?.(nextPage);
  };

  if (safeItems.length === 0) {
    return (
      <div
        {...props}
        className="w-full"
      >
        <div
          className={[
            "w-full rounded-lg",
            "border-2 border-dashed",
            "border-purple-200",
            "bg-purple-50",
            "p-8 text-center",
            "text-sm text-purple-600",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          Pagination (No Data Bound)

          <div className="mt-4">
            {typeof children === "function"
              ? children({
                  item: null,
                  index: 0,
                })
              : children}
          </div>
        </div>
      </div>
    );
  }

  const pages = createPageRange(
    activePage,
    totalPages,
    Math.max(siblingCount, 0)
  );

  return (
    <div
      {...props}
      className="w-full"
    >
      <div
        style={{
          minHeight:
            firstPageHeight !== null
              ? `${firstPageHeight}px`
              : undefined,
        }}
      >
        <div
          ref={
            activePage === 1
              ? firstPageRef
              : undefined
          }
          className={[
            "grid w-full content-start",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {visibleItems.map(
            (item, index) => {
              const actualIndex =
                startIndex + index;

              return (
                <React.Fragment
                  key={
                    item?.id ??
                    actualIndex
                  }
                >
                  {typeof children ===
                  "function"
                    ? children({
                        item,
                        index:
                          actualIndex,
                      })
                    : children}
                </React.Fragment>
              );
            }
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className={[
            "mt-4 flex items-center justify-center gap-1",
            paginationClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {showPrevious && (
            <button
              type="button"
              aria-label="Previous page"
              disabled={
                activePage <= 1
              }
              onClick={() =>
                changePage(
                  activePage - 1
                )
              }
              className={[
                "flex h-9 w-9 shrink-0",
                "items-center justify-center",
                "rounded-md",
                "text-slate-600",
                "transition-colors",
                "hover:bg-slate-100",
                "disabled:cursor-not-allowed",
                "disabled:opacity-40",
                navigationClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <ChevronLeft
                size={18}
                aria-hidden="true"
              />
            </button>
          )}

          {pages.map((entry) => {
            if (
              entry.type ===
              "ellipsis"
            ) {
              return (
                <span
                  key={entry.id}
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-400"
                >
                  <MoreHorizontal
                    size={18}
                  />
                </span>
              );
            }

            const active =
              entry.page ===
              activePage;

            return (
              <button
                key={entry.page}
                type="button"
                aria-label={`Page ${entry.page}`}
                aria-current={
                  active
                    ? "page"
                    : undefined
                }
                onClick={() =>
                  changePage(
                    entry.page
                  )
                }
                className={[
                  "flex h-9 w-9 shrink-0",
                  "items-center justify-center",
                  "rounded-md",
                  "text-sm font-medium",
                  "transition-colors",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100",
                  pageClassName,
                  active
                    ? activePageClassName
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {entry.page}
              </button>
            );
          })}

          {showNext && (
            <button
              type="button"
              aria-label="Next page"
              disabled={
                activePage >=
                totalPages
              }
              onClick={() =>
                changePage(
                  activePage + 1
                )
              }
              className={[
                "flex h-9 w-9 shrink-0",
                "items-center justify-center",
                "rounded-md",
                "text-slate-600",
                "transition-colors",
                "hover:bg-slate-100",
                "disabled:cursor-not-allowed",
                "disabled:opacity-40",
                navigationClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <ChevronRight
                size={18}
                aria-hidden="true"
              />
            </button>
          )}
        </nav>
      )}
    </div>
  );
}