"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  useGLTF,
} from "@react-three/drei";

import type {
  ThreeEvent,
} from "@react-three/fiber";

import * as THREE from "three";

import type {
  InteractiveModel3DHandle,
  ModelActionMap,
  ModelAnimationMap,
  ModelNodeAnimationMap,
  ModelScale,
  ModelVector3,
} from "../InteractiveModel3D";

import useModelAnimator from "../../hooks/useModelAnimator";

import useModelMovement from "../../hooks/useModelMovement";

import useNodeAnimator from "../../hooks/useNodeAnimator";

import useModelActions from "../../hooks/useModelActions";

/* ============================================================
   PROPS

   Everything is optional at the public boundary because
   Rudra can initially render:

   <ModelRenderer />
   ============================================================ */

export interface ModelRendererProps {
  src?: string;

  animations?: ModelAnimationMap;

  nodeAnimations?: ModelNodeAnimationMap;

  actions?: ModelActionMap;

  action?: string;

  autoPlayAnimation?: string;

  position?: ModelVector3;

  rotation?: ModelVector3;

  scale?: ModelScale;

  shadows?: boolean;

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

/* ============================================================
   SAFE OUTER COMPONENT

   Never allow useGLTF(undefined).

   The actual component containing useGLTF is mounted only
   after src becomes a valid string.
   ============================================================ */

export default function ModelRenderer(
  {
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

    shadows = true,

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
  }: ModelRendererProps = {}
) {
  /* ==========================================================
     EMPTY RUDRA STATE
     ========================================================== */

  if (
    !src ||
    typeof src !== "string" ||
    !src.trim()
  ) {
    return null;
  }

  /* ==========================================================
     LOAD ONLY WHEN SRC EXISTS
     ========================================================== */

  return (
    <LoadedModelRenderer
      src={src}
      animations={animations}
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
  );
}

/* ============================================================
   INTERNAL PROPS

   src is guaranteed here.
   ============================================================ */

interface LoadedModelRendererProps {
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

/* ============================================================
   LOADED MODEL
   ============================================================ */

function LoadedModelRenderer({
  src,

  animations,

  nodeAnimations,

  actions,

  action,

  autoPlayAnimation,

  position,

  rotation,

  scale,

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
}: LoadedModelRendererProps) {
  /* ==========================================================
     GLTF
     ========================================================== */

  const gltf =
    useGLTF(
      src
    );

  /**
   * Use the loaded scene directly.
   *
   * No SkeletonUtils.
   * No three/examples imports.
   * No Clone component.
   */
  const modelScene =
    gltf.scene;

  /* ==========================================================
     WORLD MOVEMENT ROOT

     moveForward()
     moveTo()
     rotateTo()
     etc.
     ========================================================== */

  const movementGroupRef =
    useRef<THREE.Group>(
      null
    );

  /* ==========================================================
     MODEL ROOT

     Used as the animation root and for node lookup.
     ========================================================== */

  const modelRootRef =
    useRef<THREE.Group>(
      null
    );

  /* ==========================================================
     MODEL SETUP
     ========================================================== */

  useEffect(
    () => {
      modelScene.traverse(
        (
          object
        ) => {
          /* --------------------------------------------------
             REGULAR MESH
             -------------------------------------------------- */

          if (
            (
              object as THREE.Mesh
            ).isMesh
          ) {
            const mesh =
              object as THREE.Mesh;

            mesh.castShadow =
              shadows;

            mesh.receiveShadow =
              shadows;
          }

          /* --------------------------------------------------
             SKINNED MESH
             -------------------------------------------------- */

          if (
            (
              object as THREE.SkinnedMesh
            ).isSkinnedMesh
          ) {
            const skinnedMesh =
              object as THREE.SkinnedMesh;

            /**
             * Animated geometry can move outside the original
             * static bounding volume.
             *
             * Disabling frustum culling avoids body parts
             * disappearing incorrectly during animations.
             */
            skinnedMesh.frustumCulled =
              false;

            skinnedMesh.castShadow =
              shadows;

            skinnedMesh.receiveShadow =
              shadows;
          }
        }
      );
    },
    [
      modelScene,
      shadows,
    ]
  );

  /* ==========================================================
     EMBEDDED GLTF ANIMATIONS
     ========================================================== */

  const animator =
    useModelAnimator({
      clips:
        gltf.animations ??
        [],

      rootRef:
        modelRootRef,

      definitions:
        animations,

      onAnimationStart,

      onAnimationComplete,

      onError,
    });

  /* ==========================================================
     WORLD MOVEMENT
     ========================================================== */

  const movement =
    useModelMovement({
      groupRef:
        movementGroupRef,
    });

  /* ==========================================================
     NODE / PART ANIMATION

     Example:
     Door_Left
     Bonnet
     RobotArm
     Wheel
     ========================================================== */

  const nodeAnimator =
    useNodeAnimator({
      rootRef:
        modelRootRef,

      animations:
        nodeAnimations,

      onNodeAnimationStart,

      onNodeAnimationComplete,

      onError,
    });

  /* ==========================================================
     ACTION ENGINE
     ========================================================== */

  const actionRunner =
    useModelActions({
      actions,

      animator,

      movement,

      nodeAnimator,

      onActionStart,

      onActionComplete,

      onError,
    });

  /* ==========================================================
     PUBLIC CONTROLS
     ========================================================== */

  const controls =
    useMemo<InteractiveModel3DHandle>(
      () => ({
        /* ----------------------------------------------------
           MODEL ANIMATION
           ---------------------------------------------------- */

        play:
          animator.play,

        pauseAnimation:
          animator.pause,

        resumeAnimation:
          animator.resume,

        stopAnimation:
          animator.stop,

        /* ----------------------------------------------------
           MOVEMENT
           ---------------------------------------------------- */

        moveTo:
          movement.moveTo,

        moveBy:
          movement.moveBy,

        moveForward:
          movement.moveForward,

        moveBackward:
          movement.moveBackward,

        moveLeft:
          movement.moveLeft,

        moveRight:
          movement.moveRight,

        rotateTo:
          movement.rotateTo,

        rotateBy:
          movement.rotateBy,

        stopMovement:
          movement.stopMovement,

        /* ----------------------------------------------------
           NODE ANIMATION
           ---------------------------------------------------- */

        playNodeAnimation:
          nodeAnimator.play,

        stopNodeAnimations:
          nodeAnimator.stopAll,

        /* ----------------------------------------------------
           ACTIONS
           ---------------------------------------------------- */

        playAction:
          actionRunner.playAction,

        cancelAction:
          actionRunner.cancelAction,

        /* ----------------------------------------------------
           INSPECTION
           ---------------------------------------------------- */

        getAnimationNames:
          () =>
            animator.names,

        getNodeNames:
          nodeAnimator.getNodeNames,

        getPosition:
          movement.getPosition,

        getRotation:
          movement.getRotation,
      }),

      [
        animator,
        movement,
        nodeAnimator,
        actionRunner,
      ]
    );

  /* ==========================================================
     CONTROLS READY
     ========================================================== */

  useEffect(
    () => {
      onControlsReady?.(
        controls
      );

      return () => {
        onControlsReady?.(
          null
        );
      };
    },

    [
      controls,
      onControlsReady,
    ]
  );

  /* ==========================================================
     AVAILABLE GLTF ANIMATION NAMES
     ========================================================== */

  const animationNames =
    useMemo(
      () =>
        (
          gltf.animations ??
          []
        )
          .map(
            (
              clip
            ) =>
              clip.name
          )
          .filter(
            Boolean
          ),

      [
        gltf.animations,
      ]
    );

  useEffect(
    () => {
      onAnimationsLoaded?.(
        animationNames
      );
    },

    [
      animationNames,
      onAnimationsLoaded,
    ]
  );

  /* ==========================================================
     AUTO PLAY
     ========================================================== */

  useEffect(
    () => {
      /**
       * Named action takes priority.
       */
      if (
        action
      ) {
        actionRunner.playAction(
          action
        );

        return;
      }

      if (
        autoPlayAnimation
      ) {
        animator.play(
          autoPlayAnimation
        );
      }
    },

    [
      action,
      autoPlayAnimation,
    ]
  );

  /* ==========================================================
     NODE RESOLUTION

     Raycast usually hits a Mesh.

     Walk upwards through the model hierarchy until a named
     Object3D is found.
     ========================================================== */

  const resolveNodeName = (
    event:
      ThreeEvent<PointerEvent>
  ) => {
    let object:
      THREE.Object3D | null =
      event.object;

    while (
      object &&
      object !==
        modelRootRef.current
    ) {
      if (
        object.name
      ) {
        return object.name;
      }

      object =
        object.parent;
    }

    return "";
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <group
      ref={
        movementGroupRef
      }
      position={
        position
      }
      rotation={
        rotation
      }
      scale={
        scale
      }
    >
      <group
        ref={
          modelRootRef
        }

        /* ----------------------------------------------------
           CLICK
           ---------------------------------------------------- */

        onClick={(
          event
        ) => {
          const node =
            resolveNodeName(
              event
            );

          if (
            node
          ) {
            onNodeClick?.(
              node
            );
          }
        }}

        /* ----------------------------------------------------
           HOVER ENTER
           ---------------------------------------------------- */

        onPointerOver={(
          event
        ) => {
          const node =
            resolveNodeName(
              event
            );

          if (
            node
          ) {
            onNodeEnter?.(
              node
            );
          }
        }}

        /* ----------------------------------------------------
           HOVER LEAVE
           ---------------------------------------------------- */

        onPointerOut={(
          event
        ) => {
          const node =
            resolveNodeName(
              event
            );

          if (
            node
          ) {
            onNodeLeave?.(
              node
            );
          }
        }}
      >
        {/* ==================================================
            ACTUAL GLTF MODEL

            Directly render the scene returned by useGLTF.
            ================================================== */}

        <primitive
          object={
            modelScene
          }
        />
      </group>
    </group>
  );
}