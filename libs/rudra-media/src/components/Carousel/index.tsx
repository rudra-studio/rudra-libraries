import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface CarouselProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /** @optional */
  items?: any[];

  /**
   * Slide template.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: {
          item: any;
          index: number;
          active: boolean;
        }
      ) => React.ReactNode);

  activeIndex?: number;

  defaultActiveIndex?: number;

  loop?: boolean;

  autoPlay?: boolean;

  autoPlayInterval?: number;

  pauseOnHover?: boolean;

  keyboardNavigation?: boolean;

  swipeNavigation?: boolean;

  swipeThreshold?: number;

  showControls?: boolean;

  showIndicators?: boolean;

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
   * Track customization.
   *
   * @type|class
   */
  trackClassName?: string;

  /**
   * Slide customization.
   *
   * @type|class
   */
  slideClassName?: string;

  /**
   * Navigation button customization.
   *
   * @type|class
   */
  controlClassName?: string;

  /**
   * Indicator container customization.
   *
   * @type|class
   */
  indicatorsClassName?: string;

  /**
   * Indicator customization.
   *
   * @type|class
   */
  indicatorClassName?: string;

  /**
   * Active indicator customization.
   *
   * @type|class
   */
  activeIndicatorClassName?: string;

  /** @type|function */
  onActiveIndexChange?: (
    index: number,
    item: any
  ) => void;
}

export default function Carousel({
  items = [],

  children,

  activeIndex,

  defaultActiveIndex = 0,

  loop = true,

  autoPlay = false,

  autoPlayInterval = 4000,

  pauseOnHover = true,

  keyboardNavigation = true,

  swipeNavigation = true,

  swipeThreshold = 40,

  showControls = true,

  showIndicators = true,

  className = "",

  trackClassName = "",

  slideClassName = "",

  controlClassName = "",

  indicatorsClassName = "",

  indicatorClassName = "",

  activeIndicatorClassName = "",

  onActiveIndexChange,

  ...props
}: CarouselProps) {
  const safeItems =
    useMemo(
      () =>
        Array.isArray(items)
          ? items
          : [],
      [items]
    );

  const controlled =
    activeIndex !==
    undefined;

  const [
    internalIndex,
    setInternalIndex,
  ] = useState(
    defaultActiveIndex
  );

  const [
    hovering,
    setHovering,
  ] = useState(false);

  const touchStartXRef =
    useRef<number | null>(
      null
    );

  const itemCount =
    safeItems.length;

  const normalizeIndex = (
    value: number
  ) => {
    if (
      itemCount === 0
    ) {
      return 0;
    }

    return Math.min(
      Math.max(
        value,
        0
      ),
      itemCount - 1
    );
  };

  const currentIndex =
    normalizeIndex(
      controlled
        ? activeIndex
        : internalIndex
    );

  const changeIndex = (
    nextIndex: number
  ) => {
    if (
      itemCount === 0
    ) {
      return;
    }

    let resolved =
      nextIndex;

    if (loop) {
      if (
        nextIndex < 0
      ) {
        resolved =
          itemCount - 1;
      } else if (
        nextIndex >=
        itemCount
      ) {
        resolved = 0;
      }
    } else {
      resolved =
        normalizeIndex(
          nextIndex
        );
    }

    if (
      resolved ===
      currentIndex
    ) {
      return;
    }

    if (!controlled) {
      setInternalIndex(
        resolved
      );
    }

    onActiveIndexChange?.(
      resolved,
      safeItems[
        resolved
      ]
    );
  };

  const next = () => {
    changeIndex(
      currentIndex + 1
    );
  };

  const previous = () => {
    changeIndex(
      currentIndex - 1
    );
  };

  /*
   * Make sure the current index
   * remains valid if items change.
   */
  useEffect(() => {
    if (
      controlled ||
      itemCount === 0
    ) {
      return;
    }

    if (
      internalIndex >=
      itemCount
    ) {
      setInternalIndex(
        itemCount - 1
      );
    }
  }, [
    itemCount,
    controlled,
    internalIndex,
  ]);

  /*
   * Autoplay.
   */
  useEffect(() => {
    if (
      !autoPlay ||
      itemCount <= 1
    ) {
      return;
    }

    if (
      pauseOnHover &&
      hovering
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          if (
            !loop &&
            currentIndex ===
              itemCount - 1
          ) {
            return;
          }

          next();
        },
        Math.max(
          autoPlayInterval,
          500
        )
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    autoPlay,
    autoPlayInterval,
    pauseOnHover,
    hovering,
    currentIndex,
    itemCount,
    loop,
  ]);

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (
      !keyboardNavigation
    ) {
      return;
    }

    if (
      event.key ===
      "ArrowLeft"
    ) {
      event.preventDefault();

      previous();
    }

    if (
      event.key ===
      "ArrowRight"
    ) {
      event.preventDefault();

      next();
    }
  };

  const handleTouchStart = (
    event:
      React.TouchEvent<HTMLDivElement>
  ) => {
    if (
      !swipeNavigation
    ) {
      return;
    }

    touchStartXRef.current =
      event.touches[0]
        ?.clientX ??
      null;
  };

  const handleTouchEnd = (
    event:
      React.TouchEvent<HTMLDivElement>
  ) => {
    if (
      !swipeNavigation ||
      touchStartXRef.current ===
        null
    ) {
      return;
    }

    const endX =
      event.changedTouches[0]
        ?.clientX;

    if (
      typeof endX !==
      "number"
    ) {
      touchStartXRef.current =
        null;

      return;
    }

    const difference =
      endX -
      touchStartXRef.current;

    touchStartXRef.current =
      null;

    if (
      Math.abs(
        difference
      ) <
      swipeThreshold
    ) {
      return;
    }

    if (
      difference > 0
    ) {
      previous();
    } else {
      next();
    }
  };

  /*
   * Builder-safe empty state.
   */
  if (
    itemCount === 0
  ) {
    return (
      <div
        {...props}
        className={[
          "relative w-full",
          "overflow-hidden",
          "rounded-xl",
          "border",
          "border-dashed",
          "border-gray-300",
          "bg-gray-50",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex min-h-48 w-full items-center justify-center p-4">
          {typeof children ===
          "function" ? (
            children({
              item: null,
              index: 0,
              active: true,
            })
          ) : children ? (
            children
          ) : (
            <span className="text-sm text-gray-400">
              Carousel
              (No Data Bound)
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      {...props}
      role="region"
      aria-roledescription="carousel"
      tabIndex={
        keyboardNavigation
          ? 0
          : undefined
      }
      onKeyDown={
        handleKeyDown
      }
      onMouseEnter={() => {
        setHovering(
          true
        );
      }}
      onMouseLeave={() => {
        setHovering(
          false
        );
      }}
      onTouchStart={
        handleTouchStart
      }
      onTouchEnd={
        handleTouchEnd
      }
      className={[
        "relative w-full",
        "overflow-hidden",
        "rounded-xl",
        "outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex w-full",
          "transition-transform",
          "duration-300",
          "ease-out",
          trackClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          transform:
            `translateX(-${
              currentIndex *
              100
            }%)`,
        }}
      >
        {safeItems.map(
          (
            item,
            index
          ) => {
            const active =
              index ===
              currentIndex;

            return (
              <div
                key={
                  item?.id ??
                  item?.key ??
                  index
                }
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${itemCount}`}
                aria-hidden={
                  !active
                }
                className={[
                  "w-full",
                  "min-w-full",
                  "shrink-0",
                  slideClassName,
                ]
                  .filter(
                    Boolean
                  )
                  .join(
                    " "
                  )}
              >
                {typeof children ===
                "function"
                  ? children({
                      item,
                      index,
                      active,
                    })
                  : children}
              </div>
            );
          }
        )}
      </div>

      {showControls &&
        itemCount > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              disabled={
                !loop &&
                currentIndex ===
                  0
              }
              onClick={
                previous
              }
              className={[
                "absolute",
                "left-3",
                "top-1/2",
                "z-10",
                "-translate-y-1/2",

                "flex size-9",
                "items-center",
                "justify-center",

                "rounded-full",

                "bg-black/50",
                "text-white",

                "backdrop-blur-sm",

                "transition",

                "hover:bg-black/70",

                "disabled:pointer-events-none",
                "disabled:opacity-30",

                controlClassName,
              ]
                .filter(
                  Boolean
                )
                .join(
                  " "
                )}
            >
              <ChevronLeft
                size={20}
              />
            </button>

            <button
              type="button"
              aria-label="Next slide"
              disabled={
                !loop &&
                currentIndex ===
                  itemCount -
                    1
              }
              onClick={
                next
              }
              className={[
                "absolute",
                "right-3",
                "top-1/2",
                "z-10",
                "-translate-y-1/2",

                "flex size-9",
                "items-center",
                "justify-center",

                "rounded-full",

                "bg-black/50",
                "text-white",

                "backdrop-blur-sm",

                "transition",

                "hover:bg-black/70",

                "disabled:pointer-events-none",
                "disabled:opacity-30",

                controlClassName,
              ]
                .filter(
                  Boolean
                )
                .join(
                  " "
                )}
            >
              <ChevronRight
                size={20}
              />
            </button>
          </>
        )}

      {showIndicators &&
        itemCount > 1 && (
          <div
            className={[
              "absolute",
              "bottom-3",
              "left-1/2",
              "z-10",

              "flex",
              "-translate-x-1/2",
              "items-center",
              "justify-center",
              "gap-2",

              indicatorsClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {safeItems.map(
              (
                _,
                index
              ) => {
                const active =
                  index ===
                  currentIndex;

                return (
                  <button
                    key={
                      index
                    }
                    type="button"
                    aria-label={`Go to slide ${
                      index +
                      1
                    }`}
                    aria-current={
                      active
                        ? "true"
                        : undefined
                    }
                    onClick={() => {
                      changeIndex(
                        index
                      );
                    }}
                    className={[
                      "h-2",
                      "rounded-full",

                      "transition-all",

                      active
                        ? "w-6 bg-white"
                        : "w-2 bg-white/60 hover:bg-white/80",

                      indicatorClassName,

                      active
                        ? activeIndicatorClassName
                        : "",
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        " "
                      )}
                  />
                );
              }
            )}
          </div>
        )}
    </div>
  );
}