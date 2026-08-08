"use client";

import {
  useCallback,
  useRef,
} from "react";

import type {
  ModelActionMap,
  ModelActionStep,
} from "../../components/InteractiveModel3D";

import type {
  UseModelAnimatorResult,
} from "./useModelAnimator";

import type {
  UseModelMovementResult,
} from "./useModelMovement";

import type {
  UseNodeAnimatorResult,
} from "./useNodeAnimator";

interface UseModelActionsOptions {
  actions?:
    ModelActionMap;

  animator:
    UseModelAnimatorResult;

  movement:
    UseModelMovementResult;

  nodeAnimator:
    UseNodeAnimatorResult;

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

export interface UseModelActionsResult {
  playAction: (
    action: string
  ) => Promise<void>;

  cancelAction: () => void;
}

export default function useModelActions({
  actions = {},

  animator,

  movement,

  nodeAnimator,

  onActionStart,

  onActionComplete,

  onError,
}: UseModelActionsOptions): UseModelActionsResult {
  const tokenRef =
    useRef(0);

  /* ==========================================================
     CANCEL
     ========================================================== */

  const cancelAction =
    useCallback(
      () => {
        tokenRef.current +=
          1;

        movement.stopMovement();

        nodeAnimator.stopAll();

        animator.stop();
      },
      [
        animator,
        movement,
        nodeAnimator,
      ]
    );

  /* ==========================================================
     RUN STEP
     ========================================================== */

  const runStep =
    useCallback(
      async (
        step:
          ModelActionStep,

        token:
          number
      ): Promise<void> => {
        if (
          token !==
          tokenRef.current
        ) {
          return;
        }

        switch (
          step.type
        ) {
          case "animation": {
            const promise =
              animator.play(
                step.animation,

                step.options
              );

            if (
              step.wait
            ) {
              await promise;
            }

            return;
          }

          case "stopAnimation": {
            animator.stop(
              step.animation,

              step.fade ??
                0
            );

            return;
          }

          case "nodeAnimation": {
            await nodeAnimator.play(
              step.animation
            );

            return;
          }

          case "move": {
            await movement.moveTo(
              step.to,

              {
                duration:
                  step.duration,

                easing:
                  step.easing,
              }
            );

            return;
          }

          case "moveBy": {
            await movement.moveBy(
              step.by,

              {
                duration:
                  step.duration,

                easing:
                  step.easing,
              }
            );

            return;
          }

          case "rotate": {
            await movement.rotateTo(
              step.to,

              {
                duration:
                  step.duration,

                easing:
                  step.easing,
              }
            );

            return;
          }

          case "rotateBy": {
            await movement.rotateBy(
              step.by,

              {
                duration:
                  step.duration,

                easing:
                  step.easing,
              }
            );

            return;
          }

          case "delay": {
            await new Promise<void>(
              (
                resolve
              ) => {
                window.setTimeout(
                  resolve,

                  step.duration
                );
              }
            );

            return;
          }

          case "parallel": {
            await Promise.all(
              step.steps.map(
                (
                  child
                ) =>
                  runStep(
                    child,

                    token
                  )
              )
            );

            return;
          }
        }
      },
      [
        animator,
        movement,
        nodeAnimator,
      ]
    );

  /* ==========================================================
     PLAY ACTION
     ========================================================== */

  const playAction =
    useCallback(
      async (
        name:
          string
      ) => {
        const steps =
          actions[
            name
          ];

        if (!steps) {
          onError?.(
            new Error(
              `3D action "${name}" does not exist.`
            )
          );

          return;
        }

        /**
         * Cancel previous action.
         */
        cancelAction();

        const token =
          ++tokenRef.current;

        onActionStart?.(
          name
        );

        for (
          const step of
          steps
        ) {
          if (
            token !==
            tokenRef.current
          ) {
            return;
          }

          await runStep(
            step,

            token
          );
        }

        if (
          token !==
          tokenRef.current
        ) {
          return;
        }

        onActionComplete?.(
          name
        );
      },
      [
        actions,
        cancelAction,
        onActionComplete,
        onActionStart,
        onError,
        runStep,
      ]
    );

  return {
    playAction,

    cancelAction,
  };
}