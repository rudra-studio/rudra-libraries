import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export interface MotionParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** How far the element moves in pixels. 
   * Positive = moves slower than scroll (pushes down).
   * Negative = moves faster than scroll (pulls up).
   */
  offset?: number; 
}

export default function MotionParallax({
  children,
  offset = 50,
  className = '',
  ...props
}: MotionParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Track this specific element's position relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start end": Start tracking when the TOP of the element hits the BOTTOM of the viewport
    // "end start": Stop tracking when the BOTTOM of the element hits the TOP of the viewport
    offset: ["start end", "end start"]
  });

  // 2. Map the scroll progress (0 to 1) to the physical Y pixel offset
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} {...props}>
      <motion.div 
        style={{ y }} 
        // We use a slight scale up so the image doesn't show its hard edges as it moves up and down
        className="w-full h-full scale-[1.15]" 
      >
        {children}
      </motion.div>
    </div>
  );
}