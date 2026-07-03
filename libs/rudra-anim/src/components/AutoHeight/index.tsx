import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface AutoHeightProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isOpen?: boolean; /* @select|true|false */
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
   * "key": "Width",
   * "prefix": "w",
   * "type": "select",
   * "options": [
   * {"key": "full", "label": "Full Width"},
   * {"key": "fit", "label": "Fit Content"}
   * ]
   * },{
   * "key": "Display",
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

export default function AutoHeight({
  children,
  isOpen = true,
  duration = 0.4, // Slightly increased from 0.3 for a more luxurious spring feel
  customAttributes = {},
  // Solid Baseline Default
  className = 'w-full block',
  ...props
}: AutoHeightProps) {
  // We track whether the animation is actively running.
  // When closed, overflow MUST be hidden to prevent content spilling out.
  // When fully open, we often want overflow to be visible in case there are dropdowns inside.
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ 
            // Upgraded to a perfectly damped spring for flawless height interpolation
            height: { type: "spring", bounce: 0, duration }, 
            opacity: { duration: duration * 0.75, ease: "linear" } 
          }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          // If animating or closed, clamp the overflow. If open, let it breathe.
          style={{ overflow: isAnimating || !isOpen ? 'hidden' : 'visible' }}
          className={className}
          {...customAttributes}
          {...props}
        >
          {/* 
            An inner wrapper is critical. If padding is applied directly to the outer motion.div, 
            it breaks the height: 0 calculation because padding adds physical pixels.
            
            We animate this inner wrapper's Y axis to give that "unfolding" slide effect 
            while the outer container's height expands.
          */}
          <motion.div 
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            exit={{ y: -10 }}
            transition={{ type: "spring", bounce: 0, duration }}
            className="w-full pb-1"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}