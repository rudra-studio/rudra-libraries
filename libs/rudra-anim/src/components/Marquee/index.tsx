import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

export type MarqueeDirection =
  | "left"
  | "right"
  | "up"
  | "down";

export interface MarqueeProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className"
  > {
  children?: React.ReactNode;

  /**
   * Direction of movement.
   *
   * @select|left|right|up|down
   */
  direction?: MarqueeDirection;

  /**
   * Movement speed in pixels
   * per second.
   */
  speed?: number;

  /**
   * Gap between repeated content.
   */
  gap?: number;

  /**
   * Pause animation while
   * hovering the marquee.
   */
  pauseOnHover?: boolean;

  /**
   * Pause animation.
   */
  paused?: boolean;

  /**
   * Apply fading edges.
   */
  fadeEdges?: boolean;

  /**
   * Size of the fade area
   * in pixels.
   */
  fadeSize?: number;

  /**
   * Respect operating system
   * reduced-motion preference.
   */
  respectReducedMotion?: boolean;

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
   *       {"key":"fit","label":"Fit Content"},
   *       {"key":"auto","label":"Auto"}
   *     ]
   *   },
   *   {
   *     "key":"Height",
   *     "prefix":"h",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"32","label":"Small"},
   *       {"key":"48","label":"Medium"},
   *       {"key":"64","label":"Large"},
   *       {"key":"96","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-900","label":"Gray 900"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Moving track customization.
   *
   * @type|class
   */
  trackClassName?: string;

  /**
   * Individual repeated group
   * customization.
   *
   * @type|class
   */
  groupClassName?: string;
}

export default function Marquee({
  children,

  direction = "left",

  speed = 50,

  gap = 24,

  pauseOnHover = true,

  paused = false,

  fadeEdges = false,

  fadeSize = 40,

  respectReducedMotion = true,

  customAttributes = {},

  className = "w-full",

  trackClassName = "",

  groupClassName = "",

  style,

  ...props
}: MarqueeProps) {
  const groupRef =
    useRef<HTMLDivElement>(
      null
    );

  const [
    groupSize,
    setGroupSize,
  ] = useState(0);

  const [
    hovering,
    setHovering,
  ] = useState(false);

  const prefersReducedMotion =
    useReducedMotion();

  const x =
    useMotionValue(0);

  const y =
    useMotionValue(0);

  const offsetRef =
    useRef(0);

  const vertical =
    direction === "up" ||
    direction === "down";

  const reverse =
    direction === "right" ||
    direction === "down";

  const shouldPause =
    paused ||
    (pauseOnHover &&
      hovering) ||
    Boolean(
      respectReducedMotion &&
        prefersReducedMotion
    );

  /*
   * Measure one copy of the
   * marquee content.
   */
  useEffect(() => {
    const element =
      groupRef.current;

    if (!element) {
      return;
    }

    const measure =
      () => {
        const size =
          vertical
            ? element.offsetHeight
            : element.offsetWidth;

        setGroupSize(
          size
        );
      };

    measure();

    const observer =
      new ResizeObserver(
        measure
      );

    observer.observe(
      element
    );

    return () => {
      observer.disconnect();
    };
  }, [
    children,
    vertical,
  ]);

  /*
   * Reset position whenever
   * layout direction or content
   * measurement changes.
   */
  useEffect(() => {
    offsetRef.current = 0;

    x.set(0);
    y.set(0);
  }, [
    direction,
    groupSize,
    gap,
    x,
    y,
  ]);

  useAnimationFrame(
    (
      _time,
      delta
    ) => {
      if (
        shouldPause ||
        groupSize <= 0
      ) {
        return;
      }

      const safeSpeed =
        Math.max(
          0,
          speed
        );

      const movement =
        (safeSpeed *
          delta) /
        1000;

      const distance =
        groupSize +
        gap;

      if (
        distance <= 0
      ) {
        return;
      }

      offsetRef.current +=
        reverse
          ? movement
          : -movement;

      if (!reverse) {
        if (
          offsetRef.current <=
          -distance
        ) {
          offsetRef.current +=
            distance;
        }
      } else {
        if (
          offsetRef.current >=
          0
        ) {
          offsetRef.current -=
            distance;
        }
      }

      if (vertical) {
        y.set(
          offsetRef.current
        );
      } else {
        x.set(
          offsetRef.current
        );
      }
    }
  );

  /*
   * For reverse movement we start
   * one group behind so content
   * continuously enters from the
   * opposite side.
   */
  useEffect(() => {
    if (
      !reverse ||
      groupSize <= 0
    ) {
      return;
    }

    const distance =
      groupSize +
      gap;

    offsetRef.current =
      -distance;

    if (vertical) {
      y.set(
        -distance
      );
    } else {
      x.set(
        -distance
      );
    }
  }, [
    reverse,
    groupSize,
    gap,
    vertical,
    x,
    y,
  ]);

  const maskImage =
    fadeEdges
      ? vertical
        ? `linear-gradient(
            to bottom,
            transparent 0px,
            black ${fadeSize}px,
            black calc(100% - ${fadeSize}px),
            transparent 100%
          )`
        : `linear-gradient(
            to right,
            transparent 0px,
            black ${fadeSize}px,
            black calc(100% - ${fadeSize}px),
            transparent 100%
          )`
      : undefined;

  return (
    <div
      {...props}
      {...customAttributes}
      className={
        className
      }
      onMouseEnter={(
        event
      ) => {
        setHovering(
          true
        );

        props.onMouseEnter?.(
          event
        );
      }}
      onMouseLeave={(
        event
      ) => {
        setHovering(
          false
        );

        props.onMouseLeave?.(
          event
        );
      }}
      style={{
        position:
          "relative",

        width:
          "100%",

        overflow:
          "hidden",

        boxSizing:
          "border-box",

        WebkitMaskImage:
          maskImage,

        maskImage,

        ...style,
      }}
    >
      <motion.div
        className={
          trackClassName
        }
        style={{
          display:
            "flex",

          flexDirection:
            vertical
              ? "column"
              : "row",

          width:
            vertical
              ? "100%"
              : "max-content",

          height:
            vertical
              ? "max-content"
              : undefined,

          gap,

          flexShrink:
            0,

          x:
            vertical
              ? undefined
              : x,

          y:
            vertical
              ? y
              : undefined,

          willChange:
            shouldPause
              ? undefined
              : "transform",
        }}
      >
        <div
          ref={
            groupRef
          }
          className={
            groupClassName
          }
          style={{
            display:
              "flex",

            flexDirection:
              vertical
                ? "column"
                : "row",

            alignItems:
              vertical
                ? undefined
                : "center",

            gap,

            flexShrink:
              0,
          }}
        >
          {children}
        </div>

        {/*
         * Second copy creates
         * the seamless loop.
         */}
        <div
          aria-hidden="true"
          className={
            groupClassName
          }
          style={{
            display:
              "flex",

            flexDirection:
              vertical
                ? "column"
                : "row",

            alignItems:
              vertical
                ? undefined
                : "center",

            gap,

            flexShrink:
              0,

            pointerEvents:
              "none",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}