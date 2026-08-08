"use client";

import React, {
  CSSProperties,
  useImperativeHandle,
} from "react";

import SpriteImageRenderer from "../SpriteImageRenderer";
import SpriteSheetRenderer from "../SpriteSheetRenderer";
import  useSpriteAnimator  from "../../hooks/useSpriteAnimator";

/* ============================================================
   PUBLIC TYPES
   ============================================================ */

export interface SpriteSheetSource {
  src: string;

  columns: number;
  rows: number;

  frameIndexes?: number[];

  startFrame?: number;
  endFrame?: number;

  row?: number;

  fromColumn?: number;
  toColumn?: number;
}

export interface SpriteAnimationClip {
  frames?: string[];

  sheet?: SpriteSheetSource;

  fps?: number;

  loop?: boolean;

  reverse?: boolean;

  next?: string;

  holdLastFrame?: boolean;
}

export interface SpriteSequenceStep {
  animation: string;

  loops?: number;

  speed?: number;

  delayBefore?: number;

  delayAfter?: number;
}

export type SpriteAnimationMap = Record<
  string,
  SpriteAnimationClip
>;

export type SpriteActionMap = Record<
  string,
  SpriteSequenceStep[]
>;

export interface SpriteAnimatorHandle {
  play: (
    animation: string
  ) => void;

  playAction: (
    action: string
  ) => void;

  playSequence: (
    sequence: SpriteSequenceStep[]
  ) => void;

  pause: () => void;

  resume: () => void;

  stop: (
    reset?: boolean
  ) => void;

  restart: () => void;

  goToFrame: (
    frame: number,
    animation?: string
  ) => void;

  getCurrentAnimation: () =>
    string | null;

  getCurrentFrame: () =>
    number;

  isPlaying: () =>
    boolean;
}

export interface SpriteAnimatorProps {
  /**
   * Optional intentionally.
   *
   * Rudra can initially render:
   *
   * <SpriteAnimator />
   */
  animations?: SpriteAnimationMap;

  animation?: string;

  sequence?: SpriteSequenceStep[];

  actions?: SpriteActionMap;

  action?: string;

  autoPlay?: boolean;

  paused?: boolean;

  speed?: number;

  width?: number | string;

  height?: number | string;

  className?: string;

  imageClassName?: string;

  objectFit?:
    | "contain"
    | "cover"
    | "fill"
    | "none"
    | "scale-down";

  imageRendering?:
    CSSProperties["imageRendering"];

  alt?: string;

  preload?: boolean;

  /**
   * Replaces forwardRef for Rudra-friendly
   * component registration.
   */
  controlRef?: React.Ref<SpriteAnimatorHandle>;

  onAnimationStart?: (
    animation: string
  ) => void;

  onAnimationComplete?: (
    animation: string
  ) => void;

  onFrameChange?: (
    frame: number,
    animation: string
  ) => void;

  onSequenceComplete?: () => void;

  onActionStart?: (
    action: string
  ) => void;

  onActionComplete?: (
    action: string
  ) => void;

  onError?: (
    error: Error
  ) => void;
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function SpriteAnimator({
  animations = {},

  animation,

  sequence,

  actions = {},

  action,

  autoPlay = true,

  paused = false,

  speed = 1,

  width = "100%",

  height = "100%",

  className = "",

  imageClassName = "",

  objectFit = "contain",

  imageRendering = "auto",

  alt = "",

  preload = true,

  controlRef,

  onAnimationStart,

  onAnimationComplete,

  onFrameChange,

  onSequenceComplete,

  onActionStart,

  onActionComplete,

  onError,
}: SpriteAnimatorProps = {}) {
  const {
    currentAnimation,

    renderFrame,

    controls,
  } = useSpriteAnimator({
    animations,

    animation,

    sequence,

    actions,

    action,

    autoPlay,

    paused,

    speed,

    preload,

    onAnimationStart,

    onAnimationComplete,

    onFrameChange,

    onSequenceComplete,

    onActionStart,

    onActionComplete,

    onError,
  });

  useImperativeHandle(
    controlRef,
    () => controls,
    [controls]
  );

  const clip =
    currentAnimation
      ? animations[
          currentAnimation
        ]
      : undefined;

  /* ==========================================================
     EMPTY / INITIAL RUDRA STATE
     ========================================================== */

  if (!clip) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
        }}
      />
    );
  }

  /* ==========================================================
     SEPARATE IMAGES
     ========================================================== */

  if (
    clip.frames &&
    clip.frames.length > 0
  ) {
    const src =
      clip.frames[
        renderFrame
      ];

    if (!src) {
      return (
        <div
          className={className}
          style={{
            width,
            height,
          }}
        />
      );
    }

    return (
      <SpriteImageRenderer
        src={src}
        width={width}
        height={height}
        className={className}
        imageClassName={
          imageClassName
        }
        objectFit={
          objectFit
        }
        imageRendering={
          imageRendering
        }
        alt={alt}
        onError={
          onError
        }
      />
    );
  }

  /* ==========================================================
     SPRITE SHEET
     ========================================================== */

  if (clip.sheet) {
    return (
      <SpriteSheetRenderer
        sheet={clip.sheet}
        frame={renderFrame}
        width={width}
        height={height}
        className={className}
        imageClassName={
          imageClassName
        }
        imageRendering={
          imageRendering
        }
        alt={alt}
        onError={
          onError
        }
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width,
        height,
      }}
    />
  );
}