import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export interface MagneticHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  intensity?: 'light' | 'medium' | 'heavy'; /* @select|light|medium|heavy */
  springStiffness?: number; // Higher is tighter (e.g., 150)
  springDamping?: number;   // Higher is less bouncy (e.g., 15)
}

export default function MagneticHover({
  children,
  intensity = 'medium',
  springStiffness = 150,
  springDamping = 15,
  className = '',
  ...props
}: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Define how strong the magnetic pull is based on the selected intensity
  const getPullStrength = () => {
    switch (intensity) {
      case 'light': return 0.2;
      case 'medium': return 0.5;
      case 'heavy': return 0.8;
      default: return 0.5;
    }
  };

  // Motion values track the X and Y translation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Wrap the raw motion values in a spring physics simulation
  const springConfig = { stiffness: springStiffness, damping: springDamping, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of the element
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Set the motion values (multiplied by pull strength)
    x.set((clientX - centerX) * getPullStrength());
    y.set((clientY - centerY) * getPullStrength());
  };

  const handleMouseLeave = () => {
    // Snap back to origin
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`w-fit ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}