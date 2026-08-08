"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  useAnimations,
} from "@react-three/drei";

import * as THREE from "three";

import type {
  RefObject,
} from "react";

import type {
  ModelAnimationMap,
  ModelAnimationPlayOptions,
} from "../../components/InteractiveModel3D";

interface UseModelAnimatorOptions {
  clips:
  THREE.AnimationClip[];

  rootRef:
  RefObject<THREE.Group | null>;

  definitions?:
  ModelAnimationMap;

  onAnimationStart?: (
    animation: string
  ) => void;

  onAnimationComplete?: (
    animation: string
  ) => void;

  onError?: (
    error: Error
  ) => void;
}

interface PendingAnimation {
  resolve: () => void;

  cleanup: () => void;
}

export interface UseModelAnimatorResult {
  names: string[];

  play: (
    animation: string,
    options?: ModelAnimationPlayOptions
  ) => Promise<void>;

  pause: (
    animation?: string
  ) => void;

  resume: (
    animation?: string
  ) => void;

  stop: (
    animation?: string,
    fade?: number
  ) => void;

  stopAll: () => void;
}

export default function useModelAnimator({
  clips,

  rootRef,

  definitions = {},

  onAnimationStart,

  onAnimationComplete,

  onError,
}: UseModelAnimatorOptions): UseModelAnimatorResult {
  const {
    actions,
    mixer,
    names,
  } =
    useAnimations(
      clips,
      rootRef
    );

  const currentActionRef =
    useRef<THREE.AnimationAction | null>(
      null
    );

  const currentNameRef =
    useRef<string | null>(
      null
    );

  const pendingRef =
    useRef<
      Map<
        THREE.AnimationAction,
        PendingAnimation
      >
    >(
      new Map()
    );

  const resolveAnimation =
    useCallback(
      (
        action:
          THREE.AnimationAction
      ) => {
        const pending =
          pendingRef.current.get(
            action
          );

        if (!pending) {
          return;
        }

        pending.cleanup();

        pending.resolve();

        pendingRef.current.delete(
          action
        );
      },
      []
    );

  const resolveDefinition =
    useCallback(
      (
        animation:
          string
      ) => {
        const definition =
          definitions[
          animation
          ];

        return {
          definition,

          clipName:
            definition?.clip ??
            animation,
        };
      },
      [
        definitions,
      ]
    );

  const play =
    useCallback(
      (
        animation:
          string,

        overrides:
          ModelAnimationPlayOptions = {}
      ) => {
        const {
          definition,
          clipName,
        } =
          resolveDefinition(
            animation
          );

        const action =
          actions[
          clipName
          ];

        if (!action) {
          const error =
            new Error(
              `3D animation clip "${clipName}" was not found.`
            );

          onError?.(
            error
          );

          return Promise.resolve();
        }

        /**
         * Resolve any old promise attached
         * to this same Three.js action.
         */
        resolveAnimation(
          action
        );

        const loop =
          overrides.loop ??
          definition?.loop ??
          false;

        const repetitions =
          overrides.repetitions ??
          definition?.repetitions ??
          Infinity;

        const speed =
          overrides.speed ??
          definition?.speed ??
          1;

        const fade =
          overrides.fade ??
          definition?.fade ??
          0.2;

        const clampWhenFinished =
          overrides.clampWhenFinished ??
          definition?.clampWhenFinished ??
          !loop;

        const previous =
          currentActionRef.current;

        action.reset();

        action.enabled =
          true;

        action.paused =
          false;

        action.clampWhenFinished =
          clampWhenFinished;

        action.setEffectiveWeight(
          1
        );

        action.setEffectiveTimeScale(
          speed
        );

        if (loop) {
          action.setLoop(
            THREE.LoopRepeat,

            repetitions
          );
        } else {
          action.setLoop(
            THREE.LoopOnce,
            1
          );
        }

        if (
          previous &&
          previous !== action
        ) {
          if (
            fade > 0
          ) {
            previous.fadeOut(
              fade
            );

            action.fadeIn(
              fade
            );
          } else {
            previous.stop();
          }
        }

        currentActionRef.current =
          action;

        currentNameRef.current =
          animation;

        action.play();

        onAnimationStart?.(
          animation
        );

        /**
         * Looping clips technically never finish,
         * so action sequencing must not await them.
         */
        if (loop) {
          return Promise.resolve();
        }

        return new Promise<void>(
          (
            resolve
          ) => {
            const finishedHandler =
              (
                event: any
              ) => {
                if (
                  event.action !==
                  action
                ) {
                  return;
                }

                mixer.removeEventListener(
                  "finished",

                  finishedHandler
                );

                pendingRef.current.delete(
                  action
                );

                onAnimationComplete?.(
                  animation
                );

                resolve();
              };

            mixer.addEventListener(
              "finished",

              finishedHandler
            );

            pendingRef.current.set(
              action,

              {
                resolve,

                cleanup: () => {
                  mixer.removeEventListener(
                    "finished",

                    finishedHandler
                  );
                },
              }
            );
          }
        );
      },
      [
        actions,
        mixer,
        onAnimationComplete,
        onAnimationStart,
        onError,
        resolveAnimation,
        resolveDefinition,
      ]
    );

  const getAction =
    useCallback(
      (
        animation?:
          string
      ) => {
        if (!animation) {
          return currentActionRef.current;
        }

        const {
          clipName,
        } =
          resolveDefinition(
            animation
          );

        return (
          actions[
          clipName
          ] ??
          null
        );
      },
      [
        actions,
        resolveDefinition,
      ]
    );

  const pause =
    useCallback(
      (
        animation?:
          string
      ) => {
        const action =
          getAction(
            animation
          );

        if (action) {
          action.paused =
            true;
        }
      },
      [
        getAction,
      ]
    );

  const resume =
    useCallback(
      (
        animation?:
          string
      ) => {
        const action =
          getAction(
            animation
          );

        if (action) {
          action.paused =
            false;

          action.play();
        }
      },
      [
        getAction,
      ]
    );

  const stop =
    useCallback(
      (
        animation?:
          string,

        fade = 0
      ) => {
        const action =
          getAction(
            animation
          );

        if (!action) {
          return;
        }

        resolveAnimation(
          action
        );

        if (
          fade > 0
        ) {
          action.fadeOut(
            fade
          );

          window.setTimeout(
            () => {
              action.stop();
            },

            fade *
            1000
          );
        } else {
          action.stop();
        }

        if (
          action ===
          currentActionRef.current
        ) {
          currentActionRef.current =
            null;

          currentNameRef.current =
            null;
        }
      },
      [
        getAction,
        resolveAnimation,
      ]
    );

  const stopAll =
    useCallback(
      () => {
        pendingRef.current.forEach(
          (
            pending
          ) => {
            pending.cleanup();

            pending.resolve();
          }
        );

        pendingRef.current.clear();

        mixer.stopAllAction();

        currentActionRef.current =
          null;

        currentNameRef.current =
          null;
      },
      [
        mixer,
      ]
    );

  useEffect(
    () => {
      return () => {
        pendingRef.current.forEach(
          (
            pending
          ) => {
            pending.cleanup();

            pending.resolve();
          }
        );

        pendingRef.current.clear();
      };
    },
    []
  );

  return {
    names,

    play,

    pause,

    resume,

    stop,

    stopAll,
  };
}