"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  motion,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

import {
  type ScrollStoryRange,
} from "./ScrollStoryContext";

import useScrollStory from "../../hooks/useScrollStory";

export interface ScrollChapterProps {
  /**
   * Unique section ID used by ScrollStoryLink.
   */
  id: string;

  range: ScrollStoryRange;
  children: ReactNode;

  align?: "left" | "center" | "right";

  verticalAlign?:
    | "start"
    | "center"
    | "end";

  width?: string | number;

  className?: string;
  style?: CSSProperties;

  fade?: boolean;
  slidePx?: number;

  interactive?: boolean;

  ariaLabel?: string;
}

const horizontalAlignment = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
} as const;

const verticalAlignment = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
} as const;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export default function ScrollChapter({
  id,
  range,
  children,
  align = "left",
  verticalAlign = "center",
  width = "min(42rem, 90vw)",
  className,
  style,
  fade = true,
  slidePx = 32,
  interactive = false,
  ariaLabel,
}: ScrollChapterProps) {
  const {
    progress,
    registerSection,
    activeSectionId,
  } = useScrollStory();

  const start = clamp01(range[0]);
  const end = clamp01(range[1]);

  const chapterLength = Math.max(
    0.0001,
    end - start,
  );

  const transitionLength = Math.min(
    chapterLength * 0.22,
    0.045,
  );

  const [active, setActive] =
    useState(() => {
      const currentProgress =
        progress.get();

      return (
        currentProgress >= start &&
        currentProgress <= end
      );
    });

  useEffect(() => {
    return registerSection(id, [
      start,
      end,
    ]);
  }, [
    id,
    start,
    end,
    registerSection,
  ]);

  const opacity = useTransform(
    progress,
    (currentProgress) => {
      if (
        currentProgress < start ||
        currentProgress > end
      ) {
        return 0;
      }

      if (!fade) {
        return 1;
      }

      const enterEnd =
        start + transitionLength;

      const exitStart =
        end - transitionLength;

      if (
        start > 0 &&
        currentProgress < enterEnd
      ) {
        return clamp01(
          (currentProgress - start) /
            transitionLength,
        );
      }

      if (
        end < 1 &&
        currentProgress > exitStart
      ) {
        return clamp01(
          (end - currentProgress) /
            transitionLength,
        );
      }

      return 1;
    },
  );

  const y = useTransform(
    progress,
    (currentProgress) => {
      if (currentProgress <= start) {
        return slidePx;
      }

      if (currentProgress >= end) {
        return -slidePx;
      }

      const enterEnd =
        start + transitionLength;

      const exitStart =
        end - transitionLength;

      if (
        start > 0 &&
        currentProgress < enterEnd
      ) {
        const enterProgress =
          clamp01(
            (currentProgress - start) /
              transitionLength,
          );

        return (
          slidePx *
          (1 - enterProgress)
        );
      }

      if (
        end < 1 &&
        currentProgress > exitStart
      ) {
        const exitProgress =
          clamp01(
            (
              currentProgress -
              exitStart
            ) / transitionLength,
          );

        return (
          -slidePx *
          exitProgress
        );
      }

      return 0;
    },
  );

  useMotionValueEvent(
    progress,
    "change",
    (currentProgress) => {
      const nextActive =
        currentProgress >= start &&
        currentProgress <= end;

      setActive(
        (currentActive) =>
          currentActive === nextActive
            ? currentActive
            : nextActive,
      );
    },
  );

  return (
    <motion.section
      id={id}
      aria-label={ariaLabel}
      aria-hidden={!active}
      data-active={
        activeSectionId === id
          ? "true"
          : "false"
      }
      style={{
        position: "absolute",
        inset: 0,

        display: "flex",

        justifyContent:
          horizontalAlignment[align],

        alignItems:
          verticalAlignment[
            verticalAlign
          ],

        padding:
          "clamp(1rem, 4vw, 4rem)",

        pointerEvents:
          interactive && active
            ? "auto"
            : "none",

        visibility:
          active ? "visible" : "hidden",

        opacity,
      }}
    >
      <motion.div
        className={className}
        style={{
          width,
          ...style,
          y,
        }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}