"use client";

import type { CSSProperties } from "react";

import  DepthLayer, {
 
  type DepthLayerProps,
} from "../DepthLayer";

export interface ImageLayerProps
  extends Omit<DepthLayerProps, "children"> {
  src: string;
  alt: string;

  imageStyle?: CSSProperties;

  draggable?: boolean;
  loading?: "eager" | "lazy";
}

export default function ImageLayer({
  src,
  alt,
  imageStyle,
  draggable = false,
  loading = "eager",
  ...depthLayerProps
}: ImageLayerProps) {
  return (
    <DepthLayer {...depthLayerProps}>
      <img
        src={src}
        alt={alt}
        draggable={draggable}
        loading={loading}
        style={{
          display: "block",
          width: "100%",
          height: "auto",

          userSelect: "none",
          pointerEvents: "none",

          ...imageStyle,
        }}
      />
    </DepthLayer>
  );
}