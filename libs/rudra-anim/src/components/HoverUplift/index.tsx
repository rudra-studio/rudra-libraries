import React from 'react';
import { motion } from 'motion/react';

export interface HoverUpliftProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  liftAmount?: number; // Distance in pixels to float upward (e.g., 6)
  hoverScale?: number; // Subtle expansion (e.g., 1.01)
  pressEffect?: boolean; // Compress downward on click /* @select|true|false */
  stiffness?: number; // Spring tension (higher = snappier)
  disabled?: boolean;
}

export default function HoverUplift({
  children,
  liftAmount = 6,
  hoverScale = 1.01,
  pressEffect = true,
  stiffness = 380,
  disabled = false,
  className = '',
  ...props
}: HoverUpliftProps) {

  // If disabled, render a passive pass-through wrapper
  if (disabled) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{
        y: -liftAmount,
        scale: hoverScale,
      }}
      whileTap={pressEffect ? {
        scale: 0.985,
        // Sinks 75% of the way back down toward the canvas on click
        y: -liftAmount * 0.25, 
      } : undefined}
      transition={{
        type: "spring",
        stiffness: stiffness,
        damping: 25, // Critically damped: snaps to position instantly with zero gelatinous wobble
      }}
      // Pairs JS hardware transforms with CSS compositor shadows
      className={`w-full transition-shadow duration-300 hover:shadow-xl cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}