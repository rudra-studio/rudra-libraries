
import type {
  CSSProperties,
  ReactNode,
} from "react";

export interface LayeredImageSceneProps {
  children: ReactNode;

  perspective?: number;
  background?: string;

  className?: string;
  style?: CSSProperties;
}

export default function LayeredImageScene({
  children,
  perspective = 1200,
  background = "transparent",
  className,
  style,
}: LayeredImageSceneProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,

        overflow: "hidden",
        perspective,
        background,

        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}