import React from 'react';
import { motion } from 'motion/react';

export interface HoverUpliftProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  liftAmount?: number; // Distance in pixels to float upward (e.g., 6)
  hoverScale?: number; // Subtle expansion (e.g., 1.01)
  pressEffect?: boolean; // Compress downward on click /* @select|true|false */
  stiffness?: number; // Spring tension (higher = snappier)
  disabled?: boolean;
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>;

  /** * @type|class
   * @schema [{
   * "key": "Display & Layout",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "block w-full cursor-pointer", "label": "Block (Full Width)"},
   * {"key": "inline-block w-fit cursor-pointer", "label": "Inline Block (Fit Content)"},
   * {"key": "flex items-center justify-center w-full cursor-pointer", "label": "Flex Center"}
   * ]
   * },{
   * "key": "Shadow Effect",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "transition-shadow duration-300 hover:shadow-xl", "label": "Large Shadow on Hover"},
   * {"key": "transition-shadow duration-300 hover:shadow-md", "label": "Medium Shadow on Hover"},
   * {"key": "transition-shadow duration-300 hover:shadow-2xl", "label": "Extra Large Shadow"},
   * {"key": "", "label": "No CSS Shadow (Transforms Only)"}
   * ]
   * }]
   */
  className?: string;
}

export default function HoverUplift({
  children,
  liftAmount = 6,
  hoverScale = 1.01,
  pressEffect = true,
  stiffness = 380,
  disabled = false,
  customAttributes = {},
  // Solid baseline default: Pairs JS hardware transforms with CSS compositor shadows
  className = 'block w-full transition-shadow duration-300 hover:shadow-xl cursor-pointer',
  ...props
}: HoverUpliftProps) {

  // If disabled, render a passive pass-through wrapper
  if (disabled) {
    return (
      <div 
        className={className} 
        {...customAttributes} 
        {...props}
      >
        {children}
      </div>
    );
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
      className={className}
      {...customAttributes}
      {...props}
    >
      {children}
    </motion.div>
  );
}