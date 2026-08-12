import React, {
  useMemo,
  useState,
} from "react";

export interface PieChartProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className"
  > {
  /**
   * Chart data.
   *
   * Example:
   * [
   *   {
   *     "label":"React",
   *     "value":40,
   *     "color":"#2563eb"
   *   }
   * ]
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "properties":{
   *       "label":{"type":"string"},
   *       "value":{"type":"number"},
   *       "color":{"type":"string"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  data?: any[];

  labelKey?: string;

  valueKey?: string;

  colorKey?: string;

  height?: number;

  /**
   * 0 = normal pie.
   *
   * Increase this value to
   * convert it into a donut.
   */
  innerRadius?: number;

  outerRadius?: number;

  hoverOffset?: number;

  showLabels?: boolean;

  showPercentages?: boolean;

  showLegend?: boolean;

  showTooltip?: boolean;

  /**
   * Colors used when an item
   * does not provide its own color.
   *
   * @type|json
   */
  colors?: string[];

  /**
   * Center content shown for
   * donut charts.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: {
          total: number;
          activeItem: any | null;
          activeIndex: number | null;
        }
      ) => React.ReactNode);

  /**
   * Root customization.
   *
   * @type|class
   */
  className?: string;

  /**
   * SVG customization.
   *
   * @type|class
   */
  chartClassName?: string;

  /**
   * Legend customization.
   *
   * @type|class
   */
  legendClassName?: string;

  /**
   * Legend item customization.
   *
   * @type|class
   */
  legendItemClassName?: string;

  /** @type|function */
  onSliceClick?: (
    item: any,
    index: number
  ) => void;

  /** @type|function */
  onSliceHover?: (
    item: any,
    index: number
  ) => void;

  /** @type|function */
  onSliceHoverEnd?: (
    item: any,
    index: number
  ) => void;
}

interface NormalizedItem {
  item: any;
  index: number;
  label: string;
  value: number;
  color: string;
}

interface SliceData
  extends NormalizedItem {
  startAngle: number;
  endAngle: number;
  percentage: number;
}

const DEFAULT_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
];

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
) {
  const radians =
    ((angle - 90) *
      Math.PI) /
    180;

  return {
    x:
      centerX +
      radius *
        Math.cos(
          radians
        ),

    y:
      centerY +
      radius *
        Math.sin(
          radians
        ),
  };
}

function createSlicePath(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const safeEndAngle =
    endAngle -
    startAngle >=
    360
      ? endAngle -
        0.001
      : endAngle;

  const outerStart =
    polarToCartesian(
      centerX,
      centerY,
      outerRadius,
      startAngle
    );

  const outerEnd =
    polarToCartesian(
      centerX,
      centerY,
      outerRadius,
      safeEndAngle
    );

  const largeArc =
    safeEndAngle -
      startAngle >
    180
      ? 1
      : 0;

  if (
    innerRadius <= 0
  ) {
    return [
      `M ${centerX} ${centerY}`,

      `L ${outerStart.x} ${outerStart.y}`,

      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,

      "Z",
    ].join(" ");
  }

  const innerEnd =
    polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      safeEndAngle
    );

  const innerStart =
    polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      startAngle
    );

  return [
    `M ${outerStart.x} ${outerStart.y}`,

    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,

    `L ${innerEnd.x} ${innerEnd.y}`,

    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,

    "Z",
  ].join(" ");
}

export default function PieChart({
  data = [],

  labelKey = "label",

  valueKey = "value",

  colorKey = "color",

  height = 340,

  innerRadius = 0,

  outerRadius = 120,

  hoverOffset = 8,

  showLabels = true,

  showPercentages = true,

  showLegend = true,

  showTooltip = true,

  colors = DEFAULT_COLORS,

  children,

  className = "",

  chartClassName = "",

  legendClassName = "",

  legendItemClassName = "",

  onSliceClick,

  onSliceHover,

  onSliceHoverEnd,

  style,

  ...props
}: PieChartProps) {
  const [
    hoveredIndex,
    setHoveredIndex,
  ] =
    useState<number | null>(
      null
    );

  const normalizedData =
    useMemo<
      NormalizedItem[]
    >(() => {
      if (
        !Array.isArray(data)
      ) {
        return [];
      }

      return data
        .map(
          (
            item,
            index
          ) => {
            const value =
              Number(
                item?.[
                  valueKey
                ]
              );

            if (
              !Number.isFinite(
                value
              ) ||
              value <= 0
            ) {
              return null;
            }

            const fallbackColor =
              colors[
                index %
                  colors.length
              ] ??
              DEFAULT_COLORS[
                index %
                  DEFAULT_COLORS.length
              ];

            return {
              item,

              index,

              label:
                String(
                  item?.[
                    labelKey
                  ] ??
                    `Item ${
                      index + 1
                    }`
                ),

              value,

              color:
                item?.[
                  colorKey
                ] ||
                fallbackColor,
            };
          }
        )
        .filter(
          (
            item
          ): item is NormalizedItem =>
            Boolean(item)
        );
    }, [
      data,
      labelKey,
      valueKey,
      colorKey,
      colors,
    ]);

  const total =
    normalizedData.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.value,
      0
    );

  const slices =
    useMemo<
      SliceData[]
    >(() => {
      if (
        total <= 0
      ) {
        return [];
      }

      let angle =
        0;

      return normalizedData.map(
        (
          item
        ) => {
          const percentage =
            (item.value /
              total) *
            100;

          const sliceAngle =
            (item.value /
              total) *
            360;

          const slice = {
            ...item,

            startAngle:
              angle,

            endAngle:
              angle +
              sliceAngle,

            percentage,
          };

          angle +=
            sliceAngle;

          return slice;
        }
      );
    }, [
      normalizedData,
      total,
    ]);

  if (
    slices.length === 0
  ) {
    return (
      <div
        {...props}
        className={
          className
        }
        style={{
          width:
            "100%",

          minHeight:
            height,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          border:
            "1px dashed #d1d5db",

          borderRadius:
            12,

          background:
            "#f9fafb",

          color:
            "#9ca3af",

          fontSize:
            14,

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        Pie Chart
        (No Data Bound)
      </div>
    );
  }

  const svgSize =
    320;

  const center =
    svgSize / 2;

  const safeOuterRadius =
    Math.max(
      20,
      Math.min(
        outerRadius,
        center - 25
      )
    );

  const safeInnerRadius =
    Math.max(
      0,
      Math.min(
        innerRadius,
        safeOuterRadius -
          10
      )
    );

  const hoveredSlice =
    hoveredIndex !==
    null
      ? slices[
          hoveredIndex
        ]
      : null;

  const activeItem =
    hoveredSlice?.item ??
    null;

  const renderCenter =
    () => {
      if (
        safeInnerRadius <=
        0
      ) {
        return null;
      }

      if (
        typeof children ===
        "function"
      ) {
        return (
          <foreignObject
            x={
              center -
              safeInnerRadius
            }
            y={
              center -
              safeInnerRadius
            }
            width={
              safeInnerRadius *
              2
            }
            height={
              safeInnerRadius *
              2
            }
            pointerEvents="none"
          >
            <div
              style={{
                width:
                  "100%",

                height:
                  "100%",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                textAlign:
                  "center",
              }}
            >
              {children({
                total,
                activeItem,
                activeIndex:
                  hoveredIndex,
              })}
            </div>
          </foreignObject>
        );
      }

      if (children) {
        return (
          <foreignObject
            x={
              center -
              safeInnerRadius
            }
            y={
              center -
              safeInnerRadius
            }
            width={
              safeInnerRadius *
              2
            }
            height={
              safeInnerRadius *
              2
            }
            pointerEvents="none"
          >
            <div
              style={{
                width:
                  "100%",

                height:
                  "100%",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                textAlign:
                  "center",
              }}
            >
              {children}
            </div>
          </foreignObject>
        );
      }

      return (
        <g
          pointerEvents="none"
        >
          <text
            x={center}
            y={
              center - 4
            }
            textAnchor="middle"
            fill="#111827"
            fontSize="22"
            fontWeight="700"
          >
            {hoveredSlice
              ? hoveredSlice.value
              : total}
          </text>

          <text
            x={center}
            y={
              center + 18
            }
            textAnchor="middle"
            fill="#6b7280"
            fontSize="11"
          >
            {hoveredSlice
              ? hoveredSlice.label
              : "Total"}
          </text>
        </g>
      );
    };

  return (
    <div
      {...props}
      className={
        className
      }
      style={{
        width:
          "100%",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        gap: 28,

        flexWrap:
          "wrap",

        position:
          "relative",

        boxSizing:
          "border-box",

        background:
          "#ffffff",

        borderRadius:
          12,

        ...style,
      }}
    >
      <div
        style={{
          position:
            "relative",

          width:
            svgSize,

          maxWidth:
            "100%",

          flexShrink:
            0,
        }}
      >
        <svg
          className={
            chartClassName
          }
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          role="img"
          aria-label="Pie chart"
          style={{
            display:
              "block",

            width:
              "100%",

            height:
              "auto",

            overflow:
              "visible",
          }}
        >
          {slices.map(
            (
              slice,
              index
            ) => {
              const hovering =
                hoveredIndex ===
                index;

              const middleAngle =
                (slice.startAngle +
                  slice.endAngle) /
                2;

              const offset =
                hovering
                  ? hoverOffset
                  : 0;

              const offsetPosition =
                polarToCartesian(
                  0,
                  0,
                  offset,
                  middleAngle
                );

              const path =
                createSlicePath(
                  center,
                  center,
                  safeOuterRadius,
                  safeInnerRadius,
                  slice.startAngle,
                  slice.endAngle
                );

              const labelRadius =
                safeInnerRadius >
                0
                  ? (safeInnerRadius +
                      safeOuterRadius) /
                    2
                  : safeOuterRadius *
                    0.68;

              const labelPosition =
                polarToCartesian(
                  center,
                  center,
                  labelRadius,
                  middleAngle
                );

              return (
                <g
                  key={
                    slice.item
                      ?.id ??
                    index
                  }
                  transform={`translate(${offsetPosition.x} ${offsetPosition.y})`}
                  style={{
                    cursor:
                      onSliceClick
                        ? "pointer"
                        : "default",

                    transition:
                      "transform 180ms ease",
                  }}
                  onClick={() => {
                    onSliceClick?.(
                      slice.item,
                      slice.index
                    );
                  }}
                  onMouseEnter={() => {
                    setHoveredIndex(
                      index
                    );

                    onSliceHover?.(
                      slice.item,
                      slice.index
                    );
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(
                      null
                    );

                    onSliceHoverEnd?.(
                      slice.item,
                      slice.index
                    );
                  }}
                >
                  <path
                    d={path}
                    fill={
                      slice.color
                    }
                    stroke="#ffffff"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      opacity:
                        hoveredIndex !==
                          null &&
                        !hovering
                          ? 0.72
                          : 1,

                      transition:
                        "opacity 180ms ease",
                    }}
                  />

                  {showLabels &&
                    slice.percentage >=
                      5 && (
                      <text
                        x={
                          labelPosition.x
                        }
                        y={
                          labelPosition.y
                        }
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="600"
                        pointerEvents="none"
                      >
                        {showPercentages
                          ? `${Math.round(
                              slice.percentage
                            )}%`
                          : slice.label}
                      </text>
                    )}
                </g>
              );
            }
          )}

          {renderCenter()}
        </svg>

        {showTooltip &&
          hoveredSlice && (
            <div
              style={{
                position:
                  "absolute",

                left:
                  "50%",

                bottom:
                  0,

                transform:
                  "translate(-50%, 50%)",

                minWidth:
                  110,

                padding:
                  "8px 11px",

                borderRadius:
                  8,

                background:
                  "#111827",

                color:
                  "#ffffff",

                fontSize:
                  12,

                lineHeight:
                  1.4,

                textAlign:
                  "center",

                whiteSpace:
                  "nowrap",

                pointerEvents:
                  "none",

                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.20)",

                zIndex:
                  20,
              }}
            >
              <div
                style={{
                  fontWeight:
                    600,
                }}
              >
                {
                  hoveredSlice.label
                }
              </div>

              <div
                style={{
                  marginTop:
                    2,

                  opacity:
                    0.82,
                }}
              >
                {
                  hoveredSlice.value
                }

                {" · "}

                {hoveredSlice.percentage.toFixed(
                  1
                )}
                %
              </div>
            </div>
          )}
      </div>

      {showLegend && (
        <div
          className={
            legendClassName
          }
          style={{
            minWidth:
              160,

            display:
              "flex",

            flexDirection:
              "column",

            gap: 8,
          }}
        >
          {slices.map(
            (
              slice,
              index
            ) => {
              const hovering =
                hoveredIndex ===
                index;

              return (
                <button
                  key={
                    slice.item
                      ?.id ??
                    index
                  }
                  type="button"
                  className={
                    legendItemClassName
                  }
                  onClick={() => {
                    onSliceClick?.(
                      slice.item,
                      slice.index
                    );
                  }}
                  onMouseEnter={() => {
                    setHoveredIndex(
                      index
                    );

                    onSliceHover?.(
                      slice.item,
                      slice.index
                    );
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(
                      null
                    );

                    onSliceHoverEnd?.(
                      slice.item,
                      slice.index
                    );
                  }}
                  style={{
                    width:
                      "100%",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 8,

                    padding:
                      "7px 8px",

                    border:
                      "none",

                    borderRadius:
                      8,

                    background:
                      hovering
                        ? "#f3f4f6"
                        : "transparent",

                    cursor:
                      "pointer",

                    textAlign:
                      "left",

                    transition:
                      "background 150ms ease",
                  }}
                >
                  <span
                    style={{
                      width:
                        10,

                      height:
                        10,

                      flexShrink:
                        0,

                      borderRadius:
                        "50%",

                      background:
                        slice.color,
                    }}
                  />

                  <span
                    style={{
                      minWidth:
                        0,

                      flex:
                        1,

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",

                      color:
                        "#374151",

                      fontSize:
                        13,
                    }}
                  >
                    {
                      slice.label
                    }
                  </span>

                  <span
                    style={{
                      flexShrink:
                        0,

                      color:
                        "#9ca3af",

                      fontSize:
                        12,
                    }}
                  >
                    {slice.percentage.toFixed(
                      1
                    )}
                    %
                  </span>
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}