import React, {
  useRef,
} from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export type ParallaxDirection =
  | "up"
  | "down"
  | "left"
  | "right";

export interface ParallaxProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  /**
   * Direction content moves
   * while scrolling.
   *
   * @select|up|down|left|right
   */
  direction?: ParallaxDirection;

  /**
   * Total movement distance
   * in pixels.
   */
  distance?: number;

  /**
   * Enable scale animation.
   */
  enableScale?: boolean;

  /**
   * Scale at the beginning
   * of the scroll range.
   */
  scaleFrom?: number;

  /**
   * Scale at the end
   * of the scroll range.
   */
  scaleTo?: number;

  /**
   * Enable opacity animation.
   */
  enableOpacity?: boolean;

  /**
   * Opacity at the beginning
   * of the scroll range.
   */
  opacityFrom?: number;

  /**
   * Opacity at the end
   * of the scroll range.
   */
  opacityTo?: number;

  /**
   * Disable parallax animation.
   */
  disabled?: boolean;

  /**
   * Respect reduced motion
   * accessibility preference.
   */
  respectReducedMotion?: boolean;

  /**
   * Scroll position where
   * the animation begins.
   *
   * @select|start end|start center|center end|center center
   */
  startOffset?:
    | "start end"
    | "start center"
    | "center end"
    | "center center";

  /**
   * Scroll position where
   * the animation ends.
   *
   * @select|end start|end center|center start|center center
   */
  endOffset?:
    | "end start"
    | "end center"
    | "center start"
    | "center center";

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
   *     "key":"Overflow",
   *     "prefix":"overflow",
   *     "type":"select",
   *     "options":[
   *       {"key":"visible","label":"Visible"},
   *       {"key":"hidden","label":"Hidden"},
   *       {"key":"clip","label":"Clip"}
   *     ]
   *   },
   *   {
   *     "key":"Position",
   *     "prefix":"",
   *     "type":"select",
   *     "options":[
   *       {"key":"relative","label":"Relative"},
   *       {"key":"block","label":"Block"}
   *     ]
   *   }
   * ]
   */
  className?: string;
}

export default function Parallax({
  children,

  direction = "up",

  distance = 100,

  enableScale = false,

  scaleFrom = 1,

  scaleTo = 1.08,

  enableOpacity = false,

  opacityFrom = 1,

  opacityTo = 1,

  disabled = false,

  respectReducedMotion = true,

  startOffset = "start end",

  endOffset = "end start",

  customAttributes = {},

  className = "w-full relative",

  style,

  ...props
}: ParallaxProps) {
  const ref =
    useRef<HTMLDivElement>(
      null
    );

  const prefersReducedMotion =
    useReducedMotion();

  const shouldDisable =
    disabled ||
    Boolean(
      respectReducedMotion &&
        prefersReducedMotion
    );

  const {
    scrollYProgress,
  } = useScroll({
    target: ref,

    offset: [
      startOffset,
      endOffset,
    ],
  });

  /*
   * distance={100}
   *
   * up:
   * 50px -> -50px
   *
   * down:
   * -50px -> 50px
   *
   * left:
   * 50px -> -50px
   *
   * right:
   * -50px -> 50px
   */
  const halfDistance =
    Math.abs(
      distance
    ) / 2;

  const horizontalStart =
    direction === "left"
      ? halfDistance
      : direction === "right"
        ? -halfDistance
        : 0;

  const horizontalEnd =
    direction === "left"
      ? -halfDistance
      : direction === "right"
        ? halfDistance
        : 0;

  const verticalStart =
    direction === "up"
      ? halfDistance
      : direction === "down"
        ? -halfDistance
        : 0;

  const verticalEnd =
    direction === "up"
      ? -halfDistance
      : direction === "down"
        ? halfDistance
        : 0;

  const x =
    useTransform(
      scrollYProgress,
      [0, 1],
      shouldDisable
        ? [0, 0]
        : [
            horizontalStart,
            horizontalEnd,
          ]
    );

  const y =
    useTransform(
      scrollYProgress,
      [0, 1],
      shouldDisable
        ? [0, 0]
        : [
            verticalStart,
            verticalEnd,
          ]
    );

  const scale =
    useTransform(
      scrollYProgress,
      [0, 1],
      shouldDisable ||
        !enableScale
        ? [1, 1]
        : [
            scaleFrom,
            scaleTo,
          ]
    );

  const opacity =
    useTransform(
      scrollYProgress,
      [0, 1],
      shouldDisable ||
        !enableOpacity
        ? [1, 1]
        : [
            opacityFrom,
            opacityTo,
          ]
    );

  return (
    <motion.div
      ref={ref}
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        ...style,

        x,

        y,

        scale,

        opacity,

        willChange:
          shouldDisable
            ? undefined
            : "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}