import React from 'react';
import { motion } from 'motion/react';

export interface InteractiveWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  hoverScale?: number; // E.g., 1.05
  tapScale?: number; // E.g., 0.95
  addGlow?: boolean;
  glowColor?: string; /* @color */
}

export default function InteractiveWrapper({
  children,
  hoverScale = 1.05,
  tapScale = 0.95,
  addGlow = false,
  glowColor = '#3b82f6', // Default blue
  className = '',
  ...props
}: InteractiveWrapperProps) {
  
  return (
    <motion.div
      whileHover={{ 
        scale: hoverScale,
        boxShadow: addGlow ? `0 0 25px ${glowColor}60` : undefined
      }}
      whileTap={{ 
        scale: tapScale 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`w-fit cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}