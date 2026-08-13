import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GripVertical,
} from "lucide-react";

export interface ReorderListItem {
  id: string;

  label?: string;

  disabled?: boolean;

  data?: any;
}

export interface ReorderListRenderContext {
  item: ReorderListItem | null;

  index: number;

  dragging: boolean;

  dragOver: boolean;
}

export interface ReorderListProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Reorderable items.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "label":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: ReorderListItem[];

  /**
   * Custom item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: ReorderListRenderContext
      ) => React.ReactNode);

  /**
   * @select|vertical|horizontal
   */
  orientation?:
    | "vertical"
    | "horizontal";

  /**
   * Enable drag and drop.
   */
  draggable?: boolean;

  /**
   * Immediately update the visible
   * order after dragging.
   *
   * Useful for static Rudra JSON.
   */
  optimisticReorder?: boolean;

  /**
   * Show the default drag handle.
   */
  showDragHandle?: boolean;

  /**
   * Space between items.
   */
  gap?: number;

  /**
   * @select|start|center|end|stretch
   */
  align?:
    | "start"
    | "center"
    | "end"
    | "stretch";

  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  itemClassName?: string;

  /**
   * @type|class
   */
  draggingItemClassName?: string;

  /**
   * @type|class
   */
  dragOverItemClassName?: string;

  /**
   * @type|class
   */
  handleClassName?: string;

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
    item: ReorderListItem,
    index: number
  ) => void;

  /**
   * Fired after an item changes position.
   *
   * @type|function
   */
  onReorder?: (
    items: ReorderListItem[],
    fromIndex: number,
    toIndex: number,
    movedItem: ReorderListItem
  ) => void;

  /**
   * @type|function
   */
  onDragStart?: (
    item: ReorderListItem,
    index: number
  ) => void;

  /**
   * @type|function
   */
  onDragEnd?: (
    item: ReorderListItem,
    index: number
  ) => void;
}

function reorderItems(
  items: ReorderListItem[],
  fromIndex: number,
  toIndex: number
) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return [...items];
  }

  const next = [
    ...items,
  ];

  const [removed] =
    next.splice(
      fromIndex,
      1
    );

  next.splice(
    toIndex,
    0,
    removed
  );

  return next;
}

function getAlignItems(
  align:
    | "start"
    | "center"
    | "end"
    | "stretch"
) {
  switch (align) {
    case "center":
      return "center";

    case "end":
      return "flex-end";

    case "stretch":
      return "stretch";

    case "start":
    default:
      return "flex-start";
  }
}

export default function ReorderList({
  items = [],

  children,

  orientation = "vertical",

  draggable = true,

  optimisticReorder = true,

  showDragHandle = true,

  gap = 8,

  align = "stretch",

  emptyText = "Add reorderable items",

  className = "w-full",

  itemClassName = "",

  draggingItemClassName = "",

  dragOverItemClassName = "",

  handleClassName = "",

  customAttributes = {},

  onItemClick,

  onReorder,

  onDragStart,

  onDragEnd,

  style,

  ...props
}: ReorderListProps) {
  const [
    internalItems,
    setInternalItems,
  ] = useState<
    ReorderListItem[]
  >(
    items
  );

  const [
    draggingId,
    setDraggingId,
  ] = useState<
    string | null
  >(null);

  const [
    dragOverId,
    setDragOverId,
  ] = useState<
    string | null
  >(null);

  const [
    dragFromIndex,
    setDragFromIndex,
  ] = useState<
    number | null
  >(null);

  /*
   * When optimistic mode is disabled,
   * props always control the order.
   *
   * When enabled, preserve the local
   * order but synchronize added/removed
   * items from props.
   */
  useEffect(() => {
    if (
      !optimisticReorder
    ) {
      setInternalItems(
        items
      );

      return;
    }

    setInternalItems(
      (current) => {
        const incomingMap =
          new Map(
            items.map(
              (item) => [
                item.id,
                item,
              ]
            )
          );

        const next =
          current
            .filter(
              (item) =>
                incomingMap.has(
                  item.id
                )
            )
            .map(
              (item) =>
                incomingMap.get(
                  item.id
                )!
            );

        const currentIds =
          new Set(
            next.map(
              (item) =>
                item.id
            )
          );

        items.forEach(
          (item) => {
            if (
              !currentIds.has(
                item.id
              )
            ) {
              next.push(
                item
              );
            }
          }
        );

        return next;
      }
    );
  }, [
    items,
    optimisticReorder,
  ]);

  const renderedItems =
    optimisticReorder
      ? internalItems
      : items;

  const horizontal =
    orientation ===
    "horizontal";

  const draggingIndex =
    useMemo(
      () =>
        draggingId
          ? renderedItems.findIndex(
              (item) =>
                item.id ===
                draggingId
            )
          : -1,
      [
        draggingId,
        renderedItems,
      ]
    );

  const beginDrag = (
    event:
      React.DragEvent<HTMLDivElement>,
    item: ReorderListItem,
    index: number
  ) => {
    if (
      !draggable ||
      item.disabled
    ) {
      event.preventDefault();

      return;
    }

    setDraggingId(
      item.id
    );

    setDragFromIndex(
      index
    );

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      item.id
    );

    onDragStart?.(
      item,
      index
    );
  };

  const finishDrag = (
    item?: ReorderListItem
  ) => {
    if (
      item &&
      dragFromIndex !==
        null
    ) {
      onDragEnd?.(
        item,
        dragFromIndex
      );
    }

    setDraggingId(
      null
    );

    setDragOverId(
      null
    );

    setDragFromIndex(
      null
    );
  };

  const handleDrop = (
    event:
      React.DragEvent<HTMLDivElement>,
    targetItem: ReorderListItem,
    targetIndex: number
  ) => {
    event.preventDefault();

    if (
      targetItem.disabled ||
      draggingIndex < 0 ||
      draggingIndex ===
        targetIndex
    ) {
      finishDrag(
        renderedItems[
          draggingIndex
        ]
      );

      return;
    }

    const movedItem =
      renderedItems[
        draggingIndex
      ];

    if (
      !movedItem ||
      movedItem.disabled
    ) {
      finishDrag(
        movedItem
      );

      return;
    }

    const next =
      reorderItems(
        renderedItems,
        draggingIndex,
        targetIndex
      );

    if (
      optimisticReorder
    ) {
      setInternalItems(
        next
      );
    }

    onReorder?.(
      next,
      draggingIndex,
      targetIndex,
      movedItem
    );

    finishDrag(
      movedItem
    );
  };

  if (
    renderedItems.length ===
    0
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
            100,

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
              dragging:
                false,
              dragOver:
                false,
            })
          : emptyText}
      </div>
    );
  }

  return (
    <div
      role="list"
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        display:
          "flex",

        flexDirection:
          horizontal
            ? "row"
            : "column",

        alignItems:
          getAlignItems(
            align
          ),

        gap:
          Math.max(
            0,
            gap
          ),

        width:
          "100%",

        overflowX:
          horizontal
            ? "auto"
            : undefined,

        minWidth: 0,

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {renderedItems.map(
        (
          item,
          index
        ) => {
          const dragging =
            draggingId ===
            item.id;

          const dragOver =
            dragOverId ===
            item.id &&
            !dragging;

          const context:
            ReorderListRenderContext =
            {
              item,
              index,
              dragging,
              dragOver,
            };

          return (
            <div
              key={
                item.id
              }
              role="listitem"
              draggable={
                draggable &&
                !item.disabled
              }
              className={`${itemClassName} ${
                dragging
                  ? draggingItemClassName
                  : ""
              } ${
                dragOver
                  ? dragOverItemClassName
                  : ""
              }`}
              onDragStart={(
                event
              ) =>
                beginDrag(
                  event,
                  item,
                  index
                )
              }
              onDragEnter={(
                event
              ) => {
                if (
                  !draggable ||
                  item.disabled ||
                  draggingId ===
                    item.id
                ) {
                  return;
                }

                event.preventDefault();

                setDragOverId(
                  item.id
                );
              }}
              onDragOver={(
                event
              ) => {
                if (
                  !draggable ||
                  item.disabled
                ) {
                  return;
                }

                event.preventDefault();

                event.dataTransfer.dropEffect =
                  "move";

                setDragOverId(
                  item.id
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
                  dragOverId ===
                  item.id
                ) {
                  setDragOverId(
                    null
                  );
                }
              }}
              onDrop={(
                event
              ) =>
                handleDrop(
                  event,
                  item,
                  index
                )
              }
              onDragEnd={() =>
                finishDrag(
                  item
                )
              }
              onClick={() => {
                if (
                  item.disabled
                ) {
                  return;
                }

                onItemClick?.(
                  item,
                  index
                );
              }}
              style={{
                position:
                  "relative",

                display:
                  "flex",

                alignItems:
                  "center",

                gap: 8,

                width:
                  horizontal
                    ? "auto"
                    : "100%",

                minWidth:
                  horizontal
                    ? 180
                    : 0,

                minHeight:
                  44,

                padding:
                  "8px 10px",

                border:
                  dragOver
                    ? "1px solid #60a5fa"
                    : "1px solid #e5e7eb",

                borderRadius:
                  8,

                background:
                  dragOver
                    ? "#eff6ff"
                    : "#ffffff",

                boxShadow:
                  "0 1px 2px rgba(15,23,42,0.04)",

                opacity:
                  dragging
                    ? 0.4
                    : item.disabled
                      ? 0.5
                      : 1,

                cursor:
                  item.disabled
                    ? "not-allowed"
                    : draggable
                      ? "grab"
                      : onItemClick
                        ? "pointer"
                        : "default",

                userSelect:
                  draggable
                    ? "none"
                    : undefined,

                boxSizing:
                  "border-box",

                transition:
                  "border-color 100ms ease, background 100ms ease, opacity 100ms ease",
              }}
            >
              {showDragHandle &&
                draggable && (
                  <span
                    className={
                      handleClassName
                    }
                    aria-hidden="true"
                    style={{
                      width: 18,

                      height: 24,

                      display:
                        "inline-flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      flexShrink:
                        0,

                      color:
                        "#9ca3af",

                      cursor:
                        item.disabled
                          ? "not-allowed"
                          : "grab",
                    }}
                  >
                    <GripVertical
                      size={16}
                    />
                  </span>
                )}

              <div
                style={{
                  minWidth: 0,

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
                  <div
                    style={{
                      color:
                        "#374151",

                      fontSize:
                        13,

                      fontWeight:
                        500,

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
                    {item.label ??
                      item.id}
                  </div>
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}