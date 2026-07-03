import React from 'react';
import { motion, Variants } from 'motion/react';

export interface PageTransitionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  variant?: 'fade' | 'slideUp' | 'slideRight' | 'scale'; /* @select|fade|slideUp|slideRight|scale */
  duration?: number;
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>;

  /** * @type|class
   * @schema [{
   * "key": "Dimensions",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "w-full min-h-screen", "label": "Full Width, Min Height Screen"},
   * {"key": "w-full h-full", "label": "Full Width & Height"},
   * {"key": "w-full", "label": "Full Width, Auto Height"}
   * ]
   * },{
   * "key": "Layout",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "block", "label": "Block"},
   * {"key": "flex flex-col", "label": "Flex Column"}
   * ]
   * }]
   */
  className?: string;
}

export default function PageTransition({
  children,
  variant = 'slideUp',
  duration = 0.4,
  customAttributes = {},
  // Solid Baseline Default for routing root nodes
  className = 'w-full min-h-screen block',
  ...props
}: PageTransitionProps) {
  
  // Define premium routing transitions
  const variants: Record<string, Variants> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.04 },
    }
  };

  return (
    <motion.main
      variants={variants[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration, 
        ease: [0.22, 1, 0.36, 1] // Custom Apple-style ease-out
      }}
      className={className}
      {...customAttributes}
      {...props}
    >
      {children}
    </motion.main>
  );
}