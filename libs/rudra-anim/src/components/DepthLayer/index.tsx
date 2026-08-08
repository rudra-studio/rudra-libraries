"use client";

import type {
  CSSProperties,
  ReactNode,
} from "react";

import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "motion/react";

import type { ScrollEasing } from "./ScrollStory";
import  useScrollStory from "../../hooks/useScrollStory";

export interface Transform2DFrame {
  at: number;

  x?: number;
  y?: number;
  z?: number;

  scale?: number;
  scaleX?: number;
  scaleY?: number;

  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;

  opacity?: number;
  blur?: number;
}

export interface DepthLayerProps {
  frames: readonly Transform2DFrame[];
  children: ReactNode;

  easing?: ScrollEasing;

  anchor?:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

  className?: string;
  style?: CSSProperties;
}

const anchorStyles: Record<
  NonNullable<DepthLayerProps["anchor"]>,
  CSSProperties
> = {
  center: {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },

  "top-left": {
    left: 0,
    top: 0,
  },

  "top-right": {
    right: 0,
    top: 0,
  },

  "bottom-left": {
    left: 0,
    bottom: 0,
  },

  "bottom-right": {
    right: 0,
    bottom: 0,
  },
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerp(
  from: number,
  to: number,
  progress: number,
): number {
  return from + (to - from) * progress;
}

function applyEasing(
  progress: number,
  easing: ScrollEasing,
): number {
  const value = clamp01(progress);

  switch (easing) {
    case "easeIn":
      return value * value;

    case "easeOut":
      return 1 - (1 - value) * (1 - value);

    case "easeInOut":
      return value < 0.5
        ? 2 * value * value
        : 1 - Math.pow(-2 * value + 2, 2) / 2;

    case "smoothstep":
      return value * value * (3 - 2 * value);

    case "linear":
    default:
      return value;
  }
}

function sampleProperty(
  frames: readonly Transform2DFrame[],
  property: keyof Omit<Transform2DFrame, "at">,
  progress: number,
  fallback: number,
  easing: ScrollEasing,
): number {
  const propertyFrames = frames
    .filter((frame) => {
      return frame[property] !== undefined;
    })
    .map((frame) => ({
      at: clamp01(frame.at),
      value: frame[property] as number,
    }))
    .sort((a, b) => a.at - b.at);

  if (propertyFrames.length === 0) {
    return fallback;
  }

  if (
    propertyFrames.length === 1 ||
    progress <= propertyFrames[0].at
  ) {
    return propertyFrames[0].value;
  }

  const finalFrame =
    propertyFrames[propertyFrames.length - 1];

  if (progress >= finalFrame.at) {
    return finalFrame.value;
  }

  for (
    let index = 0;
    index < propertyFrames.length - 1;
    index += 1
  ) {
    const currentFrame = propertyFrames[index];
    const nextFrame = propertyFrames[index + 1];

    const isInsideSegment =
      progress >= currentFrame.at &&
      progress <= nextFrame.at;

    if (!isInsideSegment) {
      continue;
    }

    const frameDistance = Math.max(
      0.000001,
      nextFrame.at - currentFrame.at,
    );

    const localProgress = applyEasing(
      (progress - currentFrame.at) /
        frameDistance,
      easing,
    );

    return lerp(
      currentFrame.value,
      nextFrame.value,
      localProgress,
    );
  }

  return finalFrame.value;
}

function useAnimatedProperty(
  progress: MotionValue<number>,
  frames: readonly Transform2DFrame[],
  property: keyof Omit<Transform2DFrame, "at">,
  fallback: number,
  easing: ScrollEasing,
) {
  return useTransform(
    progress,
    (currentProgress) => {
      return sampleProperty(
        frames,
        property,
        currentProgress,
        fallback,
        easing,
      );
    },
  );
}

export default function DepthLayer({
  frames,
  children,
  easing = "smoothstep",
  anchor = "center",
  className,
  style,
}: DepthLayerProps) {
  const { progress } = useScrollStory();

  const x = useAnimatedProperty(
    progress,
    frames,
    "x",
    0,
    easing,
  );

  const y = useAnimatedProperty(
    progress,
    frames,
    "y",
    0,
    easing,
  );

  const z = useAnimatedProperty(
    progress,
    frames,
    "z",
    0,
    easing,
  );

  const scale = useAnimatedProperty(
    progress,
    frames,
    "scale",
    1,
    easing,
  );

  const scaleX = useAnimatedProperty(
    progress,
    frames,
    "scaleX",
    1,
    easing,
  );

  const scaleY = useAnimatedProperty(
    progress,
    frames,
    "scaleY",
    1,
    easing,
  );

  const rotateX = useAnimatedProperty(
    progress,
    frames,
    "rotateX",
    0,
    easing,
  );

  const rotateY = useAnimatedProperty(
    progress,
    frames,
    "rotateY",
    0,
    easing,
  );

  const rotateZ = useAnimatedProperty(
    progress,
    frames,
    "rotateZ",
    0,
    easing,
  );

  const opacity = useAnimatedProperty(
    progress,
    frames,
    "opacity",
    1,
    easing,
  );

  const blur = useAnimatedProperty(
    progress,
    frames,
    "blur",
    0,
    easing,
  );

  const transform = useMotionTemplate`
    translate3d(${x}px, ${y}px, ${z}px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    rotateZ(${rotateZ}deg)
    scale(${scale})
    scaleX(${scaleX})
    scaleY(${scaleY})
  `;

  const filter = useMotionTemplate`
    blur(${blur}px)
  `;

  return (
    <div
      style={{
        position: "absolute",
        ...anchorStyles[anchor],
      }}
    >
      <motion.div
        className={className}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          willChange: "transform, opacity, filter",

          ...style,

          transform,
          opacity,
          filter,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}