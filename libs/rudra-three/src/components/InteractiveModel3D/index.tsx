"use client";

import React, {
  Suspense,
  useImperativeHandle,
  useState,
} from "react";

import { Canvas } from "@react-three/fiber";

import ModelScene from "../ModelScene";

/* ============================================================
   PUBLIC TYPES
   ============================================================ */

export type ModelVector3 = [
  number,
  number,
  number
];

export type ModelScale =
  | number
  | ModelVector3;

export type ModelEasing =
  | "linear"
  | "easeInOut"
  | "easeOut";

/* ============================================================
   EMBEDDED GLTF ANIMATION
   ============================================================ */

export interface ModelAnimationDefinition {
  /**
   * Actual GLTF clip name.
   *
   * If omitted, the animation map key is used.
   */
  clip?: string;

  loop?: boolean;

  repetitions?: number;

  speed?: number;

  /**
   * Keep the final pose of a non-looping animation.
   */
  clampWhenFinished?: boolean;

  /**
   * Cross-fade duration in seconds.
   */
  fade?: number;
}

export interface ModelAnimationPlayOptions {
  loop?: boolean;

  repetitions?: number;

  speed?: number;

  clampWhenFinished?: boolean;

  fade?: number;
}

export type ModelAnimationMap = Record<
  string,
  ModelAnimationDefinition
>;

/* ============================================================
   NODE / PART ANIMATION

   Example:
   Door_Left
   Wheel_FR
   Bonnet
   RobotArm
   ============================================================ */

export interface ModelNodeTransform {
  /**
   * Absolute transform.
   */
  to?: ModelVector3;

  /**
   * Relative transform.
   */
  by?: ModelVector3;
}

export interface ModelNodeAnimationDefinition {
  /**
   * Object3D/node name inside GLTF hierarchy.
   */
  node: string;

  position?: ModelNodeTransform;

  rotation?: ModelNodeTransform;

  scale?: ModelNodeTransform;

  /**
   * Milliseconds.
   */
  duration?: number;

  easing?: ModelEasing;
}

export type ModelNodeAnimationMap = Record<
  string,
  ModelNodeAnimationDefinition
>;

/* ============================================================
   MOVEMENT
   ============================================================ */

export interface ModelMovementOptions {
  /**
   * Milliseconds.
   */
  duration?: number;

  easing?: ModelEasing;
}

/* ============================================================
   ACTIONS
   ============================================================ */

export type ModelActionStep =
  | {
      type: "animation";

      animation: string;

      /**
       * Usually false for walking/running loops.
       *
       * true is useful for one-shot clips
       * like Wave/OpenDoor.
       */
      wait?: boolean;

      options?: ModelAnimationPlayOptions;
    }
  | {
      type: "stopAnimation";

      animation?: string;

      fade?: number;
    }
  | {
      type: "nodeAnimation";

      animation: string;
    }
  | {
      type: "move";

      to: ModelVector3;

      duration?: number;

      easing?: ModelEasing;
    }
  | {
      type: "moveBy";

      by: ModelVector3;

      duration?: number;

      easing?: ModelEasing;
    }
  | {
      type: "rotate";

      to: ModelVector3;

      duration?: number;

      easing?: ModelEasing;
    }
  | {
      type: "rotateBy";

      by: ModelVector3;

      duration?: number;

      easing?: ModelEasing;
    }
  | {
      type: "delay";

      duration: number;
    }
  | {
      /**
       * Run multiple steps simultaneously.
       *
       * Example:
       * walk animation + moveForward.
       */
      type: "parallel";

      steps: ModelActionStep[];
    };

export type ModelActionMap = Record<
  string,
  ModelActionStep[]
>;

/* ============================================================
   IMPERATIVE CONTROLS
   ============================================================ */

export interface InteractiveModel3DHandle {
  play: (
    animation: string,
    options?: ModelAnimationPlayOptions
  ) => Promise<void>;

  pauseAnimation: (
    animation?: string
  ) => void;

  resumeAnimation: (
    animation?: string
  ) => void;

  stopAnimation: (
    animation?: string,
    fade?: number
  ) => void;

  moveTo: (
    position: ModelVector3,
    options?: ModelMovementOptions
  ) => Promise<void>;

  moveBy: (
    offset: ModelVector3,
    options?: ModelMovementOptions
  ) => Promise<void>;

  moveForward: (
    distance: number,
    options?: ModelMovementOptions
  ) => Promise<void>;

  moveBackward: (
    distance: number,
    options?: ModelMovementOptions
  ) => Promise<void>;

  moveLeft: (
    distance: number,
    options?: ModelMovementOptions
  ) => Promise<void>;

  moveRight: (
    distance: number,
    options?: ModelMovementOptions
  ) => Promise<void>;

  rotateTo: (
    rotation: ModelVector3,
    options?: ModelMovementOptions
  ) => Promise<void>;

  rotateBy: (
    rotation: ModelVector3,
    options?: ModelMovementOptions
  ) => Promise<void>;

  stopMovement: () => void;

  playNodeAnimation: (
    animation: string
  ) => Promise<void>;

  stopNodeAnimations: () => void;

  playAction: (
    action: string
  ) => Promise<void>;

  cancelAction: () => void;

  getAnimationNames: () => string[];

  getNodeNames: () => string[];

  getPosition: () => ModelVector3;

  getRotation: () => ModelVector3;
}

/* ============================================================
   COMPONENT PROPS
   ============================================================ */

export interface InteractiveModel3DProps {
  /**
   * GLB / GLTF URL.
   *
   * Optional intentionally so Rudra can render:
   *
   * <InteractiveModel3D />
   */
  src?: string;

  animations?: ModelAnimationMap;

  nodeAnimations?: ModelNodeAnimationMap;

  actions?: ModelActionMap;

  /**
   * Named action started automatically.
   */
  action?: string;

  /**
   * Embedded animation started automatically.
   */
  autoPlayAnimation?: string;

  position?: ModelVector3;

  rotation?: ModelVector3;

  scale?: ModelScale;

  width?: number | string;

  height?: number | string;

  className?: string;

  background?: string;

  cameraPosition?: ModelVector3;

  cameraTarget?: ModelVector3;

  fov?: number;

  showControls?: boolean;

  enableZoom?: boolean;

  enablePan?: boolean;

  enableRotate?: boolean;

  ambientIntensity?: number;

  directionalIntensity?: number;

  shadows?: boolean;

  controlRef?: React.Ref<InteractiveModel3DHandle>;

  onReady?: (
    controls: InteractiveModel3DHandle
  ) => void;

  onAnimationsLoaded?: (
    animationNames: string[]
  ) => void;

  onAnimationStart?: (
    animation: string
  ) => void;

  onAnimationComplete?: (
    animation: string
  ) => void;

  onNodeAnimationStart?: (
    animation: string,
    node: string
  ) => void;

  onNodeAnimationComplete?: (
    animation: string,
    node: string
  ) => void;

  onActionStart?: (
    action: string
  ) => void;

  onActionComplete?: (
    action: string
  ) => void;

  onNodeClick?: (
    nodeName: string
  ) => void;

  onNodeEnter?: (
    nodeName: string
  ) => void;

  onNodeLeave?: (
    nodeName: string
  ) => void;

  onError?: (
    error: Error
  ) => void;
}

/* ============================================================
   EMPTY CONTROLS

   Makes <InteractiveModel3D /> safe in Rudra.
   ============================================================ */

const EMPTY_CONTROLS: InteractiveModel3DHandle = {
  play: async () => {},

  pauseAnimation: () => {},

  resumeAnimation: () => {},

  stopAnimation: () => {},

  moveTo: async () => {},

  moveBy: async () => {},

  moveForward: async () => {},

  moveBackward: async () => {},

  moveLeft: async () => {},

  moveRight: async () => {},

  rotateTo: async () => {},

  rotateBy: async () => {},

  stopMovement: () => {},

  playNodeAnimation: async () => {},

  stopNodeAnimations: () => {},

  playAction: async () => {},

  cancelAction: () => {},

  getAnimationNames: () => [],

  getNodeNames: () => [],

  getPosition: () => [
    0,
    0,
    0,
  ],

  getRotation: () => [
    0,
    0,
    0,
  ],
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function InteractiveModel3D({
  src,

  animations = {},

  nodeAnimations = {},

  actions = {},

  action,

  autoPlayAnimation,

  position = [
    0,
    0,
    0,
  ],

  rotation = [
    0,
    0,
    0,
  ],

  scale = 1,

  width = "100%",

  height = 400,

  className = "",

  background = "transparent",

  cameraPosition = [
    4,
    3,
    6,
  ],

  cameraTarget = [
    0,
    1,
    0,
  ],

  fov = 45,

  showControls = true,

  enableZoom = true,

  enablePan = true,

  enableRotate = true,

  ambientIntensity = 1,

  directionalIntensity = 2,

  shadows = true,

  controlRef,

  onReady,

  onAnimationsLoaded,

  onAnimationStart,

  onAnimationComplete,

  onNodeAnimationStart,

  onNodeAnimationComplete,

  onActionStart,

  onActionComplete,

  onNodeClick,

  onNodeEnter,

  onNodeLeave,

  onError,
}: InteractiveModel3DProps = {}) {
  const [
    controls,
    setControls,
  ] =
    useState<InteractiveModel3DHandle | null>(
      null
    );

  useImperativeHandle(
    controlRef,

    () =>
      controls ??
      EMPTY_CONTROLS,

    [controls]
  );

  /**
   * Builder-safe empty state.
   */
  if (!src) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          background,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",

        width,

        height,

        overflow: "hidden",

        background,
      }}
    >
      <Canvas
        shadows={shadows}
        camera={{
          position:
            cameraPosition,

          fov,
        }}
        style={{
          width: "100%",

          height: "100%",
        }}
      >
        <Suspense fallback={null}>
          <ModelScene
            src={src}
            animations={
              animations
            }
            nodeAnimations={
              nodeAnimations
            }
            actions={actions}
            action={action}
            autoPlayAnimation={
              autoPlayAnimation
            }
            position={position}
            rotation={rotation}
            scale={scale}
            cameraTarget={
              cameraTarget
            }
            showControls={
              showControls
            }
            enableZoom={
              enableZoom
            }
            enablePan={
              enablePan
            }
            enableRotate={
              enableRotate
            }
            ambientIntensity={
              ambientIntensity
            }
            directionalIntensity={
              directionalIntensity
            }
            shadows={shadows}
            onControlsReady={(
              nextControls
            ) => {
              setControls(
                nextControls
              );

              if (
                nextControls
              ) {
                onReady?.(
                  nextControls
                );
              }
            }}
            onAnimationsLoaded={
              onAnimationsLoaded
            }
            onAnimationStart={
              onAnimationStart
            }
            onAnimationComplete={
              onAnimationComplete
            }
            onNodeAnimationStart={
              onNodeAnimationStart
            }
            onNodeAnimationComplete={
              onNodeAnimationComplete
            }
            onActionStart={
              onActionStart
            }
            onActionComplete={
              onActionComplete
            }
            onNodeClick={
              onNodeClick
            }
            onNodeEnter={
              onNodeEnter
            }
            onNodeLeave={
              onNodeLeave
            }
            onError={onError}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}