import React, {
  useId,
  useMemo,
  useState,
} from "react";

export type AreaChartCurve =
  | "linear"
  | "smooth"
  | "step";

export interface AreaChartProps
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

  /**
   * Area baseline.
   *
   * When not provided:
   * - positive data → 0
   * - negative data → 0
   * - mixed data → 0
   */
  baselineValue?: number;

  /** @select|linear|smooth|step */
  curve?: AreaChartCurve;

  showGrid?: boolean;

  showXAxis?: boolean;

  showYAxis?: boolean;

  showPoints?: boolean;

  showValues?: boolean;

  showTooltip?: boolean;

  showCrosshair?: boolean;

  showHoverArea?: boolean;

  useGradient?: boolean;

  gridLines?: number;

  lineWidth?: number;

  pointSize?: number;

  fillOpacity?: number;

  /**
   * Line color.
   *
   * @color
   */
  lineColor?: string;

  /**
   * Area fill color.
   *
   * @color
   */
  fillColor?: string;

  /**
   * Gradient end color.
   *
   * @color
   */
  gradientEndColor?: string;

  /**
   * Point color.
   *
   * @color
   */
  pointColor?: string;

  /**
   * Hover point color.
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
   * Text color.
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
   * SVG customization.
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
      points[index + 1];

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
      points[index - 1];

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

export default function AreaChart({
  data = [],

  categoryKey = "label",

  valueKey = "value",

  height = 340,

  minValue,

  maxValue,

  baselineValue,

  curve = "smooth",

  showGrid = true,

  showXAxis = true,

  showYAxis = true,

  showPoints = false,

  showValues = false,

  showTooltip = true,

  showCrosshair = true,

  showHoverArea = true,

  useGradient = true,

  gridLines = 5,

  lineWidth = 3,

  pointSize = 5,

  fillOpacity = 0.65,

  lineColor = "#2563eb",

  fillColor = "#3b82f6",

  gradientEndColor = "#ffffff",

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
}: AreaChartProps) {
  const gradientId =
    useId().replace(
      /:/g,
      ""
    );

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
                    index + 1
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
        Area Chart
        (No Data Bound)
      </div>
    );
  }

  const values =
    normalizedData.map(
      (entry) =>
        entry.value
    );

  const dataMin =
    Math.min(
      ...values
    );

  const dataMax =
    Math.max(
      ...values
    );

  const resolvedBaseline =
    typeof baselineValue ===
      "number"
      ? baselineValue
      : 0;

  /*
   * Area charts should generally
   * include their baseline in the
   * visible range.
   */
  let chartMin =
    typeof minValue ===
      "number"
      ? minValue
      : Math.min(
          dataMin,
          resolvedBaseline
        );

  let chartMax =
    typeof maxValue ===
      "number"
      ? maxValue
      : Math.max(
          dataMax,
          resolvedBaseline
        );

  /*
   * Give the top/bottom some
   * breathing room.
   */
  if (
    minValue === undefined ||
    maxValue === undefined
  ) {
    const rawRange =
      chartMax -
        chartMin ||
      Math.abs(
        chartMax
      ) ||
      1;

    const padding =
      rawRange * 0.08;

    if (
      maxValue ===
      undefined
    ) {
      chartMax +=
        padding;
    }

    /*
     * Don't push a zero baseline
     * below zero for positive data.
     */
    if (
      minValue ===
        undefined &&
      chartMin !==
        resolvedBaseline
    ) {
      chartMin -=
        padding;
    }
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
      ? 72
      : 24;

  const rightPadding =
    28;

  const topPadding =
    showValues
      ? 42
      : 28;

  const bottomPadding =
    showXAxis
      ? 56
      : 24;

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

  const baselineY =
    Math.min(
      topPadding +
        chartHeight,
      Math.max(
        topPadding,
        valueToY(
          resolvedBaseline
        )
      )
    );

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
              chartWidth / 2
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

  const areaPath =
    points.length
      ? [
          linePath,

          `L ${
            points[
              points.length - 1
            ].x
          } ${baselineY}`,

          `L ${
            points[0].x
          } ${baselineY}`,

          "Z",
        ].join(" ")
      : "";

  const lines =
    Math.max(
      2,
      gridLines
    );

  const hoveredPoint =
    hoveredIndex !== null
      ? points[
          hoveredIndex
        ]
      : null;

  const getInteractionWidth =
    (
      index: number
    ) => {
      if (
        points.length === 1
      ) {
        return chartWidth;
      }

      if (
        index === 0
      ) {
        return (
          points[1].x -
          points[0].x
        );
      }

      return (
        points[index].x -
        points[index - 1].x
      );
    };

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
        aria-label="Area chart"
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
        <defs>
          <linearGradient
            id={
              gradientId
            }
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={
                fillColor
              }
              stopOpacity={
                fillOpacity
              }
            />

            <stop
              offset="50%"
              stopColor={
                fillColor
              }
              stopOpacity={
                fillOpacity *
                0.45
              }
            />

            <stop
              offset="100%"
              stopColor={
                gradientEndColor
              }
              stopOpacity="0.03"
            />
          </linearGradient>
        </defs>

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
                    opacity="0.85"
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
         * Baseline
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
            baselineY
          }
          y2={
            baselineY
          }
          stroke={
            lineColor
          }
          strokeWidth="1"
          opacity="0.18"
          vectorEffect="non-scaling-stroke"
        />

        {/*
         * AREA
         */}
        <path
          d={
            areaPath
          }
          fill={
            useGradient
              ? `url(#${gradientId})`
              : fillColor
          }
          opacity={
            useGradient
              ? 1
              : fillOpacity
          }
        />

        {/*
         * Hovered vertical region.
         */}
        {showHoverArea &&
          hoveredPoint &&
          hoveredIndex !==
            null && (
            <rect
              x={
                hoveredPoint.x -
                getInteractionWidth(
                  hoveredIndex
                ) /
                  2
              }
              y={
                topPadding
              }
              width={
                getInteractionWidth(
                  hoveredIndex
                )
              }
              height={
                chartHeight
              }
              fill={
                lineColor
              }
              opacity="0.04"
              pointerEvents="none"
            />
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
         * Crosshair
         */}
        {showCrosshair &&
          hoveredPoint && (
            <line
              x1={
                hoveredPoint.x
              }
              x2={
                hoveredPoint.x
              }
              y1={
                topPadding
              }
              y2={
                baselineY
              }
              stroke={
                lineColor
              }
              strokeWidth="1"
              strokeDasharray="5 5"
              opacity="0.4"
              pointerEvents="none"
              vectorEffect="non-scaling-stroke"
            />
          )}

        {/*
         * X AXIS
         */}
        {showXAxis &&
          points.map(
            (
              point,
              index
            ) => (
              <text
                key={
                  `x-${index}`
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
         * Values
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
         * Optional permanent points.
         */}
        {showPoints &&
          points.map(
            (
              point,
              index
            ) => (
              <circle
                key={
                  `point-${index}`
                }
                cx={
                  point.x
                }
                cy={
                  point.y
                }
                r={
                  pointSize
                }
                fill={
                  pointColor
                }
                stroke="#ffffff"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
            )
          )}

        {/*
         * Interaction regions.
         *
         * Large invisible vertical
         * areas make hover easy.
         */}
        {points.map(
          (
            point,
            index
          ) => {
            const interactionWidth =
              getInteractionWidth(
                index
              );

            return (
              <rect
                key={
                  point.item
                    ?.id ??
                  `interaction-${index}`
                }
                x={
                  point.x -
                  interactionWidth /
                    2
                }
                y={
                  topPadding
                }
                width={
                  interactionWidth
                }
                height={
                  chartHeight
                }
                fill="transparent"
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
              />
            );
          }
        )}

        {/*
         * Hover point.
         */}
        {hoveredPoint && (
          <>
            <circle
              cx={
                hoveredPoint.x
              }
              cy={
                hoveredPoint.y
              }
              r={
                pointSize +
                7
              }
              fill={
                hoverColor
              }
              opacity="0.14"
              pointerEvents="none"
            />

            <circle
              cx={
                hoveredPoint.x
              }
              cy={
                hoveredPoint.y
              }
              r={
                pointSize +
                1
              }
              fill={
                hoverColor
              }
              stroke="#ffffff"
              strokeWidth="2.5"
              pointerEvents="none"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>

      {/*
       * Tooltip
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
                    64
                ),

              transform:
                "translateX(-50%)",

              minWidth:
                78,

              padding:
                "8px 11px",

              borderRadius:
                9,

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
                "0 8px 24px rgba(0,0,0,0.20)",

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
                marginTop:
                  2,

                opacity:
                  0.82,
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