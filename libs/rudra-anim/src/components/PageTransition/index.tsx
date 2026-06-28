import React from 'react';
import { motion, Variants } from 'motion/react';

export interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'fade' | 'slideUp' | 'slideRight' | 'scale'; /* @select|fade|slideUp|slideRight|scale */
  duration?: number;
  className?: string;
}

export default function PageTransition({
  children,
  variant = 'slideUp',
  duration = 0.4,
  className = '',
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
      className={`w-full h-full ${className}`}
      {...props}
    >
      {children}
    </motion.main>
  );
}