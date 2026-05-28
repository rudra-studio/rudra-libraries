import React from 'react';
import { motion } from 'motion/react';

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'; /* @select|up|down|left|right|none */
  delay?: number; // E.g., 0.2
  duration?: number; // E.g., 0.5
  once?: boolean; // If true, it only animates the first time you scroll to it
  distance?: number; // How far it slides from
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  once = true,
  distance = 50,
  className = '',
  ...props
}: RevealProps) {
  
  // Calculate initial position based on the selected direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      case 'none': return { x: 0, y: 0 };
      default: return { y: distance, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] // A premium, buttery ease-out curve
      }}
      className={`w-full ${className}`}
      {...props}
    >
      {/* Fallback for the builder if it's empty */}
      {children}
    </motion.div>
  );
}