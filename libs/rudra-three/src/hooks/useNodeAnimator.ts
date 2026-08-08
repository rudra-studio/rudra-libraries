"use client";

import {
  useCallback,
  useRef,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import type {
  RefObject,
} from "react";

import type {
  ModelEasing,
  ModelNodeAnimationDefinition,
  ModelNodeAnimationMap,
  ModelNodeTransform,
  ModelVector3,
} from "./InteractiveModel3D";

/* ============================================================
   INTERNAL TYPES
   ============================================================ */

interface NodeAnimationTask {
  animation:
    string;

  node:
    THREE.Object3D;

  startedAt:
    number;

  duration:
    number;

  easing:
    ModelEasing;

  startPosition:
    THREE.Vector3;

  targetPosition:
    THREE.Vector3;

  startRotation:
    THREE.Euler;

  targetRotation:
    THREE.Euler;

  startScale:
    THREE.Vector3;

  targetScale:
    THREE.Vector3;

  resolve:
    () => void;
}

interface UseNodeAnimatorOptions {
  rootRef:
    RefObject<THREE.Group | null>;

  animations?:
    ModelNodeAnimationMap;

  onNodeAnimationStart?: (
    animation: string,
    node: string
  ) => void;

  onNodeAnimationComplete?: (
    animation: string,
    node: string
  ) => void;

  onError?: (
    error: Error
  ) => void;
}

export interface UseNodeAnimatorResult {
  play: (
    animation: string
  ) => Promise<void>;

  stopAll: () => void;

  getNodeNames: () => string[];
}

/* ============================================================
   HOOK
   ============================================================ */

export default function useNodeAnimator({
  rootRef,

  animations = {},

  onNodeAnimationStart,

  onNodeAnimationComplete,

  onError,
}: UseNodeAnimatorOptions): UseNodeAnimatorResult {
  /**
   * One task per actual Object3D.
   *
   * This allows two different nodes to animate
   * simultaneously.
   */
  const tasksRef =
    useRef<
      Map<
        string,
        NodeAnimationTask
      >
    >(
      new Map()
    );

  /* ==========================================================
     HELPERS
     ========================================================== */

  const ease =
    useCallback(
      (
        value:
          number,

        easing:
          ModelEasing
      ) => {
        if (
          easing ===
          "linear"
        ) {
          return value;
        }

        if (
          easing ===
          "easeOut"
        ) {
          return (
            1 -
            Math.pow(
              1 -
                value,

              3
            )
          );
        }

        return (
          value <
          0.5
            ? 4 *
              value *
              value *
              value
            : 1 -
              Math.pow(
                -2 *
                  value +
                  2,

                3
              ) /
                2
        );
      },
      []
    );

  const resolveVector =
    useCallback(
      (
        current:
          THREE.Vector3,

        transform?:
          ModelNodeTransform
      ) => {
        if (
          !transform
        ) {
          return current.clone();
        }

        if (
          transform.to
        ) {
          return new THREE.Vector3(
            ...transform.to
          );
        }

        if (
          transform.by
        ) {
          return current
            .clone()
            .add(
              new THREE.Vector3(
                ...transform.by
              )
            );
        }

        return current.clone();
      },
      []
    );

  const resolveEuler =
    useCallback(
      (
        current:
          THREE.Euler,

        transform?:
          ModelNodeTransform
      ) => {
        if (
          !transform
        ) {
          return current.clone();
        }

        if (
          transform.to
        ) {
          return new THREE.Euler(
            ...transform.to
          );
        }

        if (
          transform.by
        ) {
          return new THREE.Euler(
            current.x +
              transform.by[0],

            current.y +
              transform.by[1],

            current.z +
              transform.by[2]
          );
        }

        return current.clone();
      },
      []
    );

  /* ==========================================================
     FRAME LOOP
     ========================================================== */

  useFrame(
    () => {
      if (
        tasksRef.current.size ===
        0
      ) {
        return;
      }

      const now =
        performance.now();

      tasksRef.current.forEach(
        (
          task,
          key
        ) => {
          const progress =
            Math.min(
              1,

              (
                now -
                task.startedAt
              ) /
                task.duration
            );

          const value =
            ease(
              progress,

              task.easing
            );

          task.node.position.lerpVectors(
            task.startPosition,

            task.targetPosition,

            value
          );

          task.node.rotation.set(
            THREE.MathUtils.lerp(
              task.startRotation.x,

              task.targetRotation.x,

              value
            ),

            THREE.MathUtils.lerp(
              task.startRotation.y,

              task.targetRotation.y,

              value
            ),

            THREE.MathUtils.lerp(
              task.startRotation.z,

              task.targetRotation.z,

              value
            )
          );

          task.node.scale.lerpVectors(
            task.startScale,

            task.targetScale,

            value
          );

          if (
            progress >=
            1
          ) {
            task.node.position.copy(
              task.targetPosition
            );

            task.node.rotation.copy(
              task.targetRotation
            );

            task.node.scale.copy(
              task.targetScale
            );

            tasksRef.current.delete(
              key
            );

            onNodeAnimationComplete?.(
              task.animation,

              task.node.name
            );

            task.resolve();
          }
        }
      );
    }
  );

  /* ==========================================================
     PLAY
     ========================================================== */

  const play =
    useCallback(
      (
        animation:
          string
      ) => {
        const definition:
          ModelNodeAnimationDefinition | undefined =
          animations[
            animation
          ];

        if (
          !definition
        ) {
          onError?.(
            new Error(
              `Node animation "${animation}" does not exist.`
            )
          );

          return Promise.resolve();
        }

        const root =
          rootRef.current;

        if (!root) {
          return Promise.resolve();
        }

        const node =
          root.getObjectByName(
            definition.node
          );

        if (!node) {
          onError?.(
            new Error(
              `3D node "${definition.node}" was not found.`
            )
          );

          return Promise.resolve();
        }

        /**
         * Cancel an existing animation
         * on this same node.
         */
        const existing =
          tasksRef.current.get(
            node.uuid
          );

        if (
          existing
        ) {
          existing.resolve();

          tasksRef.current.delete(
            node.uuid
          );
        }

        const duration =
          Math.max(
            1,

            definition.duration ??
              600
          );

        const targetPosition =
          resolveVector(
            node.position,

            definition.position
          );

        const targetRotation =
          resolveEuler(
            node.rotation,

            definition.rotation
          );

        const targetScale =
          resolveVector(
            node.scale,

            definition.scale
          );

        onNodeAnimationStart?.(
          animation,

          node.name
        );

        return new Promise<void>(
          (
            resolve
          ) => {
            tasksRef.current.set(
              node.uuid,

              {
                animation,

                node,

                startedAt:
                  performance.now(),

                duration,

                easing:
                  definition.easing ??
                  "easeInOut",

                startPosition:
                  node.position.clone(),

                targetPosition,

                startRotation:
                  node.rotation.clone(),

                targetRotation,

                startScale:
                  node.scale.clone(),

                targetScale,

                resolve,
              }
            );
          }
        );
      },
      [
        animations,
        onError,
        onNodeAnimationStart,
        resolveEuler,
        resolveVector,
        rootRef,
      ]
    );

  /* ==========================================================
     STOP
     ========================================================== */

  const stopAll =
    useCallback(
      () => {
        tasksRef.current.forEach(
          (
            task
          ) => {
            task.resolve();
          }
        );

        tasksRef.current.clear();
      },
      []
    );

  /* ==========================================================
     NODES
     ========================================================== */

  const getNodeNames =
    useCallback(
      () => {
        const root =
          rootRef.current;

        if (!root) {
          return [];
        }

        const names =
          new Set<string>();

        root.traverse(
          (
            object
          ) => {
            if (
              object.name
            ) {
              names.add(
                object.name
              );
            }
          }
        );

        return [
          ...names,
        ];
      },
      [
        rootRef,
      ]
    );

  return {
    play,

    stopAll,

    getNodeNames,
  };
}