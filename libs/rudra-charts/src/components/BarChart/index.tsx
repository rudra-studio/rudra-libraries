import React, {
  useMemo,
  useState,
} from "react";

export interface BarChartProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className"
  > {
  /**
   * Chart data.
   *
   * Example:
   * [
   *   {"label":"Jan","value":120},
   *   {"label":"Feb","value":180}
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

  categoryKey?: string;

  valueKey?: string;

  colorKey?: string;

  height?: number;

  minValue?: number;

  maxValue?: number;

  showGrid?: boolean;

  showXAxis?: boolean;

  showYAxis?: boolean;

  showValues?: boolean;

  showTooltip?: boolean;

  gridLines?: number;

  barGap?: number;

  /**
   * Default bar color.
   *
   * Individual items can override this
   * using the colorKey property.
   *
   * @color
   */
  barColor?: string;

  /**
   * Hovered bar color.
   *
   * @color
   */
  hoverColor?: string;

  /**
   * Grid line color.
   *
   * @color
   */
  gridColor?: string;

  /**
   * Axis / label color.
   *
   * @color
   */
  textColor?: string;

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
   *       {"key":"64","label":"Small"},
   *       {"key":"80","label":"Medium"},
   *       {"key":"96","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"transparent","label":"Transparent"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"2xl","label":"2XL"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Chart area customization.
   *
   * @type|class
   */
  chartClassName?: string;

  /** @type|function */
  onBarClick?: (
    item: any,
    index: number
  ) => void;

  /** @type|function */
  onBarHover?: (
    item: any,
    index: number
  ) => void;

  /** @type|function */
  onBarHoverEnd?: (
    item: any,
    index: number
  ) => void;
}

interface NormalizedItem {
  item: any;
  index: number;
  label: string;
  value: number;
  color?: string;
}

export default function BarChart({
  data = [],

  categoryKey = "label",

  valueKey = "value",

  colorKey = "color",

  height = 320,

  minValue,

  maxValue,

  showGrid = true,

  showXAxis = true,

  showYAxis = true,

  showValues = true,

  showTooltip = true,

  gridLines = 5,

  barGap = 12,

  barColor = "#2563eb",

  hoverColor = "#1d4ed8",

  gridColor = "#e5e7eb",

  textColor = "#6b7280",

  className = "",

  chartClassName = "",

  onBarClick,

  onBarHover,

  onBarHoverEnd,

  style,

  ...props
}: BarChartProps) {
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
              )
            ) {
              return null;
            }

            return {
              item,
              index,

              label:
                String(
                  item?.[
                    categoryKey
                  ] ??
                    index +
                      1
                ),

              value,

              color:
                item?.[
                  colorKey
                ],
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
      valueKey,
      categoryKey,
      colorKey,
    ]);

  if (
    normalizedData.length ===
    0
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
        Bar Chart
        (No Data Bound)
      </div>
    );
  }

  const values =
    normalizedData.map(
      (item) =>
        item.value
    );

  const dataMin =
    Math.min(
      ...values,
      0
    );

  const dataMax =
    Math.max(
      ...values,
      0
    );

  const resolvedMin =
    typeof minValue ===
      "number"
      ? minValue
      : dataMin;

  const resolvedMax =
    typeof maxValue ===
      "number"
      ? maxValue
      : dataMax;

  const chartMin =
    Math.min(
      resolvedMin,
      0
    );

  const chartMax =
    Math.max(
      resolvedMax,
      0
    );

  const range =
    chartMax -
      chartMin ||
    1;

  /*
   * SVG coordinate system.
   */
  const svgWidth =
    1000;

  const leftPadding =
    showYAxis
      ? 70
      : 20;

  const rightPadding =
    20;

  const topPadding =
    showValues
      ? 34
      : 20;

  const bottomPadding =
    showXAxis
      ? 55
      : 20;

  const chartWidth =
    svgWidth -
    leftPadding -
    rightPadding;

  const chartHeight =
    height -
    topPadding -
    bottomPadding;

  const valueToY = (
    value: number
  ) =>
    topPadding +
    ((chartMax -
      value) /
      range) *
      chartHeight;

  const zeroY =
    valueToY(0);

  const groupWidth =
    chartWidth /
    normalizedData.length;

  const actualBarGap =
    Math.max(
      0,
      Math.min(
        barGap,
        groupWidth * 0.5
      )
    );

  const barWidth =
    Math.max(
      4,
      groupWidth -
        actualBarGap *
          2
    );

  const lines =
    Math.max(
      2,
      gridLines
    );

  return (
    <div
      {...props}
      className={
        className
      }
      style={{
        position:
          "relative",

        width:
          "100%",

        minWidth: 0,

        overflow:
          "hidden",

        background:
          "#ffffff",

        borderRadius:
          12,

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      <svg
        className={
          chartClassName
        }
        viewBox={`0 0 ${svgWidth} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Bar chart"
        style={{
          display:
            "block",

          width:
            "100%",

          height,

          overflow:
            "visible",
        }}
      >
        {/*
         * GRID + Y AXIS LABELS
         */}
        {Array.from({
          length:
            lines + 1,
        }).map(
          (
            _,
            index
          ) => {
            const ratio =
              index /
              lines;

            const value =
              chartMax -
              range *
                ratio;

            const y =
              topPadding +
              chartHeight *
                ratio;

            return (
              <g
                key={
                  index
                }
              >
                {showGrid && (
                  <line
                    x1={
                      leftPadding
                    }
                    x2={
                      svgWidth -
                      rightPadding
                    }
                    y1={y}
                    y2={y}
                    stroke={
                      gridColor
                    }
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                {showYAxis && (
                  <text
                    x={
                      leftPadding -
                      12
                    }
                    y={
                      y + 4
                    }
                    textAnchor="end"
                    fill={
                      textColor
                    }
                    fontSize="12"
                  >
                    {Math.round(
                      value *
                        100
                    ) /
                      100}
                  </text>
                )}
              </g>
            );
          }
        )}

        {/*
         * ZERO AXIS
         */}
        <line
          x1={
            leftPadding
          }
          x2={
            svgWidth -
            rightPadding
          }
          y1={
            zeroY
          }
          y2={
            zeroY
          }
          stroke={
            textColor
          }
          strokeWidth="1"
          opacity="0.45"
          vectorEffect="non-scaling-stroke"
        />

        {/*
         * BARS
         */}
        {normalizedData.map(
          (
            entry,
            index
          ) => {
            const x =
              leftPadding +
              index *
                groupWidth +
              actualBarGap;

            const valueY =
              valueToY(
                entry.value
              );

            const positive =
              entry.value >= 0;

            const y =
              positive
                ? valueY
                : zeroY;

            const barHeight =
              Math.max(
                1,
                Math.abs(
                  zeroY -
                    valueY
                )
              );

            const hovering =
              hoveredIndex ===
              index;

            const color =
              hovering
                ? hoverColor
                : entry.color ||
                  barColor;

            return (
              <g
                key={
                  entry.item
                    ?.id ??
                  index
                }
                style={{
                  cursor:
                    onBarClick
                      ? "pointer"
                      : "default",
                }}
                onClick={() => {
                  onBarClick?.(
                    entry.item,
                    entry.index
                  );
                }}
                onMouseEnter={() => {
                  setHoveredIndex(
                    index
                  );

                  onBarHover?.(
                    entry.item,
                    entry.index
                  );
                }}
                onMouseLeave={() => {
                  setHoveredIndex(
                    null
                  );

                  onBarHoverEnd?.(
                    entry.item,
                    entry.index
                  );
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={
                    barWidth
                  }
                  height={
                    barHeight
                  }
                  rx="6"
                  ry="6"
                  fill={
                    color
                  }
                  style={{
                    transition:
                      "opacity 160ms ease",

                    opacity:
                      hoveredIndex !==
                        null &&
                      !hovering
                        ? 0.65
                        : 1,
                  }}
                />

                {showValues && (
                  <text
                    x={
                      x +
                      barWidth /
                        2
                    }
                    y={
                      positive
                        ? Math.max(
                            14,
                            y -
                              8
                          )
                        : y +
                          barHeight +
                          18
                    }
                    textAnchor="middle"
                    fill={
                      textColor
                    }
                    fontSize="12"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {
                      entry.value
                    }
                  </text>
                )}

                {showXAxis && (
                  <text
                    x={
                      x +
                      barWidth /
                        2
                    }
                    y={
                      height -
                      22
                    }
                    textAnchor="middle"
                    fill={
                      textColor
                    }
                    fontSize="12"
                    pointerEvents="none"
                  >
                    {
                      entry.label
                    }
                  </text>
                )}
              </g>
            );
          }
        )}
      </svg>

      {/*
       * TOOLTIP
       */}
      {showTooltip &&
        hoveredIndex !==
          null &&
        normalizedData[
          hoveredIndex
        ] && (
          <div
            style={{
              position:
                "absolute",

              left:
                `${Math.min(
                  90,
                  Math.max(
                    10,
                    ((hoveredIndex +
                      0.5) /
                      normalizedData.length) *
                      100
                  )
                )}%`,

              top: 12,

              transform:
                "translateX(-50%)",

              padding:
                "7px 10px",

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

              whiteSpace:
                "nowrap",

              pointerEvents:
                "none",

              boxShadow:
                "0 6px 18px rgba(0,0,0,0.18)",

              zIndex: 10,
            }}
          >
            <div
              style={{
                fontWeight:
                  600,
              }}
            >
              {
                normalizedData[
                  hoveredIndex
                ].label
              }
            </div>

            <div
              style={{
                opacity:
                  0.8,
              }}
            >
              {
                normalizedData[
                  hoveredIndex
                ].value
              }
            </div>
          </div>
        )}
    </div>
  );
}