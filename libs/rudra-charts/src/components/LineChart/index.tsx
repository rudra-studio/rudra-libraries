import React, {
  useMemo,
  useState,
} from "react";

export type LineChartCurve =
  | "linear"
  | "smooth"
  | "step";

export interface LineChartProps
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
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  data?: any[];

  categoryKey?: string;

  valueKey?: string;

  height?: number;

  minValue?: number;

  maxValue?: number;

  /** @select|linear|smooth|step */
  curve?: LineChartCurve;

  showGrid?: boolean;

  showXAxis?: boolean;

  showYAxis?: boolean;

  showPoints?: boolean;

  showValues?: boolean;

  showTooltip?: boolean;

  gridLines?: number;

  lineWidth?: number;

  pointSize?: number;

  /**
   * Main line color.
   *
   * @color
   */
  lineColor?: string;

  /**
   * Point color.
   *
   * @color
   */
  pointColor?: string;

  /**
   * Hovered point color.
   *
   * @color
   */
  hoverColor?: string;

  /**
   * Grid color.
   *
   * @color
   */
  gridColor?: string;

  /**
   * Axis/label color.
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
   * SVG/chart customization.
   *
   * @type|class
   */
  chartClassName?: string;

  /** @type|function */
  onPointClick?: (
    item: any,
    index: number
  ) => void;

  /** @type|function */
  onPointHover?: (
    item: any,
    index: number
  ) => void;

  /** @type|function */
  onPointHoverEnd?: (
    item: any,
    index: number
  ) => void;
}

interface NormalizedItem {
  item: any;
  index: number;
  label: string;
  value: number;
}

interface ChartPoint
  extends NormalizedItem {
  x: number;
  y: number;
}

function createLinearPath(
  points: ChartPoint[]
) {
  if (!points.length) {
    return "";
  }

  return points
    .map(
      (point, index) =>
        `${
          index === 0
            ? "M"
            : "L"
        } ${point.x} ${point.y}`
    )
    .join(" ");
}

function createStepPath(
  points: ChartPoint[]
) {
  if (!points.length) {
    return "";
  }

  let path =
    `M ${points[0].x} ${points[0].y}`;

  for (
    let index = 1;
    index < points.length;
    index++
  ) {
    const previous =
      points[
        index - 1
      ];

    const current =
      points[index];

    const middleX =
      (previous.x +
        current.x) /
      2;

    path +=
      ` L ${middleX} ${previous.y}`;

    path +=
      ` L ${middleX} ${current.y}`;

    path +=
      ` L ${current.x} ${current.y}`;
  }

  return path;
}

function createSmoothPath(
  points: ChartPoint[]
) {
  if (!points.length) {
    return "";
  }

  if (
    points.length === 1
  ) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path =
    `M ${points[0].x} ${points[0].y}`;

  for (
    let index = 0;
    index <
    points.length - 1;
    index++
  ) {
    const current =
      points[index];

    const next =
      points[
        index + 1
      ];

    const middleX =
      (current.x +
        next.x) /
      2;

    path +=
      ` C ${middleX} ${current.y},`;

    path +=
      ` ${middleX} ${next.y},`;

    path +=
      ` ${next.x} ${next.y}`;
  }

  return path;
}

export default function LineChart({
  data = [],

  categoryKey = "label",

  valueKey = "value",

  height = 320,

  minValue,

  maxValue,

  curve = "smooth",

  showGrid = true,

  showXAxis = true,

  showYAxis = true,

  showPoints = true,

  showValues = false,

  showTooltip = true,

  gridLines = 5,

  lineWidth = 3,

  pointSize = 6,

  lineColor = "#2563eb",

  pointColor = "#2563eb",

  hoverColor = "#1d4ed8",

  gridColor = "#e5e7eb",

  textColor = "#6b7280",

  className = "",

  chartClassName = "",

  onPointClick,

  onPointHover,

  onPointHoverEnd,

  style,

  ...props
}: LineChartProps) {
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
      categoryKey,
      valueKey,
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
        Line Chart
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
      ...values
    );

  const dataMax =
    Math.max(
      ...values
    );

  let chartMin =
    typeof minValue ===
      "number"
      ? minValue
      : dataMin;

  let chartMax =
    typeof maxValue ===
      "number"
      ? maxValue
      : dataMax;

  /*
   * Give the chart some vertical
   * breathing space automatically.
   */
  if (
    minValue === undefined &&
    maxValue === undefined
  ) {
    const rawRange =
      dataMax -
        dataMin ||
      Math.abs(
        dataMax
      ) ||
      1;

    const padding =
      rawRange * 0.1;

    chartMin -=
      padding;

    chartMax +=
      padding;
  }

  if (
    chartMax <=
    chartMin
  ) {
    chartMax =
      chartMin + 1;
  }

  const range =
    chartMax -
    chartMin;

  const svgWidth =
    1000;

  const leftPadding =
    showYAxis
      ? 70
      : 20;

  const rightPadding =
    25;

  const topPadding =
    showValues
      ? 38
      : 25;

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

  const points:
    ChartPoint[] =
    normalizedData.map(
      (
        entry,
        index
      ) => {
        const x =
          normalizedData.length ===
          1
            ? leftPadding +
              chartWidth /
                2
            : leftPadding +
              (index /
                (normalizedData.length -
                  1)) *
                chartWidth;

        return {
          ...entry,

          x,

          y:
            valueToY(
              entry.value
            ),
        };
      }
    );

  const linePath =
    curve === "linear"
      ? createLinearPath(
          points
        )
      : curve === "step"
        ? createStepPath(
            points
          )
        : createSmoothPath(
            points
          );

  const lines =
    Math.max(
      2,
      gridLines
    );

  const hoveredPoint =
    hoveredIndex !==
    null
      ? points[
          hoveredIndex
        ]
      : null;

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

        minWidth:
          0,

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
        aria-label="Line chart"
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
         * GRID + Y AXIS
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
         * LINE
         */}
        <path
          d={
            linePath
          }
          fill="none"
          stroke={
            lineColor
          }
          strokeWidth={
            lineWidth
          }
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/*
         * X AXIS LABELS
         */}
        {showXAxis &&
          points.map(
            (
              point,
              index
            ) => (
              <text
                key={
                  `label-${index}`
                }
                x={
                  point.x
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
              >
                {
                  point.label
                }
              </text>
            )
          )}

        {/*
         * VALUES
         */}
        {showValues &&
          points.map(
            (
              point,
              index
            ) => (
              <text
                key={
                  `value-${index}`
                }
                x={
                  point.x
                }
                y={
                  point.y -
                  12
                }
                textAnchor="middle"
                fill={
                  textColor
                }
                fontSize="12"
                fontWeight="600"
              >
                {
                  point.value
                }
              </text>
            )
          )}

        {/*
         * INTERACTION POINTS
         *
         * Even when showPoints=false,
         * an invisible larger circle
         * remains for hover/click.
         */}
        {points.map(
          (
            point,
            index
          ) => {
            const hovering =
              hoveredIndex ===
              index;

            return (
              <g
                key={
                  point.item
                    ?.id ??
                  index
                }
                style={{
                  cursor:
                    onPointClick
                      ? "pointer"
                      : "default",
                }}
                onClick={() => {
                  onPointClick?.(
                    point.item,
                    point.index
                  );
                }}
                onMouseEnter={() => {
                  setHoveredIndex(
                    index
                  );

                  onPointHover?.(
                    point.item,
                    point.index
                  );
                }}
                onMouseLeave={() => {
                  setHoveredIndex(
                    null
                  );

                  onPointHoverEnd?.(
                    point.item,
                    point.index
                  );
                }}
              >
                <circle
                  cx={
                    point.x
                  }
                  cy={
                    point.y
                  }
                  r={
                    Math.max(
                      14,
                      pointSize *
                        2
                    )
                  }
                  fill="transparent"
                />

                {showPoints && (
                  <>
                    {hovering && (
                      <circle
                        cx={
                          point.x
                        }
                        cy={
                          point.y
                        }
                        r={
                          pointSize +
                          5
                        }
                        fill={
                          hoverColor
                        }
                        opacity="0.16"
                      />
                    )}

                    <circle
                      cx={
                        point.x
                      }
                      cy={
                        point.y
                      }
                      r={
                        hovering
                          ? pointSize +
                            1.5
                          : pointSize
                      }
                      fill={
                        hovering
                          ? hoverColor
                          : pointColor
                      }
                      stroke="#ffffff"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      style={{
                        transition:
                          "r 150ms ease",
                      }}
                    />
                  </>
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
        hoveredPoint && (
          <div
            style={{
              position:
                "absolute",

              left:
                `${Math.min(
                  92,
                  Math.max(
                    8,
                    (hoveredPoint.x /
                      svgWidth) *
                      100
                  )
                )}%`,

              top:
                Math.max(
                  8,
                  hoveredPoint.y -
                    58
                ),

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

              zIndex:
                10,
            }}
          >
            <div
              style={{
                fontWeight:
                  600,
              }}
            >
              {
                hoveredPoint.label
              }
            </div>

            <div
              style={{
                opacity:
                  0.8,
              }}
            >
              {
                hoveredPoint.value
              }
            </div>
          </div>
        )}
    </div>
  );
}