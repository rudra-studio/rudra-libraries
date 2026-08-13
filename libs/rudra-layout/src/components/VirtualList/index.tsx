import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface VirtualListRenderContext {
  item: any;

  index: number;
}

export interface VirtualListProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * List data.
   *
   * @type|json
   */
  items?: any[];

  /**
   * Item renderer.
   *
   * @nodeFunction
   */
  children?:
  | React.ReactNode
  | ((
    context: VirtualListRenderContext
  ) => React.ReactNode);

  /**
   * Height of one item in pixels.
   */
  itemHeight?: number;

  /**
   * Visible list height.
   */
  height?: number;

  /**
   * Additional items rendered above
   * and below the viewport.
   */
  overscan?: number;

  /**
   * Gap between rows.
   */
  gap?: number;

  /**
   * Index to scroll to.
   *
   * Updating this prop scrolls
   * the list to that item.
   */
  scrollToIndex?: number;

  /**
   * @select|start|center|end
   */
  scrollAlignment?:
  | "start"
  | "center"
  | "end";

  /**
   * Initial scroll index.
   */
  initialScrollIndex?: number;

  /**
   * Trigger onEndReached when this many
   * items remain below the visible range.
   */
  endReachedThreshold?: number;

  /**
   * Empty builder message.
   */
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
  contentClassName?: string;

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
  onScrollChange?: (
    scrollTop: number
  ) => void;

  /**
   * @type|function
   */
  onVisibleRangeChange?: (
    startIndex: number,
    endIndex: number
  ) => void;

  /**
   * @type|function
   */
  onEndReached?: () => void;

  /**
   * @type|function
   */
  onItemClick?: (
    item: any,
    index: number
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

export default function VirtualList({
  items = [],

  children,

  itemHeight = 56,

  height = 400,

  overscan = 3,

  gap = 0,

  scrollToIndex,

  scrollAlignment = "start",

  initialScrollIndex = 0,

  endReachedThreshold = 3,

  emptyText = "Add list items",

  className = "w-full",

  itemClassName = "",

  contentClassName = "",

  customAttributes = {},

  onScrollChange,

  onVisibleRangeChange,

  onEndReached,

  onItemClick,

  style,

  ...props
}: VirtualListProps) {
  const containerRef =
    useRef<HTMLDivElement>(
      null
    );

  const endReachedRef =
    useRef(false);

  const [
    scrollTop,
    setScrollTop,
  ] = useState(0);

  const safeItemHeight =
    Math.max(
      1,
      itemHeight
    );

  const safeGap =
    Math.max(
      0,
      gap
    );

  const rowHeight =
    safeItemHeight +
    safeGap;

  const totalHeight =
    items.length > 0
      ? items.length *
      rowHeight -
      safeGap
      : 0;

  const visibleCount =
    Math.max(
      1,
      Math.ceil(
        height /
        rowHeight
      )
    );

  const rawStartIndex =
    Math.floor(
      scrollTop /
      rowHeight
    );

  const startIndex =
    clamp(
      rawStartIndex -
      Math.max(
        0,
        overscan
      ),
      0,
      Math.max(
        0,
        items.length - 1
      )
    );

  const endIndex =
    clamp(
      rawStartIndex +
      visibleCount +
      Math.max(
        0,
        overscan
      ),
      0,
      Math.max(
        0,
        items.length - 1
      )
    );

  const visibleItems =
    useMemo(() => {
      if (
        items.length === 0
      ) {
        return [];
      }

      const result: {
        item: any;
        index: number;
      }[] = [];

      for (
        let index =
          startIndex;
        index <=
        endIndex;
        index++
      ) {
        result.push({
          item:
            items[index],

          index,
        });
      }

      return result;
    }, [
      items,
      startIndex,
      endIndex,
    ]);

  const getScrollTopForIndex =
    (
      index: number
    ) => {
      const safeIndex =
        clamp(
          index,
          0,
          Math.max(
            0,
            items.length - 1
          )
        );

      const itemTop =
        safeIndex *
        rowHeight;

      if (
        scrollAlignment ===
        "center"
      ) {
        return Math.max(
          0,
          itemTop -
          height / 2 +
          safeItemHeight /
          2
        );
      }

      if (
        scrollAlignment ===
        "end"
      ) {
        return Math.max(
          0,
          itemTop -
          height +
          safeItemHeight
        );
      }

      return itemTop;
    };

  const scrollTo = (
    index: number,
    behavior:
      ScrollBehavior =
      "auto"
  ) => {
    const container =
      containerRef.current;

    if (
      !container ||
      items.length === 0
    ) {
      return;
    }

    container.scrollTo({
      top:
        getScrollTopForIndex(
          index
        ),

      behavior,
    });
  };

  /*
   * Initial scroll.
   */
  useEffect(() => {
    if (
      items.length === 0 ||
      initialScrollIndex <= 0
    ) {
      return;
    }

    const frame =
      requestAnimationFrame(
        () => {
          scrollTo(
            initialScrollIndex
          );
        }
      );

    return () => {
      cancelAnimationFrame(
        frame
      );
    };
  }, []);

  /*
   * Controlled scroll target.
   */
  useEffect(() => {
    if (
      scrollToIndex ===
      undefined
    ) {
      return;
    }

    scrollTo(
      scrollToIndex,
      "smooth"
    );
  }, [
    scrollToIndex,
    items.length,
    rowHeight,
    height,
    scrollAlignment,
  ]);

  /*
   * Notify visible range.
   */
  useEffect(() => {
    if (
      items.length === 0
    ) {
      return;
    }

    const actualStart =
      clamp(
        rawStartIndex,
        0,
        items.length -
        1
      );

    const actualEnd =
      clamp(
        rawStartIndex +
        visibleCount -
        1,
        0,
        items.length -
        1
      );

    onVisibleRangeChange?.(
      actualStart,
      actualEnd
    );

    const remaining =
      items.length -
      1 -
      actualEnd;

    if (
      remaining <=
      Math.max(
        0,
        endReachedThreshold
      )
    ) {
      if (
        !endReachedRef.current
      ) {
        endReachedRef.current =
          true;

        onEndReached?.();
      }
    } else {
      endReachedRef.current =
        false;
    }
  }, [
    rawStartIndex,
    visibleCount,
    items.length,
    endReachedThreshold,
  ]);

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

          height,

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
      onScroll={(
        event
      ) => {
        const next =
          event.currentTarget
            .scrollTop;

        setScrollTop(
          next
        );

        onScrollChange?.(
          next
        );
      }}
      style={{
        position:
          "relative",

        width:
          "100%",

        height,

        overflowY:
          "auto",

        overflowX:
          "hidden",

        WebkitOverflowScrolling:
          "touch",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {/*
       * Virtual spacer.
       *
       * This represents the height
       * of every item without actually
       * rendering every item.
       */}
      <div
        className={
          contentClassName
        }
        style={{
          position:
            "relative",

          width:
            "100%",

          height:
            totalHeight,

          minHeight:
            totalHeight,

          boxSizing:
            "border-box",
        }}
      >
        {visibleItems.map(
          ({
            item,
            index,
          }) => (
            <div
              key={
                item?.id ??
                index
              }
              className={
                itemClassName
              }
              data-index={
                index
              }
              onClick={() =>
                onItemClick?.(
                  item,
                  index
                )
              }
              style={{
                position:
                  "absolute",

                top:
                  index *
                  rowHeight,

                left: 0,

                right: 0,

                height:
                  safeItemHeight,

                overflow:
                  "hidden",

                boxSizing:
                  "border-box",
              }}
            >
              {typeof children ===
                "function"
                ? children({
                  item,
                  index,
                })
                : children}
            </div>
          )
        )}
      </div>
    </div>
  );
}