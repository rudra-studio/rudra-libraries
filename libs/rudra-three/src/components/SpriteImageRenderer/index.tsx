"use client";

import React from "react";

export interface SpriteImageRendererProps {
  src: string;

  width?: number | string;

  height?: number | string;

  className?: string;

  imageClassName?: string;

  objectFit?:
    | "contain"
    | "cover"
    | "fill"
    | "none"
    | "scale-down";

  imageRendering?:
    React.CSSProperties["imageRendering"];

  alt?: string;

  onError?: (
    error: Error
  ) => void;
}

export default function SpriteImageRenderer({
  src,

  width = "100%",

  height = "100%",

  className = "",

  imageClassName = "",

  objectFit = "contain",

  imageRendering = "auto",

  alt = "",

  onError,
}: SpriteImageRendererProps) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        ${className}
      `}
      style={{
        width,
        height,
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`
          block
          h-full
          w-full
          select-none
          ${imageClassName}
        `}
        style={{
          objectFit,
          imageRendering,
        }}
        onError={() => {
          onError?.(
            new Error(
              `Unable to load sprite frame: ${src}`
            )
          );
        }}
      />
    </div>
  );
}