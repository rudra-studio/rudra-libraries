"use client";

import React, {
  useEffect,
  useMemo,
} from "react";

import type {
  SpriteSheetSource,
} from "../SpriteAnimator";

export interface SpriteSheetRendererProps {
  sheet: SpriteSheetSource;

  /**
   * Logical animation frame.
   */
  frame: number;

  width?: number | string;

  height?: number | string;

  className?: string;

  imageClassName?: string;

  imageRendering?:
    React.CSSProperties["imageRendering"];

  alt?: string;

  onError?: (
    error: Error
  ) => void;
}

/* ============================================================
   SHEET-SPECIFIC HELPER
   ============================================================ */

function resolveSheetFrames(
  sheet: SpriteSheetSource
): number[] {
  const columns = Math.max(1, Math.floor(sheet?.columns));

  const rows =
    Math.floor(
      sheet.rows
    );

  if (
    columns <= 0 ||
    rows <= 0
  ) {
    return [];
  }

  const totalFrames =
    columns * rows;

  /* ----------------------------------------------------------
     EXPLICIT FRAME INDEXES
     ---------------------------------------------------------- */

  if (
    sheet.frameIndexes &&
    sheet.frameIndexes.length > 0
  ) {
    return sheet.frameIndexes
      .map(
        (frame) =>
          Math.floor(frame)
      )
      .filter(
        (frame) =>
          frame >= 0 &&
          frame < totalFrames
      );
  }

  /* ----------------------------------------------------------
     GLOBAL RANGE
     ---------------------------------------------------------- */

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
        totalFrames - 1,
        Math.floor(
          sheet.endFrame ??
            totalFrames - 1
        )
      );

    if (
      end < start
    ) {
      return [];
    }

    return Array.from(
      {
        length:
          end -
          start +
          1,
      },
      (_, index) =>
        start + index
    );
  }

  /* ----------------------------------------------------------
     ROW
     ---------------------------------------------------------- */

  if (
    sheet.row !== undefined
  ) {
    const row =
      Math.max(
        0,
        Math.min(
          Math.floor(
            sheet.row
          ),
          rows - 1
        )
      );

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

    if (
      endColumn <
      startColumn
    ) {
      return [];
    }

    return Array.from(
      {
        length:
          endColumn -
          startColumn +
          1,
      },
      (_, index) =>
        row *
          columns +
        startColumn +
        index
    );
  }

  /* ----------------------------------------------------------
     FULL SHEET
     ---------------------------------------------------------- */

  return Array.from(
    {
      length:
        totalFrames,
    },
    (_, index) =>
      index
  );
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function SpriteSheetRenderer({
  sheet,

  frame,

  width = "100%",

  height = "100%",

  className = "",

  imageClassName = "",

  imageRendering =
    "auto",

  alt = "",

  onError,
}: SpriteSheetRendererProps) {
  const columns =
    Math.max(
      1,
      Math.floor(
        sheet?.columns
      )
    );

  const rows =
    Math.max(
      1,
      Math.floor(
        sheet?.rows
      )
    );

  const resolvedFrames =
    useMemo(
      () =>
        resolveSheetFrames(
          sheet
        ),
      [sheet]
    );

  const safeFrame =
    Math.max(
      0,
      Math.min(
        frame,
        Math.max(
          resolvedFrames.length -
            1,
          0
        )
      )
    );

  const globalFrame =
    resolvedFrames[
      safeFrame
    ] ?? 0;

  const column =
    globalFrame %
    columns;

  const row =
    Math.floor(
      globalFrame /
        columns
    );

  const x =
    columns <= 1
      ? 0
      : (
          column /
          (columns - 1)
        ) *
        100;

  const y =
    rows <= 1
      ? 0
      : (
          row /
          (rows - 1)
        ) *
        100;

  /**
   * CSS background images don't provide
   * onError, so preload once to report
   * loading failures.
   */
  useEffect(() => {
    if (!onError) {
      return;
    }

    const image =
      new Image();

    image.onerror = () => {
      onError(
        new Error(
          `Unable to load sprite sheet: ${sheet.src}`
        )
      );
    };

    image.src =
      sheet.src;

    return () => {
      image.onerror =
        null;
    };
  }, [
    sheet.src,
    onError,
  ]);

  return (
    <div
      role="img"
      aria-label={alt}
      className={`
        relative
        overflow-hidden
        ${className}
        ${imageClassName}
      `}
      style={{
        width,

        height,

        backgroundImage:
          `url("${sheet.src}")`,

        backgroundRepeat:
          "no-repeat",

        backgroundSize:
          `${columns * 100}% ${rows * 100}%`,

        backgroundPosition:
          `${x}% ${y}%`,

        imageRendering,
      }}
    />
  );
}