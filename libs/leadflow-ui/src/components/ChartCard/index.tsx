import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  BarChart3,
  LineChart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import {
  max,
  scaleBand,
  scaleLinear,
  scalePoint,
  line as d3Line,
  curveMonotoneX,
} from 'd3';

export interface ChartCardDataItem {
  label: string;
  value: number;
  displayValue?: string;
}

export interface ChartCardProps {
  /**
   * Card title.
   * @translate
   */
  title?: string;

  /**
   * Supporting text below the title.
   * @translate
   */
  description?: string;

  /**
   * Chart data.
   * @type|complex
   * @schema {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "label": { "type": "string" },
   *       "value": { "type": "number" },
   *       "displayValue": { "type": "string" }
   *     },
   *     "required": ["label", "value"]
   *   }
   * }
   */
  data?: ChartCardDataItem[];

  /**
   * Chart visualization.
   * @select|bar|line
   */
  chartType?: 'bar' | 'line';

  /**
   * Formatted summary value.
   */
  value?: string;

  /**
   * Summary trend direction.
   * @select|none|up|down|neutral
   */
  trend?: 'none' | 'up' | 'down' | 'neutral';

  /**
   * Formatted trend value.
   */
  trendValue?: string;

  /**
   * Supporting trend text.
   * @translate
   */
  trendLabel?: string;

  /**
   * Chart accent.
   * @select|indigo|blue|emerald|violet|amber|rose
   */
  accent?:
    | 'indigo'
    | 'blue'
    | 'emerald'
    | 'violet'
    | 'amber'
    | 'rose';

  /**
   * Chart height.
   * @select|small|medium|large
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Show horizontal grid lines.
   */
  showGrid?: boolean;

  /**
   * Show category labels.
   */
  showLabels?: boolean;

  /**
   * Show hover tooltip.
   */
  showTooltip?: boolean;

  /**
   * Text displayed when data is empty.
   * @translate
   */
  emptyText?: string;

  /**
   * Utility classes exposed to Rudra.
   * @type|class
   */
  className?: string;
}

const HEIGHTS: Record<
  NonNullable<ChartCardProps['size']>,
  number
> = {
  small: 180,
  medium: 240,
  large: 320,
};

const ACCENTS: Record<
  NonNullable<ChartCardProps['accent']>,
  {
    stroke: string;
    fill: string;
    soft: string;
  }
> = {
  indigo: {
    stroke: '#6366f1',
    fill: '#6366f1',
    soft: '#eef2ff',
  },
  blue: {
    stroke: '#3b82f6',
    fill: '#3b82f6',
    soft: '#eff6ff',
  },
  emerald: {
    stroke: '#10b981',
    fill: '#10b981',
    soft: '#ecfdf5',
  },
  violet: {
    stroke: '#8b5cf6',
    fill: '#8b5cf6',
    soft: '#f5f3ff',
  },
  amber: {
    stroke: '#f59e0b',
    fill: '#f59e0b',
    soft: '#fffbeb',
  },
  rose: {
    stroke: '#f43f5e',
    fill: '#f43f5e',
    soft: '#fff1f2',
  },
};

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  item?: ChartCardDataItem;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title = '',
  description = '',
  data = [],
  chartType = 'bar',
  value = '',
  trend = 'none',
  trendValue = '',
  trendLabel = '',
  accent = 'indigo',
  size = 'medium',
  showGrid = true,
  showLabels = true,
  showTooltip = true,
  emptyText = 'No data available',
  className = '',
}) => {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [width, setWidth] =
    useState(0);

  const [tooltip, setTooltip] =
    useState<TooltipState>({
      visible: false,
      x: 0,
      y: 0,
    });

  const height = HEIGHTS[size];

  const colors = ACCENTS[accent];

  useEffect(() => {
    const element = containerRef.current;

    if (
      !element ||
      typeof ResizeObserver === 'undefined'
    ) {
      return;
    }

    const observer = new ResizeObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry) return;

        setWidth(entry.contentRect.width);
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const chart = useMemo(() => {
    if (!width || data.length === 0) {
      return null;
    }

    const margin = {
      top: 16,
      right: 8,
      bottom: showLabels ? 36 : 12,
      left: 8,
    };

    const innerWidth = Math.max(
      0,
      width -
        margin.left -
        margin.right,
    );

    const innerHeight = Math.max(
      0,
      height -
        margin.top -
        margin.bottom,
    );

    const maximum =
      max(data, (item) => item.value) ?? 0;

    const domainMax =
      maximum <= 0
        ? 1
        : maximum * 1.12;

    const yScale = scaleLinear()
      .domain([0, domainMax])
      .range([innerHeight, 0])
      .nice();

    const barScale = scaleBand<string>()
      .domain(
        data.map(
          (_, index) =>
            String(index),
        ),
      )
      .range([0, innerWidth])
      .padding(0.32);

    const pointScale = scalePoint<string>()
      .domain(
        data.map(
          (_, index) =>
            String(index),
        ),
      )
      .range([0, innerWidth])
      .padding(0.35);

    const gridValues = yScale.ticks(4);

    return {
      margin,
      innerWidth,
      innerHeight,
      yScale,
      barScale,
      pointScale,
      gridValues,
    };
  }, [
    width,
    height,
    data,
    showLabels,
  ]);

  const linePath = useMemo(() => {
    if (
      !chart ||
      chartType !== 'line'
    ) {
      return '';
    }

    const generator =
      d3Line<ChartCardDataItem>()
        .x((_, index) => {
          return (
            chart.pointScale(
              String(index),
            ) ?? 0
          );
        })
        .y((item) =>
          chart.yScale(item.value),
        )
        .curve(curveMonotoneX);

    return generator(data) ?? '';
  }, [chart, chartType, data]);

  const TrendIcon =
    trend === 'up'
      ? TrendingUp
      : trend === 'down'
        ? TrendingDown
        : null;

  const ChartIcon =
    chartType === 'line'
      ? LineChart
      : BarChart3;

  const trendClasses =
    trend === 'up'
      ? `
          bg-emerald-50
          text-emerald-700
          dark:bg-emerald-500/10
          dark:text-emerald-300
        `
      : trend === 'down'
        ? `
            bg-rose-50
            text-rose-700
            dark:bg-rose-500/10
            dark:text-rose-300
          `
        : `
            bg-slate-100
            text-slate-600
            dark:bg-slate-800
            dark:text-slate-300
          `;

  const showItemTooltip = (
    event:
      | React.MouseEvent<SVGElement>
      | React.FocusEvent<SVGElement>,
    item: ChartCardDataItem,
  ) => {
    if (!showTooltip) return;

    const container =
      containerRef.current;

    if (!container) return;

    const bounds =
      container.getBoundingClientRect();

    const target =
      event.currentTarget.getBoundingClientRect();

    setTooltip({
      visible: true,
      item,
      x:
        target.left -
        bounds.left +
        target.width / 2,
      y:
        target.top -
        bounds.top -
        8,
    });
  };

  const hideTooltip = () => {
    setTooltip((current) => ({
      ...current,
      visible: false,
    }));
  };

  return (
    <section
      className={`
        min-w-0
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        shadow-slate-950/[0.025]

        dark:border-slate-800
        dark:bg-slate-950
        dark:shadow-black/10

        sm:p-6

        ${className}
      `}
    >
      {/* Header */}
      <div
        className="
          flex flex-wrap
          items-start
          justify-between
          gap-4
        "
      >
        <div className="min-w-0">
          {title && (
            <h2
              className="
                truncate
                text-sm
                font-semibold
                text-slate-900

                dark:text-slate-100
              "
            >
              {title}
            </h2>
          )}

          {description && (
            <p
              className="
                mt-1
                text-xs
                text-slate-500

                dark:text-slate-400
              "
            >
              {description}
            </p>
          )}
        </div>

        <span
          className="
            flex h-9 w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-50
            text-slate-500

            dark:bg-slate-900
            dark:text-slate-400
          "
        >
          <ChartIcon
            size={18}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>
      </div>

      {/* Summary */}
      {(value ||
        trendValue ||
        trendLabel) && (
        <div
          className="
            mt-5
            flex flex-wrap
            items-end
            gap-x-3 gap-y-2
          "
        >
          {value && (
            <span
              className="
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-slate-950

                dark:text-white

                sm:text-[28px]
              "
            >
              {value}
            </span>
          )}

          {(trendValue ||
            trendLabel) && (
            <div
              className="
                mb-0.5
                flex flex-wrap
                items-center
                gap-2
              "
            >
              {trend !== 'none' &&
                trendValue && (
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      px-2 py-1
                      text-[11px]
                      font-semibold

                      ${trendClasses}
                    `}
                  >
                    {TrendIcon && (
                      <TrendIcon
                        size={12}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}

                    {trendValue}
                  </span>
                )}

              {trendLabel && (
                <span
                  className="
                    text-xs
                    text-slate-400

                    dark:text-slate-500
                  "
                >
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      <div
        ref={containerRef}
        className="
          relative
          mt-6
          min-w-0
          overflow-hidden
        "
      >
        {data.length > 0 ? (
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${
              width || 1
            } ${height}`}
            role="img"
            aria-label={
              title
                ? `${title} chart`
                : 'Chart'
            }
            className="
              block
              overflow-visible
            "
          >
            {chart && (
              <g
                transform={`translate(
                  ${chart.margin.left},
                  ${chart.margin.top}
                )`}
              >
                {/* Grid */}
                {showGrid &&
                  chart.gridValues.map(
                    (tick) => {
                      const y =
                        chart.yScale(
                          tick,
                        );

                      return (
                        <line
                          key={tick}
                          x1={0}
                          x2={
                            chart.innerWidth
                          }
                          y1={y}
                          y2={y}
                          stroke="currentColor"
                          strokeDasharray="4 5"
                          className="
                            text-slate-100
                            dark:text-slate-800
                          "
                        />
                      );
                    },
                  )}

                {/* Bar chart */}
                {chartType === 'bar' &&
                  data.map(
                    (item, index) => {
                      const x =
                        chart.barScale(
                          String(index),
                        ) ?? 0;

                      const y =
                        chart.yScale(
                          item.value,
                        );

                      const barWidth =
                        chart.barScale.bandwidth();

                      const barHeight =
                        Math.max(
                          0,
                          chart.innerHeight -
                            y,
                        );

                      return (
                        <g
                          key={`${item.label}-${index}`}
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
                            rx={6}
                            fill={
                              colors.fill
                            }
                            tabIndex={0}
                            role="img"
                            aria-label={`${
                              item.label
                            }: ${
                              item.displayValue ??
                              item.value
                            }`}
                            className="
                              cursor-pointer
                              outline-none
                              transition-opacity
                              hover:opacity-80
                              focus:opacity-80
                            "
                            onMouseEnter={(
                              event,
                            ) =>
                              showItemTooltip(
                                event,
                                item,
                              )
                            }
                            onMouseLeave={
                              hideTooltip
                            }
                            onFocus={(
                              event,
                            ) =>
                              showItemTooltip(
                                event,
                                item,
                              )
                            }
                            onBlur={
                              hideTooltip
                            }
                          />
                        </g>
                      );
                    },
                  )}

                {/* Line chart */}
                {chartType === 'line' &&
                  linePath && (
                    <>
                      <path
                        d={linePath}
                        fill="none"
                        stroke={
                          colors.stroke
                        }
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {data.map(
                        (
                          item,
                          index,
                        ) => {
                          const x =
                            chart.pointScale(
                              String(
                                index,
                              ),
                            ) ?? 0;

                          const y =
                            chart.yScale(
                              item.value,
                            );

                          return (
                            <circle
                              key={`${item.label}-${index}`}
                              cx={x}
                              cy={y}
                              r={5}
                              fill={
                                colors.fill
                              }
                              stroke="white"
                              strokeWidth={
                                2
                              }
                              tabIndex={0}
                              role="img"
                              aria-label={`${
                                item.label
                              }: ${
                                item.displayValue ??
                                item.value
                              }`}
                              className="
                                cursor-pointer
                                outline-none
                                transition-[r]
                                hover:[r:7px]
                                focus:[r:7px]
                              "
                              onMouseEnter={(
                                event,
                              ) =>
                                showItemTooltip(
                                  event,
                                  item,
                                )
                              }
                              onMouseLeave={
                                hideTooltip
                              }
                              onFocus={(
                                event,
                              ) =>
                                showItemTooltip(
                                  event,
                                  item,
                                )
                              }
                              onBlur={
                                hideTooltip
                              }
                            />
                          );
                        },
                      )}
                    </>
                  )}

                {/* X labels */}
                {showLabels &&
                  data.map(
                    (item, index) => {
                      const x =
                        chartType ===
                        'bar'
                          ? (chart.barScale(
                              String(
                                index,
                              ),
                            ) ??
                              0) +
                            chart.barScale.bandwidth() /
                              2
                          : chart.pointScale(
                              String(
                                index,
                              ),
                            ) ??
                            0;

                      return (
                        <text
                          key={`label-${item.label}-${index}`}
                          x={x}
                          y={
                            chart.innerHeight +
                            24
                          }
                          textAnchor="middle"
                          className="
                            fill-slate-400
                            text-[10px]

                            dark:fill-slate-500

                            sm:text-[11px]
                          "
                        >
                          {item.label}
                        </text>
                      );
                    },
                  )}
              </g>
            )}
          </svg>
        ) : (
          <div
            style={{
              height,
            }}
            className="
              flex
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-slate-200
              bg-slate-50/60
              px-4
              text-center
              text-sm
              text-slate-400

              dark:border-slate-800
              dark:bg-slate-900/40
              dark:text-slate-500
            "
          >
            {emptyText}
          </div>
        )}

        {/* Tooltip */}
        {tooltip.visible &&
          tooltip.item && (
            <div
              role="tooltip"
              style={{
                left: tooltip.x,
                top: tooltip.y,
              }}
              className="
                pointer-events-none
                absolute z-20
                -translate-x-1/2
                -translate-y-full
                whitespace-nowrap
                rounded-lg
                border
                border-slate-200
                bg-white
                px-2.5 py-2
                shadow-lg

                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <div
                className="
                  text-[10px]
                  font-medium
                  text-slate-400

                  dark:text-slate-500
                "
              >
                {tooltip.item.label}
              </div>

              <div
                className="
                  mt-0.5
                  text-xs
                  font-semibold
                  text-slate-900

                  dark:text-white
                "
              >
                {tooltip.item
                  .displayValue ??
                  tooltip.item.value}
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default ChartCard;