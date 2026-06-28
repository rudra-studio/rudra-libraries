import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface AutoHeightProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isOpen?: boolean; /* @select|true|false */
  duration?: number;
  className?: string;
}

export default function AutoHeight({
  children,
  isOpen = true,
  duration = 0.3,
  className = '',
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
            height: { duration, ease: [0.25, 0.1, 0.25, 1] }, 
            opacity: { duration: duration * 0.8, ease: "linear" } 
          }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          // If animating or closed, clamp the overflow. If open, let it breathe.
          style={{ overflow: isAnimating || !isOpen ? 'hidden' : 'visible' }}
          className={`w-full ${className}`}
          {...props}
        >
          {/* An inner wrapper is critical. If padding is applied directly to the motion.div, 
            it breaks the height: 0 calculation because padding adds physical pixels.
          */}
          <div className="w-full pb-1">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}