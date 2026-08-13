import React, {
  useRef,
  useState,
} from "react";

export type SegmentedControlOrientation =
  | "horizontal"
  | "vertical";

export interface SegmentedControlItem {
  id: string;

  label: string;

  disabled?: boolean;

  data?: any;
}

export interface SegmentedControlRenderContext {
  item: SegmentedControlItem | null;

  index: number;

  active: boolean;

  disabled: boolean;

  select: () => void;
}

export interface SegmentedControlProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className" | "onChange"
  > {
  /**
   * Segmented options.
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
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: SegmentedControlItem[];

  /**
   * Custom segment renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: SegmentedControlRenderContext
      ) => React.ReactNode);

  /**
   * Controlled selected id.
   */
  activeId?: string;

  /**
   * Initial uncontrolled selected id.
   */
  defaultActiveId?: string;

  /**
   * @select|horizontal|vertical
   */
  orientation?: SegmentedControlOrientation;

  /**
   * Make every segment equal width.
   */
  equalWidth?: boolean;

  /**
   * Make control fill available width.
   */
  fullWidth?: boolean;

  /**
   * Allow clicking active option
   * again to clear selection.
   */
  allowDeselect?: boolean;

  disabled?: boolean;

  /**
   * Segment height.
   */
  height?: number;

  /**
   * Space between segments.
   */
  gap?: number;

  /**
   * Root padding.
   */
  padding?: number;

  /**
   * @color
   */
  activeColor?: string;

  /**
   * @color
   */
  activeTextColor?: string;

  /**
   * @color
   */
  inactiveTextColor?: string;

  /**
   * @color
   */
  backgroundColor?: string;

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
  activeItemClassName?: string;

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
  onActiveChange?: (
    id: string | undefined,
    item: SegmentedControlItem | null,
    index: number
  ) => void;

  /**
   * @type|function
   */
  onItemClick?: (
    item: SegmentedControlItem,
    index: number
  ) => void;
}

export default function SegmentedControl({
  items = [],

  children,

  activeId,

  defaultActiveId,

  orientation = "horizontal",

  equalWidth = true,

  fullWidth = true,

  allowDeselect = false,

  disabled = false,

  height = 36,

  gap = 2,

  padding = 3,

  activeColor = "#ffffff",

  activeTextColor = "#111827",

  inactiveTextColor = "#6b7280",

  backgroundColor = "#f3f4f6",

  emptyText = "Add segmented options",

  className = "w-full",

  itemClassName = "",

  activeItemClassName = "",

  customAttributes = {},

  onActiveChange,

  onItemClick,

  style,

  ...props
}: SegmentedControlProps) {
  const buttonRefs =
    useRef<
      Array<
        HTMLButtonElement | null
      >
    >([]);

  const [
    internalActiveId,
    setInternalActiveId,
  ] = useState<
    string | undefined
  >(
    defaultActiveId ??
      items.find(
        (item) =>
          !item.disabled
      )?.id
  );

  const controlled =
    activeId !== undefined;

  const resolvedActiveId =
    controlled
      ? activeId
      : internalActiveId;

  const vertical =
    orientation === "vertical";

  const selectItem = (
    item: SegmentedControlItem,
    index: number
  ) => {
    if (
      disabled ||
      item.disabled
    ) {
      return;
    }

    const alreadyActive =
      item.id ===
      resolvedActiveId;

    const nextId =
      allowDeselect &&
      alreadyActive
        ? undefined
        : item.id;

    if (!controlled) {
      setInternalActiveId(
        nextId
      );
    }

    onActiveChange?.(
      nextId,
      nextId
        ? item
        : null,
      index
    );

    onItemClick?.(
      item,
      index
    );
  };

  const findNextEnabled = (
    currentIndex: number,
    direction: 1 | -1
  ) => {
    if (
      items.length === 0
    ) {
      return -1;
    }

    let index =
      currentIndex;

    for (
      let count = 0;
      count < items.length;
      count++
    ) {
      index +=
        direction;

      if (
        index >=
        items.length
      ) {
        index = 0;
      }

      if (
        index < 0
      ) {
        index =
          items.length - 1;
      }

      if (
        !items[index]
          .disabled
      ) {
        return index;
      }
    }

    return -1;
  };

  const findFirstEnabled =
    () =>
      items.findIndex(
        (item) =>
          !item.disabled
      );

  const findLastEnabled =
    () => {
      for (
        let index =
          items.length - 1;
        index >= 0;
        index--
      ) {
        if (
          !items[index]
            .disabled
        ) {
          return index;
        }
      }

      return -1;
    };

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLButtonElement>,
    item: SegmentedControlItem,
    index: number
  ) => {
    if (
      disabled ||
      item.disabled
    ) {
      return;
    }

    let nextIndex =
      -1;

    const previousKey =
      vertical
        ? "ArrowUp"
        : "ArrowLeft";

    const nextKey =
      vertical
        ? "ArrowDown"
        : "ArrowRight";

    if (
      event.key ===
      previousKey
    ) {
      event.preventDefault();

      nextIndex =
        findNextEnabled(
          index,
          -1
        );
    } else if (
      event.key ===
      nextKey
    ) {
      event.preventDefault();

      nextIndex =
        findNextEnabled(
          index,
          1
        );
    } else if (
      event.key ===
      "Home"
    ) {
      event.preventDefault();

      nextIndex =
        findFirstEnabled();
    } else if (
      event.key ===
      "End"
    ) {
      event.preventDefault();

      nextIndex =
        findLastEnabled();
    }

    if (
      nextIndex < 0
    ) {
      return;
    }

    const nextItem =
      items[nextIndex];

    selectItem(
      nextItem,
      nextIndex
    );

    buttonRefs.current[
      nextIndex
    ]?.focus();
  };

  /*
   * Builder-friendly empty state.
   */
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
            Math.max(
              40,
              height
            ),

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          padding:
            8,

          border:
            "1px dashed #d1d5db",

          borderRadius:
            8,

          color:
            "#9ca3af",

          fontSize:
            12,

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
              active: false,
              disabled: false,
              select:
                () => {},
            })
          : emptyText}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-orientation={
        orientation
      }
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        display:
          "flex",

        flexDirection:
          vertical
            ? "column"
            : "row",

        alignItems:
          "stretch",

        gap:
          Math.max(
            0,
            gap
          ),

        width:
          fullWidth
            ? "100%"
            : "fit-content",

        padding:
          Math.max(
            0,
            padding
          ),

        borderRadius:
          9,

        background:
          backgroundColor,

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
          const active =
            item.id ===
            resolvedActiveId;

          const itemDisabled =
            disabled ||
            Boolean(
              item.disabled
            );

          const context:
            SegmentedControlRenderContext =
            {
              item,
              index,
              active,
              disabled:
                itemDisabled,

              select:
                () =>
                  selectItem(
                    item,
                    index
                  ),
            };

          return (
            <button
              key={
                item.id
              }
              ref={(
                element
              ) => {
                buttonRefs.current[
                  index
                ] =
                  element;
              }}
              type="button"
              role="radio"
              aria-checked={
                active
              }
              disabled={
                itemDisabled
              }
              tabIndex={
                active ||
                (
                  !resolvedActiveId &&
                  index ===
                    findFirstEnabled()
                )
                  ? 0
                  : -1
              }
              className={`${itemClassName} ${
                active
                  ? activeItemClassName
                  : ""
              }`}
              onClick={() =>
                selectItem(
                  item,
                  index
                )
              }
              onKeyDown={(
                event
              ) =>
                handleKeyDown(
                  event,
                  item,
                  index
                )
              }
              style={{
                position:
                  "relative",

                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap: 6,

                flex:
                  equalWidth
                    ? "1 1 0"
                    : "0 0 auto",

                width:
                  vertical &&
                  fullWidth
                    ? "100%"
                    : undefined,

                minWidth:
                  0,

                minHeight:
                  Math.max(
                    28,
                    height
                  ),

                padding:
                  "6px 12px",

                border:
                  "1px solid transparent",

                borderRadius:
                  7,

                background:
                  active
                    ? activeColor
                    : "transparent",

                color:
                  itemDisabled
                    ? "#9ca3af"
                    : active
                      ? activeTextColor
                      : inactiveTextColor,

                boxShadow:
                  active
                    ? "0 1px 3px rgba(15,23,42,0.12)"
                    : "none",

                fontSize:
                  12,

                fontWeight:
                  active
                    ? 600
                    : 500,

                lineHeight:
                  1.2,

                whiteSpace:
                  "nowrap",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                cursor:
                  itemDisabled
                    ? "not-allowed"
                    : "pointer",

                opacity:
                  itemDisabled
                    ? 0.55
                    : 1,

                transition:
                  "background 120ms ease, color 120ms ease, box-shadow 120ms ease",

                boxSizing:
                  "border-box",
              }}
            >
              {typeof children ===
              "function"
                ? children(
                    context
                  )
                : children ??
                  item.label}
            </button>
          );
        }
      )}
    </div>
  );
}