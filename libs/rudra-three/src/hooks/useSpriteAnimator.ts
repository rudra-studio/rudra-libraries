"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  SpriteActionMap,
  SpriteAnimationClip,
  SpriteAnimationMap,
  SpriteAnimatorHandle,
  SpriteSequenceStep,
  SpriteSheetSource,
} from "../../components/SpriteAnimator";

/* ============================================================
   INTERNAL ENGINE TYPES
   ============================================================ */

type PlaybackMode =
  | "single"
  | "sequence"
  | "action";

type PlaybackPhase =
  | "before"
  | "playing"
  | "after";

type LastRequest =
  | {
      type: "single";

      animation: string;
    }
  | {
      type: "sequence";

      sequence:
        SpriteSequenceStep[];
    }
  | {
      type: "action";

      action: string;
    };

interface RuntimeState {
  mode: PlaybackMode;

  clipName:
    string | null;

  frameIndex: number;

  completedLoops:
    number;

  playing: boolean;

  manuallyPaused:
    boolean;

  phase:
    PlaybackPhase;

  phaseStartedAt:
    number;

  lastFrameAt:
    number;

  lastTickAt:
    number;

  animationStartEmitted:
    boolean;

  plan:
    SpriteSequenceStep[];

  planIndex:
    number;

  currentAction:
    string | null;

  lastRequest:
    LastRequest | null;
}

interface UseSpriteAnimatorOptions {
  animations:
    SpriteAnimationMap;

  actions?:
    SpriteActionMap;

  animation?: string;

  sequence?:
    SpriteSequenceStep[];

  action?: string;

  autoPlay?: boolean;

  paused?: boolean;

  speed?: number;

  preload?: boolean;

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
   PLAYBACK-SPECIFIC HELPERS
   ============================================================ */

function getSheetFrameCount(
  sheet: SpriteSheetSource
): number {
  const columns =
    Math.floor(
      sheet.columns
    );

  const rows =
    Math.floor(
      sheet.rows
    );

  if (
    columns <= 0 ||
    rows <= 0
  ) {
    return 0;
  }

  const total =
    columns * rows;

  if (
    sheet.frameIndexes &&
    sheet.frameIndexes.length >
      0
  ) {
    return sheet.frameIndexes.filter(
      (frame) => {
        const value =
          Math.floor(
            frame
          );

        return (
          value >= 0 &&
          value < total
        );
      }
    ).length;
  }

  if (
    sheet.startFrame !== undefined ||
    sheet.endFrame !== undefined
  ) {
    const start =
      Math.max(
        0,
        Math.floor(
          sheet.startFrame ??
            0
        )
      );

    const end =
      Math.min(
        total - 1,
        Math.floor(
          sheet.endFrame ??
            total - 1
        )
      );

    return end >= start
      ? end -
          start +
          1
      : 0;
  }

  if (
    sheet.row !== undefined
  ) {
    const startColumn =
      Math.max(
        0,
        Math.min(
          Math.floor(
            sheet.fromColumn ??
              0
          ),
          columns - 1
        )
      );

    const endColumn =
      Math.max(
        0,
        Math.min(
          Math.floor(
            sheet.toColumn ??
              columns - 1
          ),
          columns - 1
        )
      );

    return endColumn >=
      startColumn
      ? endColumn -
          startColumn +
          1
      : 0;
  }

  return total;
}

function getFrameCount(
  clip?: SpriteAnimationClip
): number {
  if (!clip) {
    return 0;
  }

  if (
    clip.frames &&
    clip.frames.length > 0
  ) {
    return clip.frames.length;
  }

  if (clip.sheet) {
    return getSheetFrameCount(
      clip.sheet
    );
  }

  return 0;
}

function clampFrame(
  frame: number,
  count: number
): number {
  if (
    count <= 0
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      Math.floor(frame),
      count - 1
    )
  );
}

/* ============================================================
   HOOK
   ============================================================ */

export default function useSpriteAnimator({
  animations,

  actions = {},

  animation,

  sequence,

  action,

  autoPlay = true,

  paused = false,

  speed = 1,

  preload = true,

  onAnimationStart,

  onAnimationComplete,

  onFrameChange,

  onSequenceComplete,

  onActionStart,

  onActionComplete,

  onError,
}: UseSpriteAnimatorOptions) {
  const animationsRef =
    useRef(
      animations
    );

  const actionsRef =
    useRef(
      actions
    );

  const sequenceRef =
    useRef(
      sequence
    );

  const speedRef =
    useRef(
      speed
    );

  const pausedRef =
    useRef(
      paused
    );

  animationsRef.current =
    animations;

  actionsRef.current =
    actions;

  sequenceRef.current =
    sequence;

  speedRef.current =
    speed;

  pausedRef.current =
    paused;

  const callbacksRef =
    useRef({
      onAnimationStart,

      onAnimationComplete,

      onFrameChange,

      onSequenceComplete,

      onActionStart,

      onActionComplete,

      onError,
    });

  callbacksRef.current = {
    onAnimationStart,

    onAnimationComplete,

    onFrameChange,

    onSequenceComplete,

    onActionStart,

    onActionComplete,

    onError,
  };

  const [
    currentAnimation,
    setCurrentAnimation,
  ] = useState<
    string | null
  >(null);

  const [
    currentFrame,
    setCurrentFrame,
  ] = useState(0);

  const runtimeRef =
    useRef<RuntimeState>({
      mode: "single",

      clipName: null,

      frameIndex: 0,

      completedLoops: 0,

      playing: false,

      manuallyPaused: false,

      phase: "playing",

      phaseStartedAt: 0,

      lastFrameAt: 0,

      lastTickAt: 0,

      animationStartEmitted:
        false,

      plan: [],

      planIndex: 0,

      currentAction: null,

      lastRequest: null,
    });

  const emitError =
    useCallback(
      (
        message: string
      ) => {
        const error =
          new Error(
            message
          );

        console.warn(
          `[SpriteAnimator] ${message}`
        );

        callbacksRef.current
          .onError?.(
            error
          );
      },
      []
    );

  const setFrame =
    useCallback(
      (
        clipName:
          string,

        frame:
          number
      ) => {
        const clip =
          animationsRef.current[
            clipName
          ];

        if (!clip) {
          return;
        }

        const count =
          getFrameCount(
            clip
          );

        if (
          count <= 0
        ) {
          return;
        }

        const safeFrame =
          clampFrame(
            frame,
            count
          );

        runtimeRef.current.frameIndex =
          safeFrame;

        setCurrentAnimation(
          clipName
        );

        setCurrentFrame(
          safeFrame
        );

        callbacksRef.current
          .onFrameChange?.(
            safeFrame,
            clipName
          );
      },
      []
    );

  const loadPlanStep =
    useCallback(
      (
        index:
          number,

        now:
          number
      ) => {
        const runtime =
          runtimeRef.current;

        const step =
          runtime.plan[
            index
          ];

        if (!step) {
          return false;
        }

        const clip =
          animationsRef.current[
            step.animation
          ];

        if (!clip) {
          emitError(
            `Animation "${step.animation}" does not exist.`
          );

          return false;
        }

        if (
          getFrameCount(
            clip
          ) <= 0
        ) {
          emitError(
            `Animation "${step.animation}" has no frames.`
          );

          return false;
        }

        runtime.planIndex =
          index;

        runtime.clipName =
          step.animation;

        runtime.frameIndex =
          0;

        runtime.completedLoops =
          0;

        runtime.animationStartEmitted =
          false;

        runtime.phase =
          (
            step.delayBefore ??
            0
          ) > 0
            ? "before"
            : "playing";

        runtime.phaseStartedAt =
          now;

        runtime.lastFrameAt =
          now;

        runtime.lastTickAt =
          now;

        setFrame(
          step.animation,
          0
        );

        return true;
      },
      [
        emitError,
        setFrame,
      ]
    );

  const startSingle =
    useCallback(
      (
        name:
          string,

        shouldPlay =
          true,

        remember =
          true
      ) => {
        const clip =
          animationsRef.current[
            name
          ];

        if (!clip) {
          emitError(
            `Animation "${name}" does not exist.`
          );

          return;
        }

        if (
          getFrameCount(
            clip
          ) <= 0
        ) {
          emitError(
            `Animation "${name}" has no frames.`
          );

          return;
        }

        const now =
          performance.now();

        const runtime =
          runtimeRef.current;

        runtime.mode =
          "single";

        runtime.clipName =
          name;

        runtime.frameIndex =
          0;

        runtime.completedLoops =
          0;

        runtime.playing =
          shouldPlay;

        runtime.manuallyPaused =
          false;

        runtime.phase =
          "playing";

        runtime.phaseStartedAt =
          now;

        runtime.lastFrameAt =
          now;

        runtime.lastTickAt =
          now;

        runtime.animationStartEmitted =
          false;

        runtime.plan =
          [];

        runtime.planIndex =
          0;

        runtime.currentAction =
          null;

        if (remember) {
          runtime.lastRequest =
            {
              type:
                "single",

              animation:
                name,
            };
        }

        setFrame(
          name,
          0
        );
      },
      [
        emitError,
        setFrame,
      ]
    );

  const startSequence =
    useCallback(
      (
        steps:
          SpriteSequenceStep[],

        mode:
          | "sequence"
          | "action" =
          "sequence",

        actionName:
          string | null =
          null,

        shouldPlay =
          true,

        remember =
          true
      ) => {
        if (
          steps.length ===
          0
        ) {
          emitError(
            "Cannot play an empty sprite sequence."
          );

          return;
        }

        const runtime =
          runtimeRef.current;

        const now =
          performance.now();

        runtime.mode =
          mode;

        runtime.plan =
          steps.map(
            (step) => ({
              ...step,
            })
          );

        runtime.planIndex =
          0;

        runtime.playing =
          shouldPlay;

        runtime.manuallyPaused =
          false;

        runtime.currentAction =
          actionName;

        if (remember) {
          runtime.lastRequest =
            mode ===
              "action" &&
            actionName
              ? {
                  type:
                    "action",

                  action:
                    actionName,
                }
              : {
                  type:
                    "sequence",

                  sequence:
                    steps.map(
                      (
                        step
                      ) => ({
                        ...step,
                      })
                    ),
                };
        }

        if (
          mode ===
            "action" &&
          actionName
        ) {
          callbacksRef.current
            .onActionStart?.(
              actionName
            );
        }

        loadPlanStep(
          0,
          now
        );
      },
      [
        emitError,
        loadPlanStep,
      ]
    );

  const startAction =
    useCallback(
      (
        name:
          string,

        shouldPlay =
          true,

        remember =
          true
      ) => {
        const steps =
          actionsRef.current[
            name
          ];

        if (!steps) {
          emitError(
            `Action "${name}" does not exist.`
          );

          return;
        }

        startSequence(
          steps,
          "action",
          name,
          shouldPlay,
          remember
        );
      },
      [
        emitError,
        startSequence,
      ]
    );

  const finishSequence =
    useCallback(
      () => {
        const runtime =
          runtimeRef.current;

        runtime.playing =
          false;

        callbacksRef.current
          .onSequenceComplete?.();

        if (
          runtime.mode ===
            "action" &&
          runtime.currentAction
        ) {
          callbacksRef.current
            .onActionComplete?.(
              runtime.currentAction
            );
        }
      },
      []
    );

  const nextPlanStep =
    useCallback(
      (
        now:
          number
      ) => {
        const runtime =
          runtimeRef.current;

        const nextIndex =
          runtime.planIndex +
          1;

        if (
          nextIndex >=
          runtime.plan.length
        ) {
          finishSequence();

          return;
        }

        loadPlanStep(
          nextIndex,
          now
        );
      },
      [
        finishSequence,
        loadPlanStep,
      ]
    );

  /* ==========================================================
     ANIMATION LOOP
     ========================================================== */

  useEffect(() => {
    let requestId =
      0;

    const tick = (
      now: number
    ) => {
      const runtime =
        runtimeRef.current;

      const previous =
        runtime.lastTickAt ||
        now;

      const delta =
        now -
        previous;

      runtime.lastTickAt =
        now;

      const isPaused =
        pausedRef.current ||
        runtime.manuallyPaused;

      if (isPaused) {
        runtime.lastFrameAt +=
          delta;

        runtime.phaseStartedAt +=
          delta;

        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      if (
        !runtime.playing ||
        !runtime.clipName
      ) {
        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      const clip =
        animationsRef.current[
          runtime.clipName
        ];

      if (!clip) {
        runtime.playing =
          false;

        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      const frameCount =
        getFrameCount(
          clip
        );

      if (
        frameCount <=
        0
      ) {
        runtime.playing =
          false;

        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      const step =
        runtime.mode ===
        "single"
          ? null
          : runtime.plan[
              runtime.planIndex
            ];

      /* ---------------- BEFORE DELAY ---------------- */

      if (
        runtime.phase ===
        "before"
      ) {
        if (
          now -
            runtime.phaseStartedAt >=
          (
            step?.delayBefore ??
            0
          )
        ) {
          runtime.phase =
            "playing";

          runtime.lastFrameAt =
            now;

          runtime.animationStartEmitted =
            false;
        }

        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      /* ---------------- AFTER DELAY ---------------- */

      if (
        runtime.phase ===
        "after"
      ) {
        if (
          now -
            runtime.phaseStartedAt >=
          (
            step?.delayAfter ??
            0
          )
        ) {
          nextPlanStep(
            now
          );
        }

        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      /* ---------------- START EVENT ---------------- */

      if (
        !runtime.animationStartEmitted
      ) {
        runtime.animationStartEmitted =
          true;

        callbacksRef.current
          .onAnimationStart?.(
            runtime.clipName
          );
      }

      /* ---------------- FRAME TIMING ---------------- */

      const fps =
        Math.max(
          0.01,
          clip.fps ??
            12
        );

      const globalSpeed =
        Math.max(
          0.01,
          speedRef.current
        );

      const stepSpeed =
        Math.max(
          0.01,
          step?.speed ??
            1
        );

      const frameDuration =
        1000 /
        (
          fps *
          globalSpeed *
          stepSpeed
        );

      if (
        now -
          runtime.lastFrameAt <
        frameDuration
      ) {
        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      runtime.lastFrameAt =
        now;

      const isLastFrame =
        runtime.frameIndex >=
        frameCount - 1;

      /* ---------------- NEXT FRAME ---------------- */

      if (
        !isLastFrame
      ) {
        setFrame(
          runtime.clipName,

          runtime.frameIndex +
            1
        );

        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      runtime.completedLoops +=
        1;

      let requiredLoops:
        number;

      if (
        runtime.mode ===
        "single"
      ) {
        requiredLoops =
          clip.loop
            ? Infinity
            : 1;
      } else {
        const loops =
          step?.loops ??
          1;

        requiredLoops =
          loops ===
          Infinity
            ? Infinity
            : Math.max(
                1,
                loops
              );
      }

      /* ---------------- LOOP ---------------- */

      if (
        runtime.completedLoops <
        requiredLoops
      ) {
        setFrame(
          runtime.clipName,
          0
        );

        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      /* ---------------- COMPLETE ---------------- */

      callbacksRef.current
        .onAnimationComplete?.(
          runtime.clipName
        );

      if (
        runtime.mode ===
        "single"
      ) {
        if (
          clip.next &&
          animationsRef.current[
            clip.next
          ]
        ) {
          startSingle(
            clip.next,
            true,
            false
          );
        } else {
          runtime.playing =
            false;

          if (
            !clip.holdLastFrame
          ) {
            setFrame(
              runtime.clipName,
              0
            );
          }
        }

        requestId =
          requestAnimationFrame(
            tick
          );

        return;
      }

      if (
        (
          step?.delayAfter ??
          0
        ) > 0
      ) {
        runtime.phase =
          "after";

        runtime.phaseStartedAt =
          now;
      } else {
        nextPlanStep(
          now
        );
      }

      requestId =
        requestAnimationFrame(
          tick
        );
    };

    requestId =
      requestAnimationFrame(
        tick
      );

    return () => {
      cancelAnimationFrame(
        requestId
      );
    };
  }, [
    nextPlanStep,
    setFrame,
    startSingle,
  ]);

  /* ==========================================================
     PRELOAD
     ========================================================== */

  useEffect(() => {
    if (!preload) {
      return;
    }

    const urls =
      new Set<string>();

    Object.values(
      animations
    ).forEach(
      (clip) => {
        clip.frames?.forEach(
          (src) =>
            urls.add(
              src
            )
        );

        if (
          clip.sheet?.src
        ) {
          urls.add(
            clip.sheet.src
          );
        }
      }
    );

    urls.forEach(
      (src) => {
        const image =
          new Image();

        image.src =
          src;
      }
    );
  }, [
    animations,
    preload,
  ]);

  /* ==========================================================
     CONTROLLED PROPS
     ========================================================== */

  const sequenceSignature =
    useMemo(
      () =>
        JSON.stringify(
          sequence ??
            null
        ),
      [sequence]
    );

  const actionSignature =
    useMemo(
      () =>
        JSON.stringify(
          action
            ? actions[
                action
              ] ??
                null
            : null
        ),
      [
        action,
        actions,
      ]
    );

  const animationNamesSignature =
    useMemo(
      () =>
        Object.keys(
          animations
        ).join("|"),
      [animations]
    );

  useEffect(() => {
    if (
      action &&
      actionsRef.current[
        action
      ]
    ) {
      startAction(
        action,
        autoPlay
      );

      return;
    }

    const currentSequence =
      sequenceRef.current;

    if (
      currentSequence &&
      currentSequence.length >
        0
    ) {
      startSequence(
        currentSequence,
        "sequence",
        null,
        autoPlay
      );

      return;
    }

    if (
      animation &&
      animationsRef.current[
        animation
      ]
    ) {
      startSingle(
        animation,
        autoPlay
      );

      return;
    }

    const first =
      Object.keys(
        animationsRef.current
      )[0];

    if (first) {
      startSingle(
        first,
        autoPlay
      );
    }
  }, [
    animation,

    action,

    autoPlay,

    sequenceSignature,

    actionSignature,

    animationNamesSignature,

    startAction,

    startSequence,

    startSingle,
  ]);

  /* ==========================================================
     IMPERATIVE CONTROLS
     ========================================================== */

  const controls =
    useMemo<SpriteAnimatorHandle>(
      () => ({
        play(
          name
        ) {
          startSingle(
            name,
            true
          );
        },

        playAction(
          name
        ) {
          startAction(
            name,
            true
          );
        },

        playSequence(
          steps
        ) {
          startSequence(
            steps,
            "sequence",
            null,
            true
          );
        },

        pause() {
          runtimeRef.current.manuallyPaused =
            true;
        },

        resume() {
          const runtime =
            runtimeRef.current;

          runtime.manuallyPaused =
            false;

          runtime.playing =
            true;

          const now =
            performance.now();

          runtime.lastFrameAt =
            now;

          runtime.lastTickAt =
            now;
        },

        stop(
          reset = false
        ) {
          const runtime =
            runtimeRef.current;

          runtime.playing =
            false;

          runtime.manuallyPaused =
            false;

          if (
            reset &&
            runtime.clipName
          ) {
            setFrame(
              runtime.clipName,
              0
            );
          }
        },

        restart() {
          const request =
            runtimeRef.current
              .lastRequest;

          if (!request) {
            return;
          }

          if (
            request.type ===
            "single"
          ) {
            startSingle(
              request.animation,
              true
            );

            return;
          }

          if (
            request.type ===
            "action"
          ) {
            startAction(
              request.action,
              true
            );

            return;
          }

          startSequence(
            request.sequence,
            "sequence",
            null,
            true
          );
        },

        goToFrame(
          frame,
          animationName
        ) {
          const target =
            animationName ??
            runtimeRef.current
              .clipName;

          if (!target) {
            return;
          }

          if (
            !animationsRef.current[
              target
            ]
          ) {
            return;
          }

          runtimeRef.current.clipName =
            target;

          setFrame(
            target,
            frame
          );
        },

        getCurrentAnimation() {
          return runtimeRef
            .current
            .clipName;
        },

        getCurrentFrame() {
          return runtimeRef
            .current
            .frameIndex;
        },

        isPlaying() {
          return (
            runtimeRef.current
              .playing &&
            !runtimeRef.current
              .manuallyPaused &&
            !pausedRef.current
          );
        },
      }),

      [
        setFrame,
        startAction,
        startSequence,
        startSingle,
      ]
    );

  /* ==========================================================
     REVERSE ONLY AFFECTS RENDERING
     ========================================================== */

  const currentClip =
    currentAnimation
      ? animations[
          currentAnimation
        ]
      : undefined;

  const frameCount =
    getFrameCount(
      currentClip
    );

  const renderFrame =
    currentClip?.reverse
      ? Math.max(
          0,
          frameCount -
            currentFrame -
            1
        )
      : currentFrame;

  return {
    currentAnimation,

    currentFrame,

    renderFrame,

    controls,
  };
}