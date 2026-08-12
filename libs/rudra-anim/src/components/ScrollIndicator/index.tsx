import React, {
  useEffect,
  useRef,
  useState,
} from "react";

export type ScrollIndicatorPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "inline";

export type ScrollIndicatorOrientation =
  | "horizontal"
  | "vertical";

export interface ScrollIndicatorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Wrapped content.
   */
  children?: React.ReactNode;

  /**
   * false:
   * Track the complete scroll container.
   *
   * true:
   * Track progress through this
   * component's wrapped content.
   */
  trackChildren?: boolean;

  /**
   * Used when position="inline".
   *
   * @select|horizontal|vertical
   */
  orientation?: ScrollIndicatorOrientation;

  /**
   * @select|top|bottom|left|right|inline
   */
  position?: ScrollIndicatorPosition;

  /**
   * Indicator thickness in pixels.
   */
  thickness?: number;

  /**
   * @color
   */
  progressColor?: string;

  /**
   * @color
   */
  trackColor?: string;

  zIndex?: number;

  showPercentage?: boolean;

  /**
   * Add a small visual transition
   * between scroll updates.
   */
  smooth?: boolean;

  /**
   * Transition duration in milliseconds.
   */
  smoothDuration?: number;

  /**
   * Content wrapper customization.
   *
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"full","label":"Full Width"},
   *       {"key":"fit","label":"Fit Content"},
   *       {"key":"auto","label":"Auto"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Indicator track customization.
   *
   * @type|class
   */
  trackClassName?: string;

  /**
   * Indicator fill customization.
   *
   * @type|class
   */
  progressClassName?: string;

  /**
   * Percentage label customization.
   *
   * @type|class
   */
  percentageClassName?: string;

  /**
   * Dynamic HTML attributes.
   *
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string
  >;

  /**
   * Progress ranges from 0 to 1.
   *
   * @type|function
   */
  onProgressChange?: (
    progress: number
  ) => void;

  /**
   * Called when progress reaches 100%.
   *
   * @type|function
   */
  onComplete?: () => void;
}

type ScrollSource =
  | HTMLElement
  | Window;

interface ScrollMetrics {
  start: number;
  end: number;
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function isWindow(
  source: ScrollSource
): source is Window {
  return source === window;
}

function getScrollTop(
  source: ScrollSource
) {
  if (isWindow(source)) {
    return (
      window.scrollY ||
      document.documentElement
        .scrollTop ||
      document.body
        .scrollTop ||
      0
    );
  }

  return source.scrollTop;
}

function getMaxScroll(
  source: ScrollSource
) {
  if (isWindow(source)) {
    const documentHeight =
      Math.max(
        document.body
          .scrollHeight,

        document.documentElement
          .scrollHeight,

        document.body
          .offsetHeight,

        document.documentElement
          .offsetHeight,

        document.documentElement
          .clientHeight
      );

    return Math.max(
      0,
      documentHeight -
        window.innerHeight
    );
  }

  return Math.max(
    0,
    source.scrollHeight -
      source.clientHeight
  );
}

function getViewportBounds(
  source: ScrollSource
) {
  if (isWindow(source)) {
    return {
      top: 0,
      bottom:
        window.innerHeight,
    };
  }

  const rect =
    source.getBoundingClientRect();

  return {
    top: rect.top,
    bottom: rect.bottom,
  };
}

/**
 * Rudra's preview can scroll inside
 * a DIV rather than window.
 *
 * Walk upward and find the nearest
 * actual scroll container.
 */
function findScrollContainer(
  element: HTMLElement | null
): ScrollSource {
  let parent =
    element?.parentElement ??
    null;

  while (parent) {
    const styles =
      window.getComputedStyle(
        parent
      );

    const overflowY =
      styles.overflowY;

    const scrollableStyle =
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay";

    const hasScrollableContent =
      parent.scrollHeight >
      parent.clientHeight + 1;

    if (
      scrollableStyle &&
      hasScrollableContent
    ) {
      return parent;
    }

    parent =
      parent.parentElement;
  }

  return window;
}

export default function ScrollIndicator({
  children,

  trackChildren = false,

  orientation = "horizontal",

  position = "top",

  thickness = 4,

  progressColor = "#2563eb",

  trackColor =
    "rgba(0, 0, 0, 0.08)",

  zIndex = 9999,

  showPercentage = false,

  smooth = true,

  smoothDuration = 120,

  className = "",

  trackClassName = "",

  progressClassName = "",

  percentageClassName = "",

  customAttributes = {},

  onProgressChange,

  onComplete,

  style,

  ...props
}: ScrollIndicatorProps) {
  const rootRef =
    useRef<HTMLDivElement>(
      null
    );

  const completedRef =
    useRef(false);

  const initialScrollRef =
    useRef(0);

  const metricsRef =
    useRef<ScrollMetrics>({
      start: 0,
      end: 1,
    });

  const [
    progress,
    setProgress,
  ] = useState(0);

  /*
   * This is the important part.
   *
   * We track REAL scrollTop rather
   * than Motion's geometric progress.
   */
  useEffect(() => {
    const root =
      rootRef.current;

    if (!root) {
      return;
    }

    const source =
      findScrollContainer(
        root
      );

    /*
     * Whatever scroll position the
     * builder/page starts at becomes 0%.
     */
    const initialScroll =
      getScrollTop(
        source
      );

    initialScrollRef.current =
      initialScroll;

    setProgress(0);

    completedRef.current =
      false;

    const measure =
      () => {
        const currentScroll =
          getScrollTop(
            source
          );

        const maxScroll =
          getMaxScroll(
            source
          );

        /*
         * PAGE / CONTAINER MODE
         */
        if (
          !trackChildren
        ) {
          const start =
            initialScrollRef.current;

          const end =
            Math.max(
              start + 1,
              maxScroll
            );

          metricsRef.current = {
            start,
            end,
          };

          return;
        }

        /*
         * SECTION MODE
         *
         * Progress begins when the
         * section reaches the top
         * of the scroll viewport.
         */
        const targetRect =
          root.getBoundingClientRect();

        const viewport =
          getViewportBounds(
            source
          );

        const sectionStart =
          currentScroll +
          (
            targetRect.top -
            viewport.top
          );

        /*
         * Progress reaches 100%
         * when the section bottom
         * reaches viewport bottom.
         */
        const sectionEnd =
          currentScroll +
          (
            targetRect.bottom -
            viewport.bottom
          );

        /*
         * Important:
         *
         * Never allow the initial
         * render to start above 0%.
         */
        const start =
          Math.max(
            initialScrollRef.current,
            clamp(
              sectionStart,
              0,
              maxScroll
            )
          );

        let end =
          clamp(
            sectionEnd,
            0,
            maxScroll
          );

        if (
          end <= start
        ) {
          end =
            maxScroll >
            start
              ? maxScroll
              : start + 1;
        }

        metricsRef.current = {
          start,
          end,
        };
      };

    const update =
      () => {
        const current =
          getScrollTop(
            source
          );

        const {
          start,
          end,
        } =
          metricsRef.current;

        const range =
          Math.max(
            1,
            end - start
          );

        /*
         * Before start = 0.
         *
         * After end = 1.
         */
        const nextProgress =
          clamp(
            (
              current -
              start
            ) /
              range,
            0,
            1
          );

        setProgress(
          nextProgress
        );

        onProgressChange?.(
          nextProgress
        );

        if (
          nextProgress >=
          0.999
        ) {
          if (
            !completedRef.current
          ) {
            completedRef.current =
              true;

            onComplete?.();
          }
        } else {
          completedRef.current =
            false;
        }
      };

    measure();

    /*
     * Force initial state to exactly 0.
     */
    setProgress(0);

    const handleScroll =
      () => {
        update();
      };

    const handleResize =
      () => {
        measure();
        update();
      };

    if (
      isWindow(source)
    ) {
      window.addEventListener(
        "scroll",
        handleScroll,
        {
          passive: true,
        }
      );
    } else {
      source.addEventListener(
        "scroll",
        handleScroll,
        {
          passive: true,
        }
      );
    }

    window.addEventListener(
      "resize",
      handleResize
    );

    let resizeObserver:
      | ResizeObserver
      | undefined;

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      resizeObserver =
        new ResizeObserver(
          () => {
            measure();
          }
        );

      resizeObserver.observe(
        root
      );
    }

    return () => {
      if (
        isWindow(source)
      ) {
        window.removeEventListener(
          "scroll",
          handleScroll
        );
      } else {
        source.removeEventListener(
          "scroll",
          handleScroll
        );
      }

      window.removeEventListener(
        "resize",
        handleResize
      );

      resizeObserver?.disconnect();
    };
  }, [
    trackChildren,
    onProgressChange,
    onComplete,
  ]);

  const vertical =
    position === "left" ||
    position === "right" ||
    (
      position === "inline" &&
      orientation ===
        "vertical"
    );

  const fixed =
    position !== "inline";

  const getTrackStyle =
    (): React.CSSProperties => {
      const base:
        React.CSSProperties = {
        position:
          fixed
            ? "fixed"
            : "relative",

        overflow:
          "hidden",

        background:
          trackColor,

        boxSizing:
          "border-box",

        zIndex:
          fixed
            ? zIndex
            : 1,

        pointerEvents:
          "none",
      };

      if (
        position === "top"
      ) {
        return {
          ...base,

          top: 0,
          left: 0,
          right: 0,

          width:
            "100%",

          height:
            thickness,
        };
      }

      if (
        position ===
        "bottom"
      ) {
        return {
          ...base,

          bottom: 0,
          left: 0,
          right: 0,

          width:
            "100%",

          height:
            thickness,
        };
      }

      if (
        position === "left"
      ) {
        return {
          ...base,

          top: 0,
          bottom: 0,
          left: 0,

          width:
            thickness,

          height:
            "100%",
        };
      }

      if (
        position === "right"
      ) {
        return {
          ...base,

          top: 0,
          bottom: 0,
          right: 0,

          width:
            thickness,

          height:
            "100%",
        };
      }

      return {
        ...base,

        width:
          vertical
            ? thickness
            : "100%",

        height:
          vertical
            ? 160
            : thickness,
      };
    };

  const getPercentageStyle =
    (): React.CSSProperties => {
      const base:
        React.CSSProperties = {
        position:
          fixed
            ? "fixed"
            : "absolute",

        minWidth: 42,

        padding:
          "6px 8px",

        borderRadius: 7,

        background:
          "#111827",

        color:
          "#ffffff",

        fontSize: 11,

        fontWeight: 600,

        lineHeight: 1,

        textAlign:
          "center",

        whiteSpace:
          "nowrap",

        pointerEvents:
          "none",

        boxSizing:
          "border-box",

        zIndex:
          zIndex + 1,
      };

      if (
        position === "top"
      ) {
        return {
          ...base,

          top:
            thickness + 10,

          right: 14,
        };
      }

      if (
        position ===
        "bottom"
      ) {
        return {
          ...base,

          bottom:
            thickness + 10,

          right: 14,
        };
      }

      if (
        position === "left"
      ) {
        return {
          ...base,

          left:
            thickness + 10,

          bottom: 14,
        };
      }

      if (
        position === "right"
      ) {
        return {
          ...base,

          right:
            thickness + 10,

          bottom: 14,
        };
      }

      return {
        ...base,

        top:
          vertical
            ? 0
            : thickness + 8,

        left:
          vertical
            ? thickness + 8
            : undefined,

        right:
          vertical
            ? undefined
            : 0,
      };
    };

  const percentage =
    Math.round(
      progress * 100
    );

  const indicator = (
    <>
      <div
        className={
          trackClassName
        }
        style={
          getTrackStyle()
        }
        aria-hidden="true"
      >
        <div
          className={
            progressClassName
          }
          style={{
            position:
              "absolute",

            inset: 0,

            background:
              progressColor,

            transformOrigin:
              vertical
                ? "top"
                : "left",

            transform:
              vertical
                ? `scaleY(${progress})`
                : `scaleX(${progress})`,

            transition:
              smooth
                ? `transform ${Math.max(
                    0,
                    smoothDuration
                  )}ms ease-out`
                : "none",

            willChange:
              "transform",
          }}
        />
      </div>

      {showPercentage && (
        <div
          className={
            percentageClassName
          }
          style={
            getPercentageStyle()
          }
        >
          {percentage}%
        </div>
      )}
    </>
  );

  const hasChildren =
    children !== undefined &&
    children !== null;

  /*
   * We always need a real DOM node
   * so we can detect Rudra's actual
   * scrollable parent.
   */
  return (
    <div
      ref={rootRef}
      className={
        hasChildren
          ? className
          : undefined
      }
      {...(
        hasChildren
          ? customAttributes
          : {}
      )}
      {...(
        hasChildren
          ? props
          : {}
      )}
      style={
        hasChildren
          ? {
              position:
                "relative",

              display:
                "block",

              width:
                "100%",

              minWidth: 0,

              boxSizing:
                "border-box",

              ...style,
            }
          : {
              position:
                "relative",

              width: 0,

              height: 0,

              padding: 0,

              margin: 0,

              pointerEvents:
                "none",
            }
      }
    >
      {position ===
        "inline" &&
        indicator}

      {children}

      {position !==
        "inline" &&
        indicator}
    </div>
  );
}