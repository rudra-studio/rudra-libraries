import type { CSSProperties } from "react";

import { motion } from "motion/react";

import  useScrollStory from "../../hooks/useScrollStory";

export interface ScrollProgressProps {
  position?: "top" | "bottom";

  /**
   * Distance from the selected edge.
   */
  offset?: number;

  /**
   * Horizontal spacing from both sides.
   */
  inset?: string | number;

  height?: number;

  trackColor?: string;
  progressColor?: string;

  showTrack?: boolean;

  className?: string;
  style?: CSSProperties;
}

export default function ScrollProgress({
  position = "bottom",
  offset = 20,
  inset = "clamp(1rem, 5vw, 4rem)",
  height = 4,
  trackColor = "rgba(255,255,255,0.16)",
  progressColor = "#38bdf8",
  showTrack = true,
  className,
  style,
}: ScrollProgressProps) {
  const { progress } = useScrollStory();

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",

        left: inset,
        right: inset,
        [position]: offset,

        zIndex: 100,

        height,

        borderRadius: 999,

        background: showTrack
          ? trackColor
          : "transparent",

        overflow: "hidden",

        pointerEvents: "none",

        ...style,
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",

          borderRadius: "inherit",

          background: progressColor,

          scaleX: progress,
          transformOrigin: "left center",

          willChange: "transform",
        }}
      />
    </div>
  );
}