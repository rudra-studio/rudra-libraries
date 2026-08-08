"use client";

import React from "react";

import {
  OrbitControls,
} from "@react-three/drei";

import ModelRenderer from "../ModelRenderer";

import type {
  InteractiveModel3DHandle,
  ModelActionMap,
  ModelAnimationMap,
  ModelNodeAnimationMap,
  ModelScale,
  ModelVector3,
} from "../InteractiveModel3D";

export interface ModelSceneProps {
  src: string;

  animations:
    ModelAnimationMap;

  nodeAnimations:
    ModelNodeAnimationMap;

  actions:
    ModelActionMap;

  action?: string;

  autoPlayAnimation?: string;

  position:
    ModelVector3;

  rotation:
    ModelVector3;

  scale:
    ModelScale;

  cameraTarget:
    ModelVector3;

  showControls:
    boolean;

  enableZoom:
    boolean;

  enablePan:
    boolean;

  enableRotate:
    boolean;

  ambientIntensity:
    number;

  directionalIntensity:
    number;

  shadows:
    boolean;

  onControlsReady?: (
    controls:
      InteractiveModel3DHandle | null
  ) => void;

  onAnimationsLoaded?: (
    animations: string[]
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
    node: string
  ) => void;

  onNodeEnter?: (
    node: string
  ) => void;

  onNodeLeave?: (
    node: string
  ) => void;

  onError?: (
    error: Error
  ) => void;
}

export default function ModelScene({
  src,

  animations,

  nodeAnimations,

  actions,

  action,

  autoPlayAnimation,

  position,

  rotation,

  scale,

  cameraTarget,

  showControls,

  enableZoom,

  enablePan,

  enableRotate,

  ambientIntensity,

  directionalIntensity,

  shadows,

  onControlsReady,

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
}: ModelSceneProps) {
  return (
    <>
      <ambientLight
        intensity={
          ambientIntensity
        }
      />

      <directionalLight
        position={[
          4,
          8,
          5,
        ]}
        intensity={
          directionalIntensity
        }
        castShadow={
          shadows
        }
      />

      <ModelRenderer
        src={src}
        animations={
          animations
        }
        nodeAnimations={
          nodeAnimations
        }
        actions={
          actions
        }
        action={action}
        autoPlayAnimation={
          autoPlayAnimation
        }
        position={position}
        rotation={rotation}
        scale={scale}
        shadows={shadows}
        onControlsReady={
          onControlsReady
        }
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

      {showControls && (
        <OrbitControls
          makeDefault
          target={
            cameraTarget
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
        />
      )}
    </>
  );
}