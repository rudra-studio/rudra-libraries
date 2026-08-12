import React, {
  useMemo,
  useState,
} from "react";

export interface GaugeSegment {
  from?: number;
  to: number;
  color?: string;
  label?: string;
  data?: any;
}

export interface GaugeChartProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className"
  > {
  value?: number;

  min?: number;

  max?: number;

  /**
   * Gauge range segments.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "properties":{
   *       "from":{"type":"number"},
   *       "to":{"type":"number"},
   *       "color":{"type":"string"},
   *       "label":{"type":"string"},
   *       "data":{"type":"object"}
   *     },
   *     "required":["to"]
   *   }
   * }
   */
  segments?: GaugeSegment[];

  height?: number;

  startAngle?: number;

  endAngle?: number;

  innerRadius?: number;

  outerRadius?: number;

  showNeedle?: boolean;

  showValue?: boolean;

  showLabel?: boolean;

  showMinMax?: boolean;

  showTicks?: boolean;

  showSegmentLabels?: boolean;

  showTooltip?: boolean;

  tickCount?: number;

  label?: string;

  valuePrefix?: string;

  valueSuffix?: string;

  precision?: number;

  /**
   * Background track color.
   *
   * @color
   */
  trackColor?: string;

  /**
   * Needle color.
   *
   * @color
   */
  needleColor?: string;

  /**
   * Value text color.
   *
   * @color
   */
  valueColor?: string;

  /**
   * Secondary text color.
   *
   * @color
   */
  textColor?: string;

  /**
   * Default segment color when
   * a segment has no color.
   *
   * @color
   */
  segmentColor?: string;

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
  onSegmentClick?: (
    segment: GaugeSegment,
    index: number
  ) => void;

  /** @type|function */
  onSegmentHover?: (
    segment: GaugeSegment,
    index: number
  ) => void;

  /** @type|function */
  onSegmentHoverEnd?: (
    segment: GaugeSegment,
    index: number
  ) => void;

  /** @type|function */
  onGaugeClick?: (
    value: number
  ) => void;
}

interface NormalizedSegment {
  item: GaugeSegment;
  index: number;
  from: number;
  to: number;
  color: string;
  label?: string;
}

const DEFAULT_SEGMENTS: GaugeSegment[] = [
  {
    "from": 0,
    "to": 40,
    "color": "#ef4444",
    "label": "Low"
  },
  {
    "from": 40,
    "to": 70,
    "color": "#f59e0b",
    "label": "Medium"
  },
  {
    "from": 70,
    "to": 100,
    "color": "#22c55e",
    "label": "Good"
  }
];

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );
}

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

function createArcPath(
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) {
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
      endAngle
    );

  const innerEnd =
    polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      endAngle
    );

  const innerStart =
    polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      startAngle
    );

  const largeArc =
    Math.abs(
      endAngle -
        startAngle
    ) > 180
      ? 1
      : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export default function GaugeChart({
  value = 72,

  min = 0,

  max = 100,

  segments = DEFAULT_SEGMENTS,

  height = 300,

  startAngle = -120,

  endAngle = 120,

  innerRadius = 82,

  outerRadius = 108,

  showNeedle = true,

  showValue = true,

  showLabel = true,

  showMinMax = true,

  showTicks = true,

  showSegmentLabels = false,

  showTooltip = true,

  tickCount = 5,

  label = "Performance",

  valuePrefix = "",

  valueSuffix = "%",

  precision = 0,

  trackColor = "#e5e7eb",

  needleColor = "#111827",

  valueColor = "#111827",

  textColor = "#6b7280",

  segmentColor = "#2563eb",

  className = "",

  chartClassName = "",

  onSegmentClick,

  onSegmentHover,

  onSegmentHoverEnd,

  onGaugeClick,

  style,

  ...props
}: GaugeChartProps) {
  const [
    hoveredIndex,
    setHoveredIndex,
  ] =
    useState<number | null>(
      null
    );

  const safeMin =
    Number.isFinite(min)
      ? min
      : 0;

  const safeMax =
    Number.isFinite(max) &&
    max > safeMin
      ? max
      : safeMin + 100;

  const safeValue =
    clamp(
      Number.isFinite(value)
        ? value
        : safeMin,
      safeMin,
      safeMax
    );

  const range =
    safeMax -
    safeMin;

  const angleRange =
    endAngle -
    startAngle;

  const valueToAngle = (
    currentValue: number
  ) =>
    startAngle +
    ((currentValue -
      safeMin) /
      range) *
      angleRange;

  const normalizedSegments =
    useMemo<
      NormalizedSegment[]
    >(() => {
      if (
        !Array.isArray(
          segments
        )
      ) {
        return [];
      }

      let previous =
        safeMin;

      return segments
        .map(
          (
            segment,
            index
          ) => {
            const rawFrom =
              Number(
                segment?.from
              );

            const rawTo =
              Number(
                segment?.to
              );

            if (
              !Number.isFinite(
                rawTo
              )
            ) {
              return null;
            }

            const from =
              clamp(
                Number.isFinite(
                  rawFrom
                )
                  ? rawFrom
                  : previous,
                safeMin,
                safeMax
              );

            const to =
              clamp(
                rawTo,
                safeMin,
                safeMax
              );

            previous = to;

            if (to <= from) {
              return null;
            }

            return {
              item:
                segment,

              index,

              from,

              to,

              color:
                segment.color ||
                segmentColor,

              label:
                segment.label,
            };
          }
        )
        .filter(
          (
            segment
          ): segment is NormalizedSegment =>
            Boolean(segment)
        );
    }, [
      segments,
      safeMin,
      safeMax,
      segmentColor,
    ]);

  const svgWidth =
    360;

  const svgHeight =
    280;

  const centerX =
    svgWidth / 2;

  const centerY =
    145;

  const safeOuterRadius =
    Math.max(
      40,
      Math.min(
        outerRadius,
        125
      )
    );

  const safeInnerRadius =
    Math.max(
      10,
      Math.min(
        innerRadius,
        safeOuterRadius -
          8
      )
    );

  const needleAngle =
    valueToAngle(
      safeValue
    );

  const needleLength =
    safeInnerRadius -
    8;

  const needleEnd =
    polarToCartesian(
      centerX,
      centerY,
      needleLength,
      needleAngle
    );

  const trackPath =
    createArcPath(
      centerX,
      centerY,
      safeInnerRadius,
      safeOuterRadius,
      startAngle,
      endAngle
    );

  const ticks =
    Array.from({
      length:
        Math.max(
          2,
          tickCount
        ),
    }).map(
      (
        _,
        index,
        array
      ) => {
        const ratio =
          array.length ===
          1
            ? 0
            : index /
              (array.length -
                1);

        const tickValue =
          safeMin +
          range * ratio;

        return {
          value:
            tickValue,

          angle:
            valueToAngle(
              tickValue
            ),
        };
      }
    );

  const hoveredSegment =
    hoveredIndex !==
    null
      ? normalizedSegments.find(
          (
            segment
          ) =>
            segment.index ===
            hoveredIndex
        ) ?? null
      : null;

  return (
    <div
      {...props}
      className={
        className
      }
      onClick={() => {
        onGaugeClick?.(
          safeValue
        );
      }}
      style={{
        position:
          "relative",

        width:
          "100%",

        minWidth:
          0,

        height,

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

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
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        role="img"
        aria-label={`Gauge value ${safeValue}`}
        style={{
          display:
            "block",

          width:
            "100%",

          maxWidth:
            460,

          height:
            "100%",

          overflow:
            "visible",
        }}
      >
        {/*
         * Base track
         */}
        <path
          d={
            trackPath
          }
          fill={
            trackColor
          }
        />

        {/*
         * Colored ranges
         */}
        {normalizedSegments.map(
          (
            segment
          ) => {
            const hovering =
              hoveredIndex ===
              segment.index;

            const segmentStart =
              valueToAngle(
                segment.from
              );

            const segmentEnd =
              valueToAngle(
                segment.to
              );

            const gap =
              normalizedSegments.length >
              1
                ? 1.2
                : 0;

            const path =
              createArcPath(
                centerX,
                centerY,
                safeInnerRadius +
                  (hovering
                    ? -3
                    : 0),
                safeOuterRadius +
                  (hovering
                    ? 5
                    : 0),
                segmentStart +
                  gap,
                segmentEnd -
                  gap
              );

            const middleAngle =
              (segmentStart +
                segmentEnd) /
              2;

            const labelPosition =
              polarToCartesian(
                centerX,
                centerY,
                safeOuterRadius +
                  20,
                middleAngle
              );

            return (
              <g
                key={
                  segment.index
                }
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  onSegmentClick?.(
                    segment.item,
                    segment.index
                  );
                }}
                onMouseEnter={() => {
                  setHoveredIndex(
                    segment.index
                  );

                  onSegmentHover?.(
                    segment.item,
                    segment.index
                  );
                }}
                onMouseLeave={() => {
                  setHoveredIndex(
                    null
                  );

                  onSegmentHoverEnd?.(
                    segment.item,
                    segment.index
                  );
                }}
                style={{
                  cursor:
                    onSegmentClick
                      ? "pointer"
                      : "default",
                }}
              >
                <path
                  d={path}
                  fill={
                    segment.color
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

                {showSegmentLabels &&
                  segment.label && (
                    <text
                      x={
                        labelPosition.x
                      }
                      y={
                        labelPosition.y
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={
                        textColor
                      }
                      fontSize="10"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {
                        segment.label
                      }
                    </text>
                  )}
              </g>
            );
          }
        )}

        {/*
         * Tick marks
         */}
        {showTicks &&
          ticks.map(
            (
              tick,
              index
            ) => {
              const outer =
                polarToCartesian(
                  centerX,
                  centerY,
                  safeInnerRadius -
                    5,
                  tick.angle
                );

              const inner =
                polarToCartesian(
                  centerX,
                  centerY,
                  safeInnerRadius -
                    12,
                  tick.angle
                );

              return (
                <line
                  key={
                    index
                  }
                  x1={
                    outer.x
                  }
                  y1={
                    outer.y
                  }
                  x2={
                    inner.x
                  }
                  y2={
                    inner.y
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                />
              );
            }
          )}

        {/*
         * Needle
         */}
        {showNeedle && (
          <g
            pointerEvents="none"
          >
            <line
              x1={
                centerX
              }
              y1={
                centerY
              }
              x2={
                needleEnd.x
              }
              y2={
                needleEnd.y
              }
              stroke={
                needleColor
              }
              strokeWidth="5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                transition:
                  "all 350ms ease",
              }}
            />

            <circle
              cx={
                centerX
              }
              cy={
                centerY
              }
              r="11"
              fill={
                needleColor
              }
            />

            <circle
              cx={
                centerX
              }
              cy={
                centerY
              }
              r="4"
              fill="#ffffff"
              opacity="0.9"
            />
          </g>
        )}

        {/*
         * Main value
         */}
        {showValue && (
          <text
            x={
              centerX
            }
            y="205"
            textAnchor="middle"
            fill={
              valueColor
            }
            fontSize="34"
            fontWeight="700"
          >
            {valuePrefix}
            {safeValue.toFixed(
              Math.max(
                0,
                precision
              )
            )}
            {valueSuffix}
          </text>
        )}

        {showLabel &&
          label && (
            <text
              x={
                centerX
              }
              y="228"
              textAnchor="middle"
              fill={
                textColor
              }
              fontSize="12"
              fontWeight="500"
            >
              {label}
            </text>
          )}

        {/*
         * Min / max values
         */}
        {showMinMax && (
          <>
            {(() => {
              const start =
                polarToCartesian(
                  centerX,
                  centerY,
                  safeOuterRadius +
                    20,
                  startAngle
                );

              const end =
                polarToCartesian(
                  centerX,
                  centerY,
                  safeOuterRadius +
                    20,
                  endAngle
                );

              return (
                <>
                  <text
                    x={
                      start.x
                    }
                    y={
                      start.y +
                      5
                    }
                    textAnchor="middle"
                    fill={
                      textColor
                    }
                    fontSize="11"
                  >
                    {
                      safeMin
                    }
                  </text>

                  <text
                    x={
                      end.x
                    }
                    y={
                      end.y +
                      5
                    }
                    textAnchor="middle"
                    fill={
                      textColor
                    }
                    fontSize="11"
                  >
                    {
                      safeMax
                    }
                  </text>
                </>
              );
            })()}
          </>
        )}
      </svg>

      {/*
       * Segment tooltip
       */}
      {showTooltip &&
        hoveredSegment && (
          <div
            style={{
              position:
                "absolute",

              left:
                "50%",

              top:
                18,

              transform:
                "translateX(-50%)",

              minWidth:
                105,

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
                10,
            }}
          >
            {hoveredSegment.label && (
              <div
                style={{
                  fontWeight:
                    600,
                }}
              >
                {
                  hoveredSegment.label
                }
              </div>
            )}

            <div
              style={{
                opacity:
                  0.82,
              }}
            >
              {
                hoveredSegment.from
              }
              {" – "}
              {
                hoveredSegment.to
              }
            </div>
          </div>
        )}
    </div>
  );
}