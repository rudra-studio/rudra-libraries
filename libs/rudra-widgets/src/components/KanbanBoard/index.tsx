import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  GripVertical,
} from "lucide-react";

export interface KanbanColumn {
  id: string;

  title: string;

  description?: string;

  color?: string;

  disabled?: boolean;

  data?: any;
}

export interface KanbanItem {
  id: string;

  columnId: string;

  title: string;

  description?: string;

  disabled?: boolean;

  data?: any;
}

export interface KanbanRenderContext {
  item: KanbanItem | null;

  index: number;

  column:
    | KanbanColumn
    | null;

  columnIndex: number;

  dragging: boolean;
}

export interface KanbanBoardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Board columns.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","title"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "title":{"type":"string"},
   *       "description":{"type":"string"},
   *       "color":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  columns?: KanbanColumn[];

  /**
   * Board cards.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","columnId","title"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "columnId":{"type":"string"},
   *       "title":{"type":"string"},
   *       "description":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: KanbanItem[];

  /**
   * Custom card renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: KanbanRenderContext
      ) => React.ReactNode);

  /**
   * Enable native drag and drop.
   */
  draggable?: boolean;

  /**
   * Locally display a move immediately.
   *
   * Useful for static Rudra data.
   */
  optimisticMove?: boolean;

  /**
   * Show item count in column header.
   */
  showCount?: boolean;

  /**
   * Show column description.
   */
  showColumnDescription?: boolean;

  /**
   * Show default drag handle.
   */
  showDragHandle?: boolean;

  /**
   * Width of each column.
   */
  columnWidth?: number;

  /**
   * Minimum column width.
   */
  minColumnWidth?: number;

  /**
   * Space between columns.
   */
  columnGap?: number;

  /**
   * Space between cards.
   */
  cardGap?: number;

  /**
   * Minimum column body height.
   */
  minColumnHeight?: number;

  /**
   * Empty column text.
   */
  emptyColumnText?: string;

  /**
   * Empty board text.
   */
  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  columnClassName?: string;

  /**
   * @type|class
   */
  columnHeaderClassName?: string;

  /**
   * @type|class
   */
  columnBodyClassName?: string;

  /**
   * @type|class
   */
  itemClassName?: string;

  /**
   * @type|class
   */
  draggingItemClassName?: string;

  /**
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string
  >;

  /**
   * @type|function
   */
  onItemClick?: (
    item: KanbanItem,
    index: number,
    column: KanbanColumn
  ) => void;

  /**
   * @type|function
   */
  onItemMove?: (
    item: KanbanItem,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => void;

  /**
   * @type|function
   */
  onColumnClick?: (
    column: KanbanColumn,
    index: number
  ) => void;
}

interface DragState {
  itemId: string;

  fromColumnId: string;

  fromIndex: number;
}

function createLocationMap(
  items: KanbanItem[]
) {
  const result:
    Record<string, string> =
    {};

  items.forEach(
    (item) => {
      result[item.id] =
        item.columnId;
    }
  );

  return result;
}

export default function KanbanBoard({
  columns = [],

  items = [],

  children,

  draggable = true,

  optimisticMove = true,

  showCount = true,

  showColumnDescription = true,

  showDragHandle = true,

  columnWidth = 300,

  minColumnWidth = 240,

  columnGap = 16,

  cardGap = 10,

  minColumnHeight = 180,

  emptyColumnText = "Drop items here",

  emptyText = "Add Kanban columns",

  className = "w-full",

  columnClassName = "",

  columnHeaderClassName = "",

  columnBodyClassName = "",

  itemClassName = "",

  draggingItemClassName = "",

  customAttributes = {},

  onItemClick,

  onItemMove,

  onColumnClick,

  style,

  ...props
}: KanbanBoardProps) {
  const dragStateRef =
    useRef<
      DragState | null
    >(null);

  const [
    itemLocations,
    setItemLocations,
  ] = useState<
    Record<
      string,
      string
    >
  >(
    () =>
      createLocationMap(
        items
      )
  );

  const [
    draggingId,
    setDraggingId,
  ] = useState<
    string | null
  >(null);

  const [
    dragOverColumnId,
    setDragOverColumnId,
  ] = useState<
    string | null
  >(null);

  /*
   * Synchronize externally changed items.
   */
  useEffect(() => {
    setItemLocations(
      (current) => {
        const next =
          {
            ...current,
          };

        const incomingIds =
          new Set<string>();

        items.forEach(
          (item) => {
            incomingIds.add(
              item.id
            );

            if (
              next[item.id] ===
              undefined
            ) {
              next[item.id] =
                item.columnId;
            }

            /*
             * When optimistic mode is off,
             * props are always authoritative.
             */
            if (
              !optimisticMove
            ) {
              next[item.id] =
                item.columnId;
            }
          }
        );

        Object.keys(
          next
        ).forEach(
          (id) => {
            if (
              !incomingIds.has(
                id
              )
            ) {
              delete next[id];
            }
          }
        );

        return next;
      }
    );
  }, [
    items,
    optimisticMove,
  ]);

  const itemsByColumn =
    useMemo(
      () => {
        const map =
          new Map<
            string,
            KanbanItem[]
          >();

        columns.forEach(
          (column) => {
            map.set(
              column.id,
              []
            );
          }
        );

        items.forEach(
          (item) => {
            const columnId =
              itemLocations[
                item.id
              ] ??
              item.columnId;

            const list =
              map.get(
                columnId
              );

            if (list) {
              list.push(
                item
              );
            }
          }
        );

        return map;
      },
      [
        columns,
        items,
        itemLocations,
      ]
    );

  const beginDrag = (
    event:
      React.DragEvent,
    item: KanbanItem,
    columnId: string,
    index: number
  ) => {
    if (
      !draggable ||
      item.disabled
    ) {
      event.preventDefault();

      return;
    }

    dragStateRef.current =
      {
        itemId:
          item.id,

        fromColumnId:
          columnId,

        fromIndex:
          index,
      };

    setDraggingId(
      item.id
    );

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      item.id
    );
  };

  const endDrag =
    () => {
      dragStateRef.current =
        null;

      setDraggingId(
        null
      );

      setDragOverColumnId(
        null
      );
    };

  const dropIntoColumn = (
    event:
      React.DragEvent,
    column:
      KanbanColumn
  ) => {
    event.preventDefault();

    const drag =
      dragStateRef.current;

    if (
      !drag ||
      column.disabled
    ) {
      endDrag();

      return;
    }

    const item =
      items.find(
        (entry) =>
          entry.id ===
          drag.itemId
      );

    if (
      !item ||
      item.disabled
    ) {
      endDrag();

      return;
    }

    const targetItems =
      itemsByColumn.get(
        column.id
      ) ?? [];

    const toIndex =
      targetItems.filter(
        (entry) =>
          entry.id !==
          item.id
      ).length;

    const fromColumnId =
      drag.fromColumnId;

    if (
      optimisticMove
    ) {
      setItemLocations(
        (previous) => ({
          ...previous,

          [item.id]:
            column.id,
        })
      );
    }

    onItemMove?.(
      item,
      fromColumnId,
      column.id,
      drag.fromIndex,
      toIndex
    );

    endDrag();
  };

  if (
    columns.length === 0
  ) {
    return (
      <div
        className={
          className
        }
        {...customAttributes}
        {...props}
        style={{
          width:
            "100%",

          minHeight:
            160,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          padding:
            16,

          border:
            "1px dashed #d1d5db",

          borderRadius:
            10,

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

              column: null,

              columnIndex:
                0,

              dragging:
                false,
            })
          : emptyText}
      </div>
    );
  }

  return (
    <div
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        position:
          "relative",

        display:
          "flex",

        alignItems:
          "flex-start",

        gap:
          Math.max(
            0,
            columnGap
          ),

        width:
          "100%",

        overflowX:
          "auto",

        overflowY:
          "hidden",

        paddingBottom:
          4,

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {columns.map(
        (
          column,
          columnIndex
        ) => {
          const columnItems =
            itemsByColumn.get(
              column.id
            ) ?? [];

          const dragOver =
            dragOverColumnId ===
            column.id;

          return (
            <section
              key={
                column.id
              }
              className={
                columnClassName
              }
              style={{
                display:
                  "flex",

                flexDirection:
                  "column",

                flex:
                  `0 0 ${Math.max(
                    minColumnWidth,
                    columnWidth
                  )}px`,

                minWidth:
                  Math.max(
                    160,
                    minColumnWidth
                  ),

                maxWidth:
                  Math.max(
                    minColumnWidth,
                    columnWidth
                  ),

                overflow:
                  "hidden",

                border:
                  dragOver
                    ? "1px solid #93c5fd"
                    : "1px solid #e5e7eb",

                borderRadius:
                  12,

                background:
                  dragOver
                    ? "#f8fbff"
                    : "#f9fafb",

                opacity:
                  column.disabled
                    ? 0.55
                    : 1,

                boxSizing:
                  "border-box",

                transition:
                  "border-color 120ms ease, background 120ms ease",
              }}
            >
              {/* Column header */}
              <button
                type="button"
                disabled={
                  column.disabled
                }
                className={
                  columnHeaderClassName
                }
                onClick={() => {
                  if (
                    column.disabled
                  ) {
                    return;
                  }

                  onColumnClick?.(
                    column,
                    columnIndex
                  );
                }}
                style={{
                  display:
                    "flex",

                  alignItems:
                    "flex-start",

                  justifyContent:
                    "space-between",

                  gap: 10,

                  width:
                    "100%",

                  padding:
                    "13px 14px",

                  border: 0,

                  borderBottom:
                    "1px solid #e5e7eb",

                  background:
                    "#ffffff",

                  color:
                    "#111827",

                  textAlign:
                    "left",

                  cursor:
                    column.disabled
                      ? "default"
                      : onColumnClick
                        ? "pointer"
                        : "default",

                  boxSizing:
                    "border-box",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "flex-start",

                    gap: 9,

                    minWidth:
                      0,

                    flex: 1,
                  }}
                >
                  {column.color && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: 9,

                        height: 9,

                        marginTop:
                          5,

                        borderRadius:
                          "50%",

                        background:
                          column.color,

                        flexShrink:
                          0,
                      }}
                    />
                  )}

                  <div
                    style={{
                      minWidth:
                        0,

                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        color:
                          "#111827",

                        fontSize:
                          13,

                        fontWeight:
                          700,

                        lineHeight:
                          1.4,

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        column.title
                      }
                    </div>

                    {showColumnDescription &&
                      column.description && (
                        <div
                          style={{
                            marginTop:
                              2,

                            color:
                              "#9ca3af",

                            fontSize:
                              11,

                            lineHeight:
                              1.4,
                          }}
                        >
                          {
                            column.description
                          }
                        </div>
                      )}
                  </div>
                </div>

                {showCount && (
                  <span
                    style={{
                      minWidth:
                        22,

                      height:
                        22,

                      padding:
                        "0 6px",

                      display:
                        "inline-flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      borderRadius:
                        999,

                      background:
                        "#f3f4f6",

                      color:
                        "#6b7280",

                      fontSize:
                        10,

                      fontWeight:
                        700,

                      flexShrink:
                        0,

                      boxSizing:
                        "border-box",
                    }}
                  >
                    {
                      columnItems.length
                    }
                  </span>
                )}
              </button>

              {/* Column body */}
              <div
                className={
                  columnBodyClassName
                }
                onDragEnter={(
                  event
                ) => {
                  if (
                    !draggable ||
                    column.disabled
                  ) {
                    return;
                  }

                  event.preventDefault();

                  setDragOverColumnId(
                    column.id
                  );
                }}
                onDragOver={(
                  event
                ) => {
                  if (
                    !draggable ||
                    column.disabled
                  ) {
                    return;
                  }

                  event.preventDefault();

                  event.dataTransfer.dropEffect =
                    "move";

                  setDragOverColumnId(
                    column.id
                  );
                }}
                onDragLeave={(
                  event
                ) => {
                  const nextTarget =
                    event.relatedTarget as
                      | Node
                      | null;

                  if (
                    nextTarget &&
                    event.currentTarget.contains(
                      nextTarget
                    )
                  ) {
                    return;
                  }

                  if (
                    dragOverColumnId ===
                    column.id
                  ) {
                    setDragOverColumnId(
                      null
                    );
                  }
                }}
                onDrop={(
                  event
                ) =>
                  dropIntoColumn(
                    event,
                    column
                  )
                }
                style={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap:
                    Math.max(
                      0,
                      cardGap
                    ),

                  minHeight:
                    Math.max(
                      80,
                      minColumnHeight
                    ),

                  padding:
                    10,

                  boxSizing:
                    "border-box",
                }}
              >
                {columnItems.length ===
                0 ? (
                  <div
                    style={{
                      minHeight:
                        80,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      padding:
                        12,

                      border:
                        "1px dashed #d1d5db",

                      borderRadius:
                        8,

                      color:
                        "#9ca3af",

                      fontSize:
                        11,

                      textAlign:
                        "center",

                      boxSizing:
                        "border-box",
                    }}
                  >
                    {
                      emptyColumnText
                    }
                  </div>
                ) : (
                  columnItems.map(
                    (
                      item,
                      index
                    ) => {
                      const dragging =
                        draggingId ===
                        item.id;

                      const context:
                        KanbanRenderContext =
                        {
                          item,

                          index,

                          column,

                          columnIndex,

                          dragging,
                        };

                      return (
                        <div
                          key={
                            item.id
                          }
                          draggable={
                            draggable &&
                            !item.disabled &&
                            !column.disabled
                          }
                          className={`${itemClassName} ${
                            dragging
                              ? draggingItemClassName
                              : ""
                          }`}
                          onDragStart={(
                            event
                          ) =>
                            beginDrag(
                              event,
                              item,
                              column.id,
                              index
                            )
                          }
                          onDragEnd={
                            endDrag
                          }
                          onClick={() => {
                            if (
                              item.disabled
                            ) {
                              return;
                            }

                            onItemClick?.(
                              item,
                              index,
                              column
                            );
                          }}
                          style={{
                            position:
                              "relative",

                            display:
                              "flex",

                            alignItems:
                              "flex-start",

                            gap: 9,

                            width:
                              "100%",

                            padding:
                              "11px 12px",

                            border:
                              "1px solid #e5e7eb",

                            borderRadius:
                              9,

                            background:
                              "#ffffff",

                            boxShadow:
                              "0 1px 2px rgba(15,23,42,0.04)",

                            opacity:
                              dragging
                                ? 0.45
                                : item.disabled
                                  ? 0.55
                                  : 1,

                            cursor:
                              item.disabled
                                ? "not-allowed"
                                : onItemClick
                                  ? "pointer"
                                  : "default",

                            boxSizing:
                              "border-box",
                          }}
                        >
                          {showDragHandle &&
                            draggable && (
                              <span
                                aria-hidden="true"
                                style={{
                                  width:
                                    16,

                                  minWidth:
                                    16,

                                  display:
                                    "inline-flex",

                                  justifyContent:
                                    "center",

                                  paddingTop:
                                    1,

                                  color:
                                    "#9ca3af",

                                  cursor:
                                    item.disabled
                                      ? "not-allowed"
                                      : "grab",
                                }}
                              >
                                <GripVertical
                                  size={
                                    15
                                  }
                                />
                              </span>
                            )}

                          <div
                            style={{
                              minWidth:
                                0,

                              flex: 1,
                            }}
                          >
                            {typeof children ===
                            "function" ? (
                              children(
                                context
                              )
                            ) : children ? (
                              children
                            ) : (
                              <>
                                <div
                                  style={{
                                    color:
                                      "#111827",

                                    fontSize:
                                      13,

                                    fontWeight:
                                      600,

                                    lineHeight:
                                      1.4,

                                    wordBreak:
                                      "break-word",
                                  }}
                                >
                                  {
                                    item.title
                                  }
                                </div>

                                {item.description && (
                                  <div
                                    style={{
                                      marginTop:
                                        4,

                                      color:
                                        "#6b7280",

                                      fontSize:
                                        11,

                                      lineHeight:
                                        1.5,

                                      wordBreak:
                                        "break-word",
                                    }}
                                  >
                                    {
                                      item.description
                                    }
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </section>
          );
        }
      )}
    </div>
  );
}