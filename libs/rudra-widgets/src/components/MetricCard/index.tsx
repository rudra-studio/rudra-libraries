import React from "react";

export type MetricTrend =
  | "up"
  | "down"
  | "neutral";

export interface MetricCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  label?: string;

  value?: string | number;

  description?: string;

  /**
   * Optional leading/trailing text.
   *
   * Example:
   * prefix="$"
   * suffix="%"
   */
  prefix?: string;

  suffix?: string;

  /**
   * @select|up|down|neutral
   */
  trend?: MetricTrend;

  /**
   * Example:
   * "+12.5%"
   */
  trendValue?: string;

  /**
   * Example:
   * "vs last month"
   */
  trendLabel?: string;

  /**
   * Sparkline numbers.
   *
   * @type|json
   */
  chartData?: number[];

  showChart?: boolean;

  showTrend?: boolean;

  /**
   * @select|line|area
   */
  chartType?: "line" | "area";

  /**
   * Optional custom icon/content area.
   */
  icon?: React.ReactNode;

  /**
   * Optional additional content.
   */
  children?: React.ReactNode;

  /**
   * @color
   */
  accentColor?: string;

  /**
   * @color
   */
  positiveColor?: string;

  /**
   * @color
   */
  negativeColor?: string;

  /**
   * @color
   */
  neutralColor?: string;

  chartHeight?: number;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  labelClassName?: string;

  /**
   * @type|class
   */
  valueClassName?: string;

  /**
   * @type|class
   */
  descriptionClassName?: string;

  /**
   * @type|class
   */
  trendClassName?: string;

  /**
   * @type|class
   */
  chartClassName?: string;

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
  onClick?: () => void;
}

function createChartPoints(
  data: number[],
  width: number,
  height: number
) {
  if (
    data.length === 0
  ) {
    return "";
  }

  if (
    data.length === 1
  ) {
    return `0,${height / 2} ${width},${height / 2}`;
  }

  const min =
    Math.min(...data);

  const max =
    Math.max(...data);

  const range =
    max - min || 1;

  return data
    .map(
      (
        value,
        index
      ) => {
        const x =
          (
            index /
            (
              data.length -
              1
            )
          ) *
          width;

        const normalized =
          (
            value -
            min
          ) /
          range;

        const y =
          height -
          normalized *
            height;

        return `${x},${y}`;
      }
    )
    .join(" ");
}

export default function MetricCard({
  label = "Revenue",

  value = "₹1,24,500",

  description,

  prefix = "",

  suffix = "",

  trend = "up",

  trendValue = "+12.5%",

  trendLabel = "vs last month",

  chartData = [
    28,
    34,
    30,
    42,
    38,
    50,
    47,
    61,
    56,
    72,
    68,
    82,
  ],

  showChart = true,

  showTrend = true,

  chartType = "area",

  icon,

  children,

  accentColor = "#2563eb",

  positiveColor = "#16a34a",

  negativeColor = "#dc2626",

  neutralColor = "#6b7280",

  chartHeight = 70,

  className = "w-full",

  labelClassName = "",

  valueClassName = "",

  descriptionClassName = "",

  trendClassName = "",

  chartClassName = "",

  customAttributes = {},

  onClick,

  style,

  ...props
}: MetricCardProps) {
  const width =
    300;

  const safeHeight =
    Math.max(
      30,
      chartHeight
    );

  const points =
    createChartPoints(
      chartData,
      width,
      safeHeight
    );

  const trendColor =
    trend === "up"
      ? positiveColor
      : trend === "down"
        ? negativeColor
        : neutralColor;

  const trendIcon =
    trend === "up"
      ? "↗"
      : trend === "down"
        ? "↘"
        : "→";

  const areaPoints =
    points
      ? `0,${safeHeight} ${points} ${width},${safeHeight}`
      : "";

  return (
    <div
      className={
        className
      }
      {...customAttributes}
      {...props}
      onClick={() => {
        onClick?.();
      }}
      style={{
        position:
          "relative",

        width:
          "100%",

        minWidth: 0,

        overflow:
          "hidden",

        padding:
          18,

        border:
          "1px solid #e5e7eb",

        borderRadius:
          12,

        background:
          "#ffffff",

        boxSizing:
          "border-box",

        cursor:
          onClick
            ? "pointer"
            : "default",

        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display:
            "flex",

          alignItems:
            "flex-start",

          justifyContent:
            "space-between",

          gap: 12,

          minWidth: 0,
        }}
      >
        <div
          style={{
            minWidth: 0,

            flex: 1,
          }}
        >
          <div
            className={
              labelClassName
            }
            style={{
              color:
                "#6b7280",

              fontSize:
                12,

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
            {label}
          </div>

          <div
            className={
              valueClassName
            }
            style={{
              marginTop:
                6,

              color:
                "#111827",

              fontSize:
                28,

              fontWeight:
                700,

              lineHeight:
                1.15,

              letterSpacing:
                "-0.02em",

              wordBreak:
                "break-word",
            }}
          >
            {prefix}
            {value}
            {suffix}
          </div>

          {description && (
            <div
              className={
                descriptionClassName
              }
              style={{
                marginTop:
                  5,

                color:
                  "#9ca3af",

                fontSize:
                  11,

                lineHeight:
                  1.5,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {icon && (
          <div
            style={{
              width: 40,

              height: 40,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexShrink:
                0,

              borderRadius:
                10,

              background:
                `${accentColor}14`,

              color:
                accentColor,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}
      {showTrend && (
        <div
          className={
            trendClassName
          }
          style={{
            display:
              "flex",

            alignItems:
              "center",

            flexWrap:
              "wrap",

            gap: 5,

            marginTop:
              12,
          }}
        >
          <span
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              gap: 3,

              color:
                trendColor,

              fontSize:
                12,

              fontWeight:
                600,
            }}
          >
            <span>
              {trendIcon}
            </span>

            {trendValue}
          </span>

          {trendLabel && (
            <span
              style={{
                color:
                  "#9ca3af",

                fontSize:
                  11,
              }}
            >
              {trendLabel}
            </span>
          )}
        </div>
      )}

      {/* Sparkline */}
      {showChart &&
        chartData.length >
          0 && (
          <div
            className={
              chartClassName
            }
            style={{
              position:
                "relative",

              width:
                "100%",

              height:
                safeHeight,

              marginTop:
                14,

              overflow:
                "hidden",

              boxSizing:
                "border-box",
            }}
          >
            <svg
              viewBox={`0 0 ${width} ${safeHeight}`}
              preserveAspectRatio="none"
              width="100%"
              height="100%"
              role="img"
              aria-label={`${label} trend`}
              style={{
                display:
                  "block",

                width:
                  "100%",

                height:
                  "100%",

                overflow:
                  "visible",
              }}
            >
              {chartType ===
                "area" &&
                areaPoints && (
                  <polygon
                    points={
                      areaPoints
                    }
                    fill={
                      accentColor
                    }
                    opacity={
                      0.1
                    }
                  />
                )}

              <polyline
                points={
                  points
                }
                fill="none"
                stroke={
                  accentColor
                }
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        )}

      {children && (
        <div
          style={{
            marginTop:
              12,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}