import React, {
  useMemo,
  useState,
} from "react";

import {
  ChevronRight,
  Ellipsis,
} from "lucide-react";

export interface BreadcrumbItem {
  /**
   * Unique item id.
   */
  id: string;

  /**
   * Display label.
   */
  label: string;

  /**
   * Optional navigation URL.
   */
  href?: string;

  /**
   * Prevent interaction.
   */
  disabled?: boolean;

  /**
   * Optional custom data.
   */
  data?: any;
}

export interface BreadcrumbRenderContext {
  item: BreadcrumbItem | null;

  index: number;

  current: boolean;

  disabled: boolean;

  click: () => void;
}

export interface BreadcrumbsProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" | "className"
  > {
  /**
   * Breadcrumb items.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","label"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "label":{"type":"string"},
   *       "href":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: BreadcrumbItem[];

  /**
   * Custom item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: BreadcrumbRenderContext
      ) => React.ReactNode);

  /**
   * Custom separator.
   *
   * Defaults to ChevronRight.
   */
  separator?: React.ReactNode;

  /**
   * Maximum number of visible items.
   *
   * If exceeded, middle items collapse.
   *
   * 0 = show everything.
   */
  maxVisible?: number;

  /**
   * Number of items to preserve
   * at the beginning when collapsed.
   */
  preserveStart?: number;

  /**
   * Number of items to preserve
   * at the end when collapsed.
   */
  preserveEnd?: number;

  /**
   * Clicking the collapsed item reveals
   * the complete breadcrumb path.
   */
  expandable?: boolean;

  /**
   * Use href navigation when available.
   */
  useLinks?: boolean;

  /**
   * Empty builder preview text.
   */
  emptyText?: string;

  /**
   * Root customization.
   *
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"full","label":"Full Width"},
   *       {"key":"fit","label":"Fit Content"},
   *       {"key":"auto","label":"Auto"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Item customization.
   *
   * @type|class
   */
  itemClassName?: string;

  /**
   * Current item customization.
   *
   * @type|class
   */
  currentItemClassName?: string;

  /**
   * Separator customization.
   *
   * @type|class
   */
  separatorClassName?: string;

  /**
   * Collapse button customization.
   *
   * @type|class
   */
  collapseClassName?: string;

  /**
   * Dynamic HTML attributes.
   *
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string
  >;

  /**
   * Triggered when an item is clicked.
   *
   * @type|function
   */
  onItemClick?: (
    item: BreadcrumbItem,
    index: number
  ) => void;

  /**
   * Triggered when collapsed items
   * are expanded.
   *
   * @type|function
   */
  onExpand?: () => void;
}

interface VisibleEntry {
  type:
    | "item"
    | "collapse";

  item?: BreadcrumbItem;

  originalIndex?: number;
}

export default function Breadcrumbs({
  items = [],

  children,

  separator,

  maxVisible = 5,

  preserveStart = 1,

  preserveEnd = 2,

  expandable = true,

  useLinks = true,

  emptyText = "Add breadcrumb items",

  className = "w-full",

  itemClassName = "",

  currentItemClassName = "",

  separatorClassName = "",

  collapseClassName = "",

  customAttributes = {},

  onItemClick,

  onExpand,

  style,

  ...props
}: BreadcrumbsProps) {
  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const visibleEntries =
    useMemo<
      VisibleEntry[]
    >(() => {
      if (
        expanded ||
        maxVisible <= 0 ||
        items.length <=
          maxVisible
      ) {
        return items.map(
          (
            item,
            index
          ) => ({
            type: "item",
            item,
            originalIndex:
              index,
          })
        );
      }

      const safeStart =
        Math.max(
          0,
          preserveStart
        );

      const safeEnd =
        Math.max(
          0,
          preserveEnd
        );

      /*
       * Ensure there is room for:
       *
       * start items
       * collapse button
       * end items
       */
      if (
        safeStart +
          safeEnd +
          1 >
        maxVisible
      ) {
        const adjustedEnd =
          Math.max(
            1,
            maxVisible -
              safeStart -
              1
          );

        const startItems =
          items
            .slice(
              0,
              safeStart
            )
            .map(
              (
                item,
                index
              ) => ({
                type:
                  "item" as const,
                item,
                originalIndex:
                  index,
              })
            );

        const endStart =
          Math.max(
            safeStart,
            items.length -
              adjustedEnd
          );

        const endItems =
          items
            .slice(
              endStart
            )
            .map(
              (
                item,
                index
              ) => ({
                type:
                  "item" as const,
                item,
                originalIndex:
                  endStart +
                  index,
              })
            );

        return [
          ...startItems,

          {
            type:
              "collapse",
          },

          ...endItems,
        ];
      }

      const startItems =
        items
          .slice(
            0,
            safeStart
          )
          .map(
            (
              item,
              index
            ) => ({
              type:
                "item" as const,
              item,
              originalIndex:
                index,
            })
          );

      const endStart =
        Math.max(
          safeStart,
          items.length -
            safeEnd
        );

      const endItems =
        items
          .slice(
            endStart
          )
          .map(
            (
              item,
              index
            ) => ({
              type:
                "item" as const,
              item,
              originalIndex:
                endStart +
                index,
            })
          );

      return [
        ...startItems,

        {
          type:
            "collapse",
        },

        ...endItems,
      ];
    }, [
      items,
      expanded,
      maxVisible,
      preserveStart,
      preserveEnd,
    ]);

  const handleItemClick = (
    event:
      React.MouseEvent,
    item:
      BreadcrumbItem,
    index: number
  ) => {
    if (
      item.disabled
    ) {
      event.preventDefault();
      return;
    }

    onItemClick?.(
      item,
      index
    );

    /*
     * If href navigation is disabled,
     * never allow anchor navigation.
     */
    if (
      !useLinks
    ) {
      event.preventDefault();
    }
  };

  const handleExpand =
    () => {
      if (
        !expandable
      ) {
        return;
      }

      setExpanded(
        true
      );

      onExpand?.();
    };

  /*
   * Builder-safe empty state.
   */
  if (
    items.length === 0
  ) {
    return (
      <nav
        aria-label="Breadcrumb"
        className={
          className
        }
        {...customAttributes}
        {...props}
        style={{
          width:
            "100%",

          padding:
            10,

          border:
            "1px dashed #d1d5db",

          borderRadius:
            8,

          color:
            "#9ca3af",

          fontSize:
            13,

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        {typeof children ===
        "function"
          ? children({
              item: null,
              index: 0,
              current:
                false,
              disabled:
                false,
              click:
                () => {},
            })
          : emptyText}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        width:
          "100%",

        overflowX:
          "auto",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      <ol
        style={{
          display:
            "flex",

          alignItems:
            "center",

          flexWrap:
            "nowrap",

          gap: 0,

          width:
            "max-content",

          minWidth:
            "100%",

          padding: 0,

          margin: 0,

          listStyle:
            "none",

          boxSizing:
            "border-box",
        }}
      >
        {visibleEntries.map(
          (
            entry,
            visibleIndex
          ) => {
            const lastVisible =
              visibleIndex ===
              visibleEntries.length -
                1;

            /*
             * Collapsed middle items.
             */
            if (
              entry.type ===
              "collapse"
            ) {
              return (
                <React.Fragment
                  key="breadcrumb-collapse"
                >
                  <li
                    style={{
                      display:
                        "inline-flex",

                      alignItems:
                        "center",

                      flexShrink:
                        0,
                    }}
                  >
                    <button
                      type="button"
                      title="Show full path"
                      aria-label="Show full breadcrumb path"
                      disabled={
                        !expandable
                      }
                      className={
                        collapseClassName
                      }
                      onClick={
                        handleExpand
                      }
                      style={{
                        minWidth:
                          30,

                        height:
                          30,

                        padding:
                          "0 7px",

                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        border:
                          "1px solid transparent",

                        borderRadius:
                          6,

                        background:
                          "transparent",

                        color:
                          "#6b7280",

                        cursor:
                          expandable
                            ? "pointer"
                            : "default",

                        opacity:
                          expandable
                            ? 1
                            : 0.65,

                        boxSizing:
                          "border-box",
                      }}
                    >
                      <Ellipsis
                        size={17}
                      />
                    </button>
                  </li>

                  {!lastVisible && (
                    <li
                      aria-hidden="true"
                      className={
                        separatorClassName
                      }
                      style={{
                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        padding:
                          "0 5px",

                        color:
                          "#9ca3af",

                        flexShrink:
                          0,
                      }}
                    >
                      {separator ?? (
                        <ChevronRight
                          size={15}
                        />
                      )}
                    </li>
                  )}
                </React.Fragment>
              );
            }

            const item =
              entry.item!;

            const index =
              entry.originalIndex!;

            /*
             * Current item means the
             * actual final breadcrumb,
             * not merely the last
             * visible entry.
             */
            const current =
              index ===
              items.length - 1;

            const disabled =
              Boolean(
                item.disabled
              );

            const context:
              BreadcrumbRenderContext = {
              item,
              index,
              current,
              disabled,

              click:
                () => {
                  if (
                    disabled
                  ) {
                    return;
                  }

                  onItemClick?.(
                    item,
                    index
                  );
                },
            };

            const content =
              typeof children ===
              "function"
                ? children(
                    context
                  )
                : children ??
                  item.label;

            const canNavigate =
              Boolean(
                item.href
              ) &&
              useLinks &&
              !disabled &&
              !current;

            return (
              <React.Fragment
                key={
                  item.id
                }
              >
                <li
                  style={{
                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    minWidth: 0,

                    flexShrink:
                      0,
                  }}
                >
                  {canNavigate ? (
                    <a
                      href={
                        item.href
                      }
                      className={`${itemClassName} ${
                        current
                          ? currentItemClassName
                          : ""
                      }`}
                      onClick={(
                        event
                      ) =>
                        handleItemClick(
                          event,
                          item,
                          index
                        )
                      }
                      style={{
                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        minHeight:
                          30,

                        maxWidth:
                          220,

                        padding:
                          "4px 6px",

                        borderRadius:
                          6,

                        color:
                          "#4b5563",

                        fontSize:
                          13,

                        fontWeight:
                          500,

                        textDecoration:
                          "none",

                        whiteSpace:
                          "nowrap",

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",

                        cursor:
                          "pointer",

                        boxSizing:
                          "border-box",
                      }}
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled={
                        disabled ||
                        current
                      }
                      aria-current={
                        current
                          ? "page"
                          : undefined
                      }
                      className={`${itemClassName} ${
                        current
                          ? currentItemClassName
                          : ""
                      }`}
                      onClick={(
                        event
                      ) =>
                        handleItemClick(
                          event,
                          item,
                          index
                        )
                      }
                      style={{
                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        minHeight:
                          30,

                        maxWidth:
                          220,

                        padding:
                          "4px 6px",

                        border: 0,

                        borderRadius:
                          6,

                        background:
                          "transparent",

                        color:
                          disabled
                            ? "#9ca3af"
                            : current
                              ? "#111827"
                              : "#4b5563",

                        fontSize:
                          13,

                        fontWeight:
                          current
                            ? 600
                            : 500,

                        whiteSpace:
                          "nowrap",

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",

                        cursor:
                          disabled ||
                          current
                            ? "default"
                            : "pointer",

                        opacity:
                          disabled
                            ? 0.55
                            : 1,

                        boxSizing:
                          "border-box",
                      }}
                    >
                      {content}
                    </button>
                  )}
                </li>

                {!lastVisible && (
                  <li
                    aria-hidden="true"
                    className={
                      separatorClassName
                    }
                    style={{
                      display:
                        "inline-flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      padding:
                        "0 5px",

                      color:
                        "#9ca3af",

                      flexShrink:
                        0,
                    }}
                  >
                    {separator ?? (
                      <ChevronRight
                        size={15}
                      />
                    )}
                  </li>
                )}
              </React.Fragment>
            );
          }
        )}
      </ol>
    </nav>
  );
}