import React, {
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type CalendarSelectionMode =
  | "none"
  | "single"
  | "multiple";

export type CalendarWeekStart =
  | "sunday"
  | "monday";

export interface CalendarEvent {
  id: string;

  /**
   * YYYY-MM-DD
   */
  date: string;

  title?: string;

  color?: string;

  data?: any;
}

export interface CalendarDayContext {
  /**
   * YYYY-MM-DD
   */
  date: string;

  day: number;

  month: number;

  year: number;

  index: number;

  today: boolean;

  selected: boolean;

  disabled: boolean;

  outsideMonth: boolean;

  events: CalendarEvent[];

  select: () => void;
}

export interface CalendarProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className" | "onSelect"
  > {
  /**
   * Custom day renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: CalendarDayContext
      ) => React.ReactNode);

  /**
   * YYYY-MM
   *
   * Controlled visible month.
   */
  month?: string;

  /**
   * YYYY-MM
   *
   * Initial visible month.
   */
  defaultMonth?: string;

  /**
   * @select|none|single|multiple
   */
  selectionMode?: CalendarSelectionMode;

  /**
   * Controlled selected dates.
   *
   * YYYY-MM-DD[]
   *
   * @type|json
   */
  selectedDates?: string[];

  /**
   * Initial selected dates.
   *
   * @type|json
   */
  defaultSelectedDates?: string[];

  /**
   * Minimum selectable date.
   *
   * YYYY-MM-DD
   */
  minDate?: string;

  /**
   * Maximum selectable date.
   *
   * YYYY-MM-DD
   */
  maxDate?: string;

  /**
   * Explicit disabled dates.
   *
   * YYYY-MM-DD[]
   *
   * @type|json
   */
  disabledDates?: string[];

  /**
   * Calendar events.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","date"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "date":{"type":"string"},
   *       "title":{"type":"string"},
   *       "color":{"type":"string"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  events?: CalendarEvent[];

  /**
   * @select|sunday|monday
   */
  weekStartsOn?: CalendarWeekStart;

  /**
   * Show days belonging to the
   * previous/next month.
   */
  showOutsideDays?: boolean;

  /**
   * Show event indicators.
   */
  showEvents?: boolean;

  /**
   * Maximum number of event dots
   * displayed per day.
   */
  maxEventIndicators?: number;

  /**
   * Show month/year header.
   */
  showHeader?: boolean;

  /**
   * Show weekday labels.
   */
  showWeekdays?: boolean;

  /**
   * Allow month navigation.
   */
  navigable?: boolean;

  /**
   * Highlight today's date.
   */
  highlightToday?: boolean;

  /**
   * @color
   */
  selectedColor?: string;

  /**
   * @color
   */
  todayColor?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  headerClassName?: string;

  /**
   * @type|class
   */
  weekdayClassName?: string;

  /**
   * @type|class
   */
  dayClassName?: string;

  /**
   * @type|class
   */
  selectedDayClassName?: string;

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
  onDateClick?: (
    date: string,
    context: CalendarDayContext
  ) => void;

  /**
   * @type|function
   */
  onSelectionChange?: (
    dates: string[]
  ) => void;

  /**
   * @type|function
   */
  onMonthChange?: (
    month: string
  ) => void;

  /**
   * @type|function
   */
  onEventClick?: (
    event: CalendarEvent,
    date: string
  ) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SUNDAY_WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const MONDAY_WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

function pad(
  value: number
) {
  return String(
    value
  ).padStart(
    2,
    "0"
  );
}

function dateKey(
  year: number,
  month: number,
  day: number
) {
  return `${year}-${pad(
    month + 1
  )}-${pad(day)}`;
}

function monthKey(
  year: number,
  month: number
) {
  return `${year}-${pad(
    month + 1
  )}`;
}

function parseMonth(
  value?: string
) {
  if (
    value &&
    /^\d{4}-\d{2}$/.test(
      value
    )
  ) {
    const [
      year,
      month,
    ] = value
      .split("-")
      .map(Number);

    if (
      month >= 1 &&
      month <= 12
    ) {
      return {
        year,
        month:
          month - 1,
      };
    }
  }

  const now =
    new Date();

  return {
    year:
      now.getFullYear(),

    month:
      now.getMonth(),
  };
}

function compareDateKeys(
  left: string,
  right: string
) {
  return left.localeCompare(
    right
  );
}

export default function Calendar({
  children,

  month,

  defaultMonth,

  selectionMode = "single",

  selectedDates,

  defaultSelectedDates = [],

  minDate,

  maxDate,

  disabledDates = [],

  events = [],

  weekStartsOn = "sunday",

  showOutsideDays = true,

  showEvents = true,

  maxEventIndicators = 3,

  showHeader = true,

  showWeekdays = true,

  navigable = true,

  highlightToday = true,

  selectedColor = "#2563eb",

  todayColor = "#2563eb",

  className = "w-full",

  headerClassName = "",

  weekdayClassName = "",

  dayClassName = "",

  selectedDayClassName = "",

  customAttributes = {},

  onDateClick,

  onSelectionChange,

  onMonthChange,

  onEventClick,

  style,

  ...props
}: CalendarProps) {
  const initialMonth =
    parseMonth(
      defaultMonth
    );

  const [
    internalYear,
    setInternalYear,
  ] = useState(
    initialMonth.year
  );

  const [
    internalMonth,
    setInternalMonth,
  ] = useState(
    initialMonth.month
  );

  const [
    internalSelectedDates,
    setInternalSelectedDates,
  ] = useState<string[]>(
    defaultSelectedDates
  );

  const monthControlled =
    month !== undefined;

  const selectionControlled =
    selectedDates !==
    undefined;

  const resolvedMonth =
    monthControlled
      ? parseMonth(month)
      : {
          year:
            internalYear,

          month:
            internalMonth,
        };

  const resolvedSelectedDates =
    selectionControlled
      ? selectedDates
      : internalSelectedDates;

  const selectedSet =
    useMemo(
      () =>
        new Set(
          resolvedSelectedDates
        ),
      [resolvedSelectedDates]
    );

  const disabledSet =
    useMemo(
      () =>
        new Set(
          disabledDates
        ),
      [disabledDates]
    );

  const eventsByDate =
    useMemo(() => {
      const result =
        new Map<
          string,
          CalendarEvent[]
        >();

      events.forEach(
        (event) => {
          const list =
            result.get(
              event.date
            );

          if (list) {
            list.push(
              event
            );
          } else {
            result.set(
              event.date,
              [event]
            );
          }
        }
      );

      return result;
    }, [
      events,
    ]);

  const today =
    new Date();

  const todayKey =
    dateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

  const weekdays =
    weekStartsOn ===
    "monday"
      ? MONDAY_WEEKDAYS
      : SUNDAY_WEEKDAYS;

  const days =
    useMemo(() => {
      const {
        year,
        month,
      } = resolvedMonth;

      const firstDay =
        new Date(
          year,
          month,
          1
        );

      let firstWeekday =
        firstDay.getDay();

      if (
        weekStartsOn ===
        "monday"
      ) {
        firstWeekday =
          (
            firstWeekday +
            6
          ) %
          7;
      }

      const gridStart =
        new Date(
          year,
          month,
          1 -
            firstWeekday
        );

      return Array.from(
        {
          length: 42,
        },
        (_, index) => {
          const current =
            new Date(
              gridStart.getFullYear(),
              gridStart.getMonth(),
              gridStart.getDate() +
                index
            );

          return {
            year:
              current.getFullYear(),

            month:
              current.getMonth(),

            day:
              current.getDate(),

            date:
              dateKey(
                current.getFullYear(),
                current.getMonth(),
                current.getDate()
              ),

            outsideMonth:
              current.getMonth() !==
                month ||
              current.getFullYear() !==
                year,
          };
        }
      );
    }, [
      resolvedMonth.year,
      resolvedMonth.month,
      weekStartsOn,
    ]);

  const isDisabled = (
    date: string
  ) => {
    if (
      disabledSet.has(
        date
      )
    ) {
      return true;
    }

    if (
      minDate &&
      compareDateKeys(
        date,
        minDate
      ) < 0
    ) {
      return true;
    }

    if (
      maxDate &&
      compareDateKeys(
        date,
        maxDate
      ) > 0
    ) {
      return true;
    }

    return false;
  };

  const selectDate = (
    date: string
  ) => {
    if (
      selectionMode ===
        "none" ||
      isDisabled(date)
    ) {
      return;
    }

    let next: string[];

    if (
      selectionMode ===
      "single"
    ) {
      next =
        selectedSet.has(
          date
        )
          ? []
          : [date];
    } else {
      next =
        selectedSet.has(
          date
        )
          ? resolvedSelectedDates.filter(
              (value) =>
                value !==
                date
            )
          : [
              ...resolvedSelectedDates,
              date,
            ];
    }

    if (
      !selectionControlled
    ) {
      setInternalSelectedDates(
        next
      );
    }

    onSelectionChange?.(
      next
    );
  };

  const changeMonth = (
    offset: number
  ) => {
    if (!navigable) {
      return;
    }

    const next =
      new Date(
        resolvedMonth.year,
        resolvedMonth.month +
          offset,
        1
      );

    const nextYear =
      next.getFullYear();

    const nextMonth =
      next.getMonth();

    if (
      !monthControlled
    ) {
      setInternalYear(
        nextYear
      );

      setInternalMonth(
        nextMonth
      );
    }

    onMonthChange?.(
      monthKey(
        nextYear,
        nextMonth
      )
    );
  };

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

        maxWidth:
          520,

        padding:
          12,

        border:
          "1px solid #e5e7eb",

        borderRadius:
          12,

        background:
          "#ffffff",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {showHeader && (
        <div
          className={
            headerClassName
          }
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: 12,

            marginBottom:
              12,
          }}
        >
          <button
            type="button"
            title="Previous month"
            aria-label="Previous month"
            disabled={
              !navigable
            }
            onClick={() =>
              changeMonth(
                -1
              )
            }
            style={{
              width: 34,

              height: 34,

              display:
                "inline-flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              padding: 0,

              border:
                "1px solid #e5e7eb",

              borderRadius:
                7,

              background:
                "#ffffff",

              color:
                "#4b5563",

              cursor:
                navigable
                  ? "pointer"
                  : "default",

              opacity:
                navigable
                  ? 1
                  : 0.4,
            }}
          >
            <ChevronLeft
              size={17}
            />
          </button>

          <div
            style={{
              minWidth: 0,

              color:
                "#111827",

              fontSize:
                14,

              fontWeight:
                700,

              textAlign:
                "center",
            }}
          >
            {
              MONTH_NAMES[
                resolvedMonth
                  .month
              ]
            }{" "}
            {
              resolvedMonth
                .year
            }
          </div>

          <button
            type="button"
            title="Next month"
            aria-label="Next month"
            disabled={
              !navigable
            }
            onClick={() =>
              changeMonth(
                1
              )
            }
            style={{
              width: 34,

              height: 34,

              display:
                "inline-flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              padding: 0,

              border:
                "1px solid #e5e7eb",

              borderRadius:
                7,

              background:
                "#ffffff",

              color:
                "#4b5563",

              cursor:
                navigable
                  ? "pointer"
                  : "default",

              opacity:
                navigable
                  ? 1
                  : 0.4,
            }}
          >
            <ChevronRight
              size={17}
            />
          </button>
        </div>
      )}

      {showWeekdays && (
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(7, minmax(0, 1fr))",

            marginBottom:
              4,
          }}
        >
          {weekdays.map(
            (weekday) => (
              <div
                key={
                  weekday
                }
                className={
                  weekdayClassName
                }
                style={{
                  padding:
                    "5px 2px",

                  color:
                    "#9ca3af",

                  fontSize:
                    10,

                  fontWeight:
                    700,

                  textAlign:
                    "center",

                  textTransform:
                    "uppercase",

                  letterSpacing:
                    "0.04em",

                  boxSizing:
                    "border-box",
                }}
              >
                {weekday}
              </div>
            )
          )}
        </div>
      )}

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(7, minmax(0, 1fr))",

          gap: 3,

          width:
            "100%",
        }}
      >
        {days.map(
          (
            entry,
            index
          ) => {
            const selected =
              selectedSet.has(
                entry.date
              );

            const disabled =
              isDisabled(
                entry.date
              );

            const today =
              entry.date ===
              todayKey;

            const dayEvents =
              eventsByDate.get(
                entry.date
              ) ?? [];

            const visible =
              !entry.outsideMonth ||
              showOutsideDays;

            const context:
              CalendarDayContext = {
              date:
                entry.date,

              day:
                entry.day,

              month:
                entry.month +
                1,

              year:
                entry.year,

              index,

              today,

              selected,

              disabled,

              outsideMonth:
                entry.outsideMonth,

              events:
                dayEvents,

              select: () =>
                selectDate(
                  entry.date
                ),
            };

            if (!visible) {
              return (
                <div
                  key={
                    entry.date
                  }
                  aria-hidden="true"
                  style={{
                    minHeight:
                      58,
                  }}
                />
              );
            }

            return (
              <button
                key={
                  entry.date
                }
                type="button"
                disabled={
                  disabled
                }
                aria-label={
                  entry.date
                }
                aria-pressed={
                  selectionMode !==
                  "none"
                    ? selected
                    : undefined
                }
                className={`${dayClassName} ${
                  selected
                    ? selectedDayClassName
                    : ""
                }`}
                onClick={() => {
                  if (
                    disabled
                  ) {
                    return;
                  }

                  selectDate(
                    entry.date
                  );

                  onDateClick?.(
                    entry.date,
                    context
                  );
                }}
                style={{
                  position:
                    "relative",

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  justifyContent:
                    "flex-start",

                  gap: 3,

                  minWidth:
                    0,

                  minHeight:
                    58,

                  padding:
                    "7px 3px 5px",

                  border:
                    today &&
                    highlightToday &&
                    !selected
                      ? `1px solid ${todayColor}`
                      : "1px solid transparent",

                  borderRadius:
                    8,

                  background:
                    selected
                      ? selectedColor
                      : "transparent",

                  color:
                    selected
                      ? "#ffffff"
                      : disabled
                        ? "#d1d5db"
                        : entry.outsideMonth
                          ? "#9ca3af"
                          : "#374151",

                  cursor:
                    disabled
                      ? "not-allowed"
                      : "pointer",

                  opacity:
                    disabled
                      ? 0.55
                      : 1,

                  boxSizing:
                    "border-box",

                  overflow:
                    "hidden",
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
                    <span
                      style={{
                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        minWidth:
                          24,

                        height:
                          24,

                        fontSize:
                          12,

                        fontWeight:
                          today
                            ? 700
                            : 500,

                        lineHeight:
                          1,
                      }}
                    >
                      {
                        entry.day
                      }
                    </span>

                    {showEvents &&
                      dayEvents.length >
                        0 && (
                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            gap: 2,

                            width:
                              "100%",

                            minHeight:
                              7,
                          }}
                        >
                          {dayEvents
                            .slice(
                              0,
                              Math.max(
                                0,
                                maxEventIndicators
                              )
                            )
                            .map(
                              (
                                event
                              ) => (
                                <span
                                  key={
                                    event.id
                                  }
                                  title={
                                    event.title
                                  }
                                  onClick={(
                                    clickEvent
                                  ) => {
                                    clickEvent.stopPropagation();

                                    onEventClick?.(
                                      event,
                                      entry.date
                                    );
                                  }}
                                  style={{
                                    width:
                                      5,

                                    height:
                                      5,

                                    borderRadius:
                                      "50%",

                                    background:
                                      selected
                                        ? "#ffffff"
                                        : event.color ??
                                          "#2563eb",

                                    opacity:
                                      selected
                                        ? 0.9
                                        : 1,

                                    flexShrink:
                                      0,
                                  }}
                                />
                              )
                            )}
                        </div>
                      )}
                  </>
                )}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}