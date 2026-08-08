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
  ModelMovementOptions,
  ModelVector3,
} from "../../components/InteractiveModel3D";

/* ============================================================
   INTERNAL TYPES
   ============================================================ */

interface PositionTask {
  from:
    THREE.Vector3;

  to:
    THREE.Vector3;

  startedAt:
    number;

  duration:
    number;

  easing:
    ModelEasing;

  resolve:
    () => void;
}

interface RotationTask {
  from:
    THREE.Euler;

  to:
    THREE.Euler;

  startedAt:
    number;

  duration:
    number;

  easing:
    ModelEasing;

  resolve:
    () => void;
}

interface UseModelMovementOptions {
  groupRef:
    RefObject<THREE.Group | null>;
}

export interface UseModelMovementResult {
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

  getPosition: () => ModelVector3;

  getRotation: () => ModelVector3;
}

/* ============================================================
   HOOK
   ============================================================ */

export default function useModelMovement({
  groupRef,
}: UseModelMovementOptions): UseModelMovementResult {
  const positionTaskRef =
    useRef<PositionTask | null>(
      null
    );

  const rotationTaskRef =
    useRef<RotationTask | null>(
      null
    );

  /* ==========================================================
     LOCAL HELPER
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

        /**
         * easeInOut
         */
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

  /* ==========================================================
     RENDER LOOP
     ========================================================== */

  useFrame(
    () => {
      const group =
        groupRef.current;

      if (!group) {
        return;
      }

      const now =
        performance.now();

      const positionTask =
        positionTaskRef.current;

      if (
        positionTask
      ) {
        const progress =
          Math.min(
            1,

            (
              now -
              positionTask.startedAt
            ) /
              positionTask.duration
          );

        const value =
          ease(
            progress,

            positionTask.easing
          );

        group.position.lerpVectors(
          positionTask.from,

          positionTask.to,

          value
        );

        if (
          progress >=
          1
        ) {
          group.position.copy(
            positionTask.to
          );

          positionTask.resolve();

          positionTaskRef.current =
            null;
        }
      }

      const rotationTask =
        rotationTaskRef.current;

      if (
        rotationTask
      ) {
        const progress =
          Math.min(
            1,

            (
              now -
              rotationTask.startedAt
            ) /
              rotationTask.duration
          );

        const value =
          ease(
            progress,

            rotationTask.easing
          );

        group.rotation.set(
          THREE.MathUtils.lerp(
            rotationTask.from.x,

            rotationTask.to.x,

            value
          ),

          THREE.MathUtils.lerp(
            rotationTask.from.y,

            rotationTask.to.y,

            value
          ),

          THREE.MathUtils.lerp(
            rotationTask.from.z,

            rotationTask.to.z,

            value
          )
        );

        if (
          progress >=
          1
        ) {
          group.rotation.copy(
            rotationTask.to
          );

          rotationTask.resolve();

          rotationTaskRef.current =
            null;
        }
      }
    }
  );

  /* ==========================================================
     MOVE
     ========================================================== */

  const moveTo =
    useCallback(
      (
        position:
          ModelVector3,

        options:
          ModelMovementOptions = {}
      ) => {
        const group =
          groupRef.current;

        if (!group) {
          return Promise.resolve();
        }

        positionTaskRef.current?.resolve();

        const duration =
          Math.max(
            0,

            options.duration ??
              800
          );

        const target =
          new THREE.Vector3(
            ...position
          );

        if (
          duration ===
          0
        ) {
          group.position.copy(
            target
          );

          return Promise.resolve();
        }

        return new Promise<void>(
          (
            resolve
          ) => {
            positionTaskRef.current =
              {
                from:
                  group.position.clone(),

                to:
                  target,

                startedAt:
                  performance.now(),

                duration,

                easing:
                  options.easing ??
                  "easeInOut",

                resolve,
              };
          }
        );
      },
      [
        groupRef,
      ]
    );

  const moveBy =
    useCallback(
      (
        offset:
          ModelVector3,

        options?:
          ModelMovementOptions
      ) => {
        const group =
          groupRef.current;

        if (!group) {
          return Promise.resolve();
        }

        const target =
          group.position
            .clone()
            .add(
              new THREE.Vector3(
                ...offset
              )
            );

        return moveTo(
          [
            target.x,
            target.y,
            target.z,
          ],

          options
        );
      },
      [
        groupRef,
        moveTo,
      ]
    );

  /* ==========================================================
     LOCAL-DIRECTION MOVEMENT
     ========================================================== */

  const moveLocal =
    useCallback(
      (
        localOffset:
          ModelVector3,

        options?:
          ModelMovementOptions
      ) => {
        const group =
          groupRef.current;

        if (!group) {
          return Promise.resolve();
        }

        const offset =
          new THREE.Vector3(
            ...localOffset
          );

        offset.applyQuaternion(
          group.quaternion
        );

        const target =
          group.position
            .clone()
            .add(
              offset
            );

        return moveTo(
          [
            target.x,
            target.y,
            target.z,
          ],

          options
        );
      },
      [
        groupRef,
        moveTo,
      ]
    );

  const moveForward =
    useCallback(
      (
        distance:
          number,

        options?:
          ModelMovementOptions
      ) =>
        moveLocal(
          [
            0,
            0,
            -distance,
          ],

          options
        ),
      [
        moveLocal,
      ]
    );

  const moveBackward =
    useCallback(
      (
        distance:
          number,

        options?:
          ModelMovementOptions
      ) =>
        moveLocal(
          [
            0,
            0,
            distance,
          ],

          options
        ),
      [
        moveLocal,
      ]
    );

  const moveLeft =
    useCallback(
      (
        distance:
          number,

        options?:
          ModelMovementOptions
      ) =>
        moveLocal(
          [
            -distance,
            0,
            0,
          ],

          options
        ),
      [
        moveLocal,
      ]
    );

  const moveRight =
    useCallback(
      (
        distance:
          number,

        options?:
          ModelMovementOptions
      ) =>
        moveLocal(
          [
            distance,
            0,
            0,
          ],

          options
        ),
      [
        moveLocal,
      ]
    );

  /* ==========================================================
     ROTATION
     ========================================================== */

  const rotateTo =
    useCallback(
      (
        rotation:
          ModelVector3,

        options:
          ModelMovementOptions = {}
      ) => {
        const group =
          groupRef.current;

        if (!group) {
          return Promise.resolve();
        }

        rotationTaskRef.current?.resolve();

        const duration =
          Math.max(
            0,

            options.duration ??
              500
          );

        const target =
          new THREE.Euler(
            ...rotation
          );

        if (
          duration ===
          0
        ) {
          group.rotation.copy(
            target
          );

          return Promise.resolve();
        }

        return new Promise<void>(
          (
            resolve
          ) => {
            rotationTaskRef.current =
              {
                from:
                  group.rotation.clone(),

                to:
                  target,

                startedAt:
                  performance.now(),

                duration,

                easing:
                  options.easing ??
                  "easeInOut",

                resolve,
              };
          }
        );
      },
      [
        groupRef,
      ]
    );

  const rotateBy =
    useCallback(
      (
        offset:
          ModelVector3,

        options?:
          ModelMovementOptions
      ) => {
        const group =
          groupRef.current;

        if (!group) {
          return Promise.resolve();
        }

        return rotateTo(
          [
            group.rotation.x +
              offset[0],

            group.rotation.y +
              offset[1],

            group.rotation.z +
              offset[2],
          ],

          options
        );
      },
      [
        groupRef,
        rotateTo,
      ]
    );

  /* ==========================================================
     STOP
     ========================================================== */

  const stopMovement =
    useCallback(
      () => {
        positionTaskRef.current?.resolve();

        rotationTaskRef.current?.resolve();

        positionTaskRef.current =
          null;

        rotationTaskRef.current =
          null;
      },
      []
    );

  /* ==========================================================
     GETTERS
     ========================================================== */

  const getPosition =
    useCallback(
      (): ModelVector3 => {
        const group =
          groupRef.current;

        if (!group) {
          return [
            0,
            0,
            0,
          ];
        }

        return [
          group.position.x,
          group.position.y,
          group.position.z,
        ];
      },
      [
        groupRef,
      ]
    );

  const getRotation =
    useCallback(
      (): ModelVector3 => {
        const group =
          groupRef.current;

        if (!group) {
          return [
            0,
            0,
            0,
          ];
        }

        return [
          group.rotation.x,
          group.rotation.y,
          group.rotation.z,
        ];
      },
      [
        groupRef,
      ]
    );

  return {
    moveTo,

    moveBy,

    moveForward,

    moveBackward,

    moveLeft,

    moveRight,

    rotateTo,

    rotateBy,

    stopMovement,

    getPosition,

    getRotation,
  };
}