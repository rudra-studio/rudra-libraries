import React, {
  useMemo,
  useState,
} from "react";

import {
  Star,
} from "lucide-react";

export type RatingPrecision =
  | 1
  | 0.5
  | 0.25;

export interface RatingRenderContext {
  index: number;

  value: number;

  fill: number;

  active: boolean;

  hovered: boolean;

  disabled: boolean;

  select: () => void;
}

export interface RatingProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className" | "onChange"
  > {
  /**
   * Controlled rating value.
   */
  value?: number;

  /**
   * Initial uncontrolled value.
   */
  defaultValue?: number;

  /**
   * Maximum rating.
   */
  max?: number;

  /**
   * Rating precision.
   *
   * @select|1|0.5|0.25
   */
  precision?: RatingPrecision;

  /**
   * Star size in pixels.
   */
  size?: number;

  /**
   * Space between stars.
   */
  gap?: number;

  disabled?: boolean;

  readOnly?: boolean;

  /**
   * Clicking the current rating again
   * resets the value to zero.
   */
  allowClear?: boolean;

  /**
   * Show current numeric value.
   */
  showValue?: boolean;

  /**
   * Optional text after value.
   *
   * Example:
   * "out of 5"
   */
  valueSuffix?: string;

  /**
   * @color
   */
  activeColor?: string;

  /**
   * @color
   */
  inactiveColor?: string;

  /**
   * Custom rating-item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: RatingRenderContext
      ) => React.ReactNode);

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
  valueClassName?: string;

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
  onChange?: (
    value: number
  ) => void;

  /**
   * @type|function
   */
  onHoverChange?: (
    value: number
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

function roundToPrecision(
  value: number,
  precision: RatingPrecision
) {
  return (
    Math.round(
      value /
        precision
    ) *
    precision
  );
}

export default function Rating({
  value,

  defaultValue = 0,

  max = 5,

  precision = 1,

  size = 24,

  gap = 4,

  disabled = false,

  readOnly = false,

  allowClear = true,

  showValue = false,

  valueSuffix,

  activeColor = "#f59e0b",

  inactiveColor = "#d1d5db",

  children,

  className = "",

  itemClassName = "",

  valueClassName = "",

  customAttributes = {},

  onChange,

  onHoverChange,

  style,

  ...props
}: RatingProps) {
  const safeMax =
    Math.max(
      1,
      Math.floor(max)
    );

  const [
    internalValue,
    setInternalValue,
  ] = useState(
    clamp(
      roundToPrecision(
        defaultValue,
        precision
      ),
      0,
      safeMax
    )
  );

  const [
    hoverValue,
    setHoverValue,
  ] = useState<
    number | null
  >(null);

  const controlled =
    value !== undefined;

  const resolvedValue =
    clamp(
      roundToPrecision(
        controlled
          ? value
          : internalValue,
        precision
      ),
      0,
      safeMax
    );

  const displayValue =
    hoverValue ??
    resolvedValue;

  const interactive =
    !disabled &&
    !readOnly;

  const stars =
    useMemo(
      () =>
        Array.from(
          {
            length:
              safeMax,
          },
          (_, index) =>
            index
        ),
      [safeMax]
    );

  const updateValue = (
    nextValue: number
  ) => {
    if (!interactive) {
      return;
    }

    let next =
      clamp(
        roundToPrecision(
          nextValue,
          precision
        ),
        0,
        safeMax
      );

    if (
      allowClear &&
      next ===
        resolvedValue
    ) {
      next = 0;
    }

    if (!controlled) {
      setInternalValue(
        next
      );
    }

    setHoverValue(
      null
    );

    onChange?.(
      next
    );
  };

  const updateHover = (
    nextValue:
      | number
      | null
  ) => {
    if (!interactive) {
      return;
    }

    setHoverValue(
      nextValue
    );

    onHoverChange?.(
      nextValue ?? 0
    );
  };

  const calculatePointerValue = (
    event:
      React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (
      precision === 1
    ) {
      return index + 1;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const position =
      clamp(
        (
          event.clientX -
          rect.left
        ) /
          rect.width,
        0,
        1
      );

    const segments =
      1 /
      precision;

    const segment =
      Math.max(
        1,
        Math.ceil(
          position *
            segments
        )
      );

    return (
      index +
      segment *
        precision
    );
  };

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (!interactive) {
      return;
    }

    let next =
      resolvedValue;

    if (
      event.key ===
        "ArrowRight" ||
      event.key ===
        "ArrowUp"
    ) {
      event.preventDefault();

      next +=
        precision;
    } else if (
      event.key ===
        "ArrowLeft" ||
      event.key ===
        "ArrowDown"
    ) {
      event.preventDefault();

      next -=
        precision;
    } else if (
      event.key === "Home"
    ) {
      event.preventDefault();

      next = 0;
    } else if (
      event.key === "End"
    ) {
      event.preventDefault();

      next =
        safeMax;
    } else {
      return;
    }

    next =
      clamp(
        roundToPrecision(
          next,
          precision
        ),
        0,
        safeMax
      );

    if (!controlled) {
      setInternalValue(
        next
      );
    }

    onChange?.(
      next
    );
  };

  return (
    <div
      className={
        className
      }
      {...customAttributes}
      {...props}
      role="slider"
      tabIndex={
        interactive
          ? 0
          : -1
      }
      aria-valuemin={0}
      aria-valuemax={
        safeMax
      }
      aria-valuenow={
        resolvedValue
      }
      aria-disabled={
        disabled
      }
      aria-readonly={
        readOnly
      }
      onKeyDown={
        handleKeyDown
      }
      onMouseLeave={() =>
        updateHover(
          null
        )
      }
      style={{
        display:
          "inline-flex",

        alignItems:
          "center",

        gap:
          showValue
            ? 10
            : 0,

        maxWidth:
          "100%",

        outline:
          "none",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      <div
        style={{
          display:
            "inline-flex",

          alignItems:
            "center",

          gap:
            Math.max(
              0,
              gap
            ),

          flexShrink:
            0,
        }}
      >
        {stars.map(
          (index) => {
            const starStart =
              index;

            const starEnd =
              index + 1;

            const fill =
              displayValue <=
              starStart
                ? 0
                : displayValue >=
                    starEnd
                  ? 1
                  : displayValue -
                    starStart;

            const active =
              fill > 0;

            const hovered =
              hoverValue !==
                null &&
              fill > 0;

            const context:
              RatingRenderContext =
              {
                index,

                value:
                  index + 1,

                fill,

                active,

                hovered,

                disabled,

                select:
                  () =>
                    updateValue(
                      index + 1
                    ),
              };

            return (
              <button
                key={
                  index
                }
                type="button"
                disabled={
                  !interactive
                }
                aria-label={`Rate ${
                  index + 1
                } out of ${safeMax}`}
                className={
                  itemClassName
                }
                onMouseMove={(
                  event
                ) => {
                  if (
                    !interactive
                  ) {
                    return;
                  }

                  updateHover(
                    calculatePointerValue(
                      event,
                      index
                    )
                  );
                }}
                onClick={(
                  event
                ) => {
                  if (
                    !interactive
                  ) {
                    return;
                  }

                  updateValue(
                    calculatePointerValue(
                      event,
                      index
                    )
                  );
                }}
                style={{
                  position:
                    "relative",

                  width:
                    Math.max(
                      12,
                      size
                    ),

                  height:
                    Math.max(
                      12,
                      size
                    ),

                  display:
                    "inline-flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  padding: 0,

                  flexShrink:
                    0,

                  overflow:
                    "visible",

                  border: 0,

                  background:
                    "transparent",

                  color:
                    inactiveColor,

                  cursor:
                    interactive
                      ? "pointer"
                      : "default",

                  opacity:
                    disabled
                      ? 0.5
                      : 1,

                  boxSizing:
                    "border-box",
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
                    {/* Empty star */}
                    <Star
                      size={
                        Math.max(
                          12,
                          size
                        )
                      }
                      strokeWidth={
                        1.8
                      }
                      fill="transparent"
                      color={
                        inactiveColor
                      }
                    />

                    {/*
                     * Filled star sits on top.
                     *
                     * Width clips it for
                     * half/quarter ratings.
                     */}
                    {fill > 0 && (
                      <span
                        aria-hidden="true"
                        style={{
                          position:
                            "absolute",

                          top: 0,

                          left: 0,

                          width:
                            `${fill * 100}%`,

                          height:
                            "100%",

                          overflow:
                            "hidden",

                          pointerEvents:
                            "none",
                        }}
                      >
                        <span
                          style={{
                            width:
                              Math.max(
                                12,
                                size
                              ),

                            height:
                              Math.max(
                                12,
                                size
                              ),

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",
                          }}
                        >
                          <Star
                            size={
                              Math.max(
                                12,
                                size
                              )
                            }
                            strokeWidth={
                              1.8
                            }
                            fill={
                              activeColor
                            }
                            color={
                              activeColor
                            }
                          />
                        </span>
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          }
        )}
      </div>

      {showValue && (
        <span
          className={
            valueClassName
          }
          style={{
            color:
              "#4b5563",

            fontSize:
              12,

            fontWeight:
              600,

            lineHeight:
              1.2,

            whiteSpace:
              "nowrap",
          }}
        >
          {displayValue}

          {valueSuffix
            ? ` ${valueSuffix}`
            : ` / ${safeMax}`}
        </span>
      )}
    </div>
  );
}