import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type SplitPaneDirection =
  | "horizontal"
  | "vertical";

export interface SplitPaneItem {
  id: string;

  /**
   * Initial percentage.
   */
  defaultSize?: number;

  /**
   * Minimum percentage.
   */
  minSize?: number;

  /**
   * Maximum percentage.
   */
  maxSize?: number;

  /**
   * Allow collapsing.
   */
  collapsible?: boolean;

  /**
   * Percentage when collapsed.
   */
  collapsedSize?: number;

  disabled?: boolean;

  data?: any;
}

export interface SplitPaneRenderContext {
  item: SplitPaneItem | null;

  index: number;

  size: number;

  collapsed: boolean;

  collapse: () => void;

  expand: () => void;

  toggle: () => void;
}

export interface SplitPaneProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "defaultSize":{"type":"number"},
   *       "minSize":{"type":"number"},
   *       "maxSize":{"type":"number"},
   *       "collapsible":{"type":"boolean"},
   *       "collapsedSize":{"type":"number"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: SplitPaneItem[];

  /**
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: SplitPaneRenderContext
      ) => React.ReactNode);

  /**
   * Controlled percentage sizes.
   *
   * @type|json
   */
  sizes?: number[];

  /**
   * Initial percentage sizes.
   *
   * @type|json
   */
  defaultSizes?: number[];

  /**
   * @select|horizontal|vertical
   */
  direction?: SplitPaneDirection;

  /**
   * Resize handle thickness.
   */
  handleSize?: number;

  resizable?: boolean;

  collapseOnDoubleClick?: boolean;

  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  paneClassName?: string;

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
  onSizesChange?: (
    sizes: number[]
  ) => void;

  /**
   * @type|function
   */
  onResizeStart?: (
    handleIndex: number
  ) => void;

  /**
   * @type|function
   */
  onResizeEnd?: (
    sizes: number[],
    handleIndex: number
  ) => void;

  /**
   * @type|function
   */
  onCollapseChange?: (
    item: SplitPaneItem,
    index: number,
    collapsed: boolean
  ) => void;
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}

function normalizeSizes(
  values: number[]
) {
  if (
    values.length === 0
  ) {
    return [];
  }

  const sanitized =
    values.map(
      (value) =>
        Math.max(
          0,
          Number(value) || 0
        )
    );

  const total =
    sanitized.reduce(
      (
        sum,
        value
      ) =>
        sum +
        value,
      0
    );

  if (
    total <= 0
  ) {
    return sanitized.map(
      () =>
        100 /
        sanitized.length
    );
  }

  return sanitized.map(
    (value) =>
      (
        value /
        total
      ) *
      100
  );
}

function createInitialSizes(
  items: SplitPaneItem[],
  defaultSizes?: number[]
) {
  if (
    items.length === 0
  ) {
    return [];
  }

  if (
    defaultSizes &&
    defaultSizes.length ===
      items.length
  ) {
    return normalizeSizes(
      defaultSizes
    );
  }

  const definedTotal =
    items.reduce(
      (
        total,
        item
      ) => {
        if (
          typeof item.defaultSize ===
          "number"
        ) {
          return (
            total +
            item.defaultSize
          );
        }

        return total;
      },
      0
    );

  const missingCount =
    items.filter(
      (item) =>
        typeof item.defaultSize !==
        "number"
    ).length;

  const remaining =
    Math.max(
      0,
      100 -
        definedTotal
    );

  const fallback =
    missingCount > 0
      ? remaining /
        missingCount
      : 0;

  return normalizeSizes(
    items.map(
      (item) =>
        typeof item.defaultSize ===
        "number"
          ? item.defaultSize
          : fallback
    )
  );
}

export default function SplitPane({
  items = [],

  children,

  sizes,

  defaultSizes,

  direction = "horizontal",

  handleSize = 8,

  resizable = true,

  collapseOnDoubleClick = true,

  emptyText = "Add split panes",

  className = "w-full",

  paneClassName = "",

  handleClassName = "",

  customAttributes = {},

  onSizesChange,

  onResizeStart,

  onResizeEnd,

  onCollapseChange,

  style,

  ...props
}: SplitPaneProps) {
  const containerRef =
    useRef<HTMLDivElement>(
      null
    );

  /*
   * Latest sizes are also kept in a ref
   * because pointerup handlers otherwise
   * see stale React state.
   */
  const latestSizesRef =
    useRef<number[]>(
      []
    );

  const previousSizeRef =
    useRef<
      Record<
        string,
        number
      >
    >({});

  const [
    internalSizes,
    setInternalSizes,
  ] = useState<number[]>(
    () =>
      createInitialSizes(
        items,
        defaultSizes
      )
  );

  const [
    collapsedIds,
    setCollapsedIds,
  ] = useState<
    Set<string>
  >(
    () =>
      new Set()
  );

  const controlled =
    sizes !== undefined;

  const resolvedSizes =
    useMemo(
      () => {
        const source =
          controlled
            ? sizes ?? []
            : internalSizes;

        if (
          source.length !==
          items.length
        ) {
          return createInitialSizes(
            items,
            defaultSizes
          );
        }

        return source;
      },
      [
        controlled,
        sizes,
        internalSizes,
        items,
        defaultSizes,
      ]
    );

  useEffect(() => {
    latestSizesRef.current =
      resolvedSizes;
  }, [
    resolvedSizes,
  ]);

  /*
   * Rebuild sizes when pane count changes.
   */
  useEffect(() => {
    if (
      controlled
    ) {
      return;
    }

    if (
      internalSizes.length !==
      items.length
    ) {
      const next =
        createInitialSizes(
          items,
          defaultSizes
        );

      latestSizesRef.current =
        next;

      setInternalSizes(
        next
      );
    }
  }, [
    items,
    defaultSizes,
    controlled,
    internalSizes.length,
  ]);

  const updateSizes = (
    next: number[]
  ) => {
    const normalized =
      normalizeSizes(
        next
      );

    latestSizesRef.current =
      normalized;

    if (!controlled) {
      setInternalSizes(
        normalized
      );
    }

    onSizesChange?.(
      normalized
    );
  };

  const collapsePane = (
    item: SplitPaneItem,
    index: number
  ) => {
    if (
      !item.collapsible ||
      collapsedIds.has(
        item.id
      )
    ) {
      return;
    }

    const current =
      latestSizesRef.current.length
        ? [
            ...latestSizesRef.current,
          ]
        : [
            ...resolvedSizes,
          ];

    const currentSize =
      current[index] ??
      0;

    const collapsedSize =
      Math.max(
        0,
        item.collapsedSize ??
          0
      );

    if (
      currentSize <=
      collapsedSize
    ) {
      return;
    }

    previousSizeRef.current[
      item.id
    ] =
      currentSize;

    /*
     * Give released space to the closest
     * neighboring pane.
     */
    const recipientIndex =
      index <
      items.length - 1
        ? index + 1
        : index - 1;

    if (
      recipientIndex < 0
    ) {
      return;
    }

    const released =
      currentSize -
      collapsedSize;

    current[index] =
      collapsedSize;

    current[
      recipientIndex
    ] =
      (
        current[
          recipientIndex
        ] ?? 0
      ) +
      released;

    setCollapsedIds(
      (previous) => {
        const next =
          new Set(
            previous
          );

        next.add(
          item.id
        );

        return next;
      }
    );

    updateSizes(
      current
    );

    onCollapseChange?.(
      item,
      index,
      true
    );
  };

  const expandPane = (
    item: SplitPaneItem,
    index: number
  ) => {
    if (
      !item.collapsible ||
      !collapsedIds.has(
        item.id
      )
    ) {
      return;
    }

    const current =
      latestSizesRef.current.length
        ? [
            ...latestSizesRef.current,
          ]
        : [
            ...resolvedSizes,
          ];

    const collapsedSize =
      Math.max(
        0,
        item.collapsedSize ??
          0
      );

    const desiredSize =
      previousSizeRef.current[
        item.id
      ] ??
      item.defaultSize ??
      20;

    const donorIndex =
      index <
      items.length - 1
        ? index + 1
        : index - 1;

    if (
      donorIndex < 0
    ) {
      return;
    }

    const donor =
      items[
        donorIndex
      ];

    const donorCurrent =
      current[
        donorIndex
      ] ?? 0;

    const donorMin =
      Math.max(
        0,
        donor.minSize ??
          0
      );

    const available =
      Math.max(
        0,
        donorCurrent -
          donorMin
      );

    const required =
      Math.max(
        0,
        desiredSize -
          collapsedSize
      );

    const restored =
      Math.min(
        required,
        available
      );

    current[index] =
      collapsedSize +
      restored;

    current[
      donorIndex
    ] =
      donorCurrent -
      restored;

    setCollapsedIds(
      (previous) => {
        const next =
          new Set(
            previous
          );

        next.delete(
          item.id
        );

        return next;
      }
    );

    updateSizes(
      current
    );

    onCollapseChange?.(
      item,
      index,
      false
    );
  };

  const togglePane = (
    item: SplitPaneItem,
    index: number
  ) => {
    if (
      collapsedIds.has(
        item.id
      )
    ) {
      expandPane(
        item,
        index
      );
    } else {
      collapsePane(
        item,
        index
      );
    }
  };

  const startResize = (
    event:
      React.PointerEvent<HTMLDivElement>,
    handleIndex: number
  ) => {
    if (
      !resizable
    ) {
      return;
    }

    const firstItem =
      items[
        handleIndex
      ];

    const secondItem =
      items[
        handleIndex +
          1
      ];

    if (
      !firstItem ||
      !secondItem ||
      firstItem.disabled ||
      secondItem.disabled
    ) {
      return;
    }

    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    event.preventDefault();

    const rect =
      container.getBoundingClientRect();

    /*
     * Handles consume real pixels.
     *
     * Only the remaining area belongs
     * to the panes.
     */
    const containerMainSize =
      direction ===
      "horizontal"
        ? rect.width
        : rect.height;

    const totalHandleSize =
      Math.max(
        0,
        items.length - 1
      ) *
      Math.max(
        1,
        handleSize
      );

    const paneAreaSize =
      containerMainSize -
      totalHandleSize;

    if (
      paneAreaSize <= 0
    ) {
      return;
    }

    const startPointer =
      direction ===
      "horizontal"
        ? event.clientX
        : event.clientY;

    const startSizes =
      [
        ...latestSizesRef.current,
      ];

    if (
      startSizes.length !==
      items.length
    ) {
      return;
    }

    const firstStart =
      startSizes[
        handleIndex
      ];

    const secondStart =
      startSizes[
        handleIndex +
          1
      ];

    const pairTotal =
      firstStart +
      secondStart;

    /*
     * Only these two panes change.
     * Every other pane remains untouched.
     */
    const firstMin =
      Math.max(
        0,
        firstItem.minSize ??
          0
      );

    const firstMax =
      Math.min(
        pairTotal,
        firstItem.maxSize ??
          pairTotal
      );

    const secondMin =
      Math.max(
        0,
        secondItem.minSize ??
          0
      );

    const secondMax =
      Math.min(
        pairTotal,
        secondItem.maxSize ??
          pairTotal
      );

    /*
     * Constraints for first pane also
     * need to respect second pane.
     */
    const minimumFirst =
      Math.max(
        firstMin,
        pairTotal -
          secondMax
      );

    const maximumFirst =
      Math.min(
        firstMax,
        pairTotal -
          secondMin
      );

    onResizeStart?.(
      handleIndex
    );

    const previousCursor =
      document.body.style
        .cursor;

    const previousUserSelect =
      document.body.style
        .userSelect;

    document.body.style.cursor =
      direction ===
      "horizontal"
        ? "col-resize"
        : "row-resize";

    document.body.style.userSelect =
      "none";

    const handlePointerMove =
      (
        moveEvent:
          PointerEvent
      ) => {
        const currentPointer =
          direction ===
          "horizontal"
            ? moveEvent.clientX
            : moveEvent.clientY;

        const deltaPixels =
          currentPointer -
          startPointer;

        const deltaPercent =
          (
            deltaPixels /
            paneAreaSize
          ) *
          100;

        const nextFirst =
          clamp(
            firstStart +
              deltaPercent,
            minimumFirst,
            maximumFirst
          );

        const nextSecond =
          pairTotal -
          nextFirst;

        const next =
          [
            ...startSizes,
          ];

        next[
          handleIndex
        ] =
          nextFirst;

        next[
          handleIndex +
            1
        ] =
          nextSecond;

        /*
         * Dragging a collapsed pane open
         * removes its collapsed state.
         */
        const firstCollapsedSize =
          firstItem.collapsedSize ??
          0;

        const secondCollapsedSize =
          secondItem.collapsedSize ??
          0;

        setCollapsedIds(
          (previous) => {
            let changed =
              false;

            const result =
              new Set(
                previous
              );

            if (
              result.has(
                firstItem.id
              ) &&
              nextFirst >
                firstCollapsedSize +
                  0.1
            ) {
              result.delete(
                firstItem.id
              );

              changed =
                true;
            }

            if (
              result.has(
                secondItem.id
              ) &&
              nextSecond >
                secondCollapsedSize +
                  0.1
            ) {
              result.delete(
                secondItem.id
              );

              changed =
                true;
            }

            return changed
              ? result
              : previous;
          }
        );

        updateSizes(
          next
        );
      };

    const handlePointerUp =
      () => {
        window.removeEventListener(
          "pointermove",
          handlePointerMove
        );

        window.removeEventListener(
          "pointerup",
          handlePointerUp
        );

        window.removeEventListener(
          "pointercancel",
          handlePointerUp
        );

        document.body.style.cursor =
          previousCursor;

        document.body.style.userSelect =
          previousUserSelect;

        onResizeEnd?.(
          [
            ...latestSizesRef.current,
          ],
          handleIndex
        );
      };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    window.addEventListener(
      "pointercancel",
      handlePointerUp
    );
  };

  if (
    items.length === 0
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
            140,

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
              size: 100,
              collapsed:
                false,
              collapse:
                () => {},
              expand:
                () => {},
              toggle:
                () => {},
            })
          : emptyText}
      </div>
    );
  }

  return (
    <div
      ref={
        containerRef
      }
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

        flexDirection:
          direction ===
          "horizontal"
            ? "row"
            : "column",

        width:
          "100%",

        height:
          "100%",

        minWidth: 0,

        minHeight: 0,

        overflow:
          "hidden",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {items.map(
        (
          item,
          index
        ) => {
          const size =
            resolvedSizes[
              index
            ] ?? 0;

          const collapsed =
            collapsedIds.has(
              item.id
            );

          const context:
            SplitPaneRenderContext =
            {
              item,
              index,
              size,
              collapsed,

              collapse:
                () =>
                  collapsePane(
                    item,
                    index
                  ),

              expand:
                () =>
                  expandPane(
                    item,
                    index
                  ),

              toggle:
                () =>
                  togglePane(
                    item,
                    index
                  ),
            };

          return (
            <React.Fragment
              key={
                item.id
              }
            >
              {/*
               * Important:
               *
               * flex-grow uses our percentage
               * as a relative weight.
               *
               * Because flex-basis is 0,
               * Flexbox first removes the
               * fixed-width handles and then
               * distributes the remaining
               * area among panes.
               */}
              <div
                className={
                  paneClassName
                }
                data-pane-id={
                  item.id
                }
                data-collapsed={
                  collapsed
                    ? "true"
                    : "false"
                }
                style={{
                  position:
                    "relative",

                  flexGrow:
                    Math.max(
                      0,
                      size
                    ),

                  flexShrink:
                    1,

                  flexBasis:
                    0,

                  minWidth:
                    direction ===
                    "horizontal"
                      ? 0
                      : "100%",

                  minHeight:
                    direction ===
                    "vertical"
                      ? 0
                      : "100%",

                  width:
                    direction ===
                    "vertical"
                      ? "100%"
                      : undefined,

                  height:
                    direction ===
                    "horizontal"
                      ? "100%"
                      : undefined,

                  overflow:
                    collapsed
                      ? "hidden"
                      : "auto",

                  boxSizing:
                    "border-box",
                }}
              >
                {typeof children ===
                "function"
                  ? children(
                      context
                    )
                  : children}
              </div>

              {index <
                items.length -
                  1 && (
                <div
                  role="separator"
                  aria-orientation={
                    direction ===
                    "horizontal"
                      ? "vertical"
                      : "horizontal"
                  }
                  tabIndex={
                    resizable
                      ? 0
                      : -1
                  }
                  className={
                    handleClassName
                  }
                  onPointerDown={(
                    event
                  ) =>
                    startResize(
                      event,
                      index
                    )
                  }
                  onDoubleClick={() => {
                    if (
                      !collapseOnDoubleClick
                    ) {
                      return;
                    }

                    togglePane(
                      item,
                      index
                    );
                  }}
                  style={{
                    position:
                      "relative",

                    flex:
                      `0 0 ${Math.max(
                        1,
                        handleSize
                      )}px`,

                    width:
                      direction ===
                      "horizontal"
                        ? Math.max(
                            1,
                            handleSize
                          )
                        : "100%",

                    height:
                      direction ===
                      "vertical"
                        ? Math.max(
                            1,
                            handleSize
                          )
                        : "100%",

                    background:
                      "transparent",

                    cursor:
                      resizable &&
                      !item.disabled &&
                      !items[
                        index + 1
                      ]?.disabled
                        ? direction ===
                          "horizontal"
                          ? "col-resize"
                          : "row-resize"
                        : "default",

                    touchAction:
                      "none",

                    userSelect:
                      "none",

                    flexShrink:
                      0,

                    zIndex:
                      10,

                    boxSizing:
                      "border-box",
                  }}
                >
                  {/*
                   * Visible center line.
                   *
                   * Handle itself is wider
                   * for easier dragging.
                   */}
                  <div
                    aria-hidden="true"
                    style={{
                      position:
                        "absolute",

                      borderRadius:
                        999,

                      background:
                        "#d1d5db",

                      pointerEvents:
                        "none",

                      ...(direction ===
                      "horizontal"
                        ? {
                            top: 0,
                            bottom:
                              0,
                            left:
                              "50%",

                            width:
                              1,

                            transform:
                              "translateX(-50%)",
                          }
                        : {
                            left: 0,
                            right:
                              0,
                            top:
                              "50%",

                            height:
                              1,

                            transform:
                              "translateY(-50%)",
                          }),
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        }
      )}
    </div>
  );
}