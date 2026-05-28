import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'; /* @select|text|circular|rectangular|rounded */
  animation?: 'pulse' | 'wave' | 'none'; /* @select|pulse|wave|none */
  width?: string; // e.g., "100%", "250px"
  height?: string; // e.g., "20px", "100px"
}

export default function Skeleton({
  variant = 'text',
  animation = 'pulse',
  width = '100%',
  height,
  className = '',
  ...props
}: SkeletonProps) {
  
  // Set smart default heights if the user doesn't provide one based on the variant
  const defaultHeight = height || (variant === 'text' ? '1rem' : variant === 'circular' ? '40px' : '150px');
  
  // Base classes for shape
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full w-10 h-10', // overrides width/height defaults slightly
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  // Base classes for animation
  const animationClasses = {
    pulse: 'animate-pulse bg-zinc-200 dark:bg-zinc-800',
    // Wave uses a specific tailwind trick to slide a gradient across the box
    wave: 'relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-zinc-200/50 dark:before:via-zinc-800/50 before:to-transparent',
    none: 'bg-zinc-200 dark:bg-zinc-800',
  };

  // Note: For 'wave' to work perfectly, you will need to add this keyframe to your tailwind.config.js:
  // keyframes: { shimmer: { '100%': { transform: 'translateX(100%)' } } }

  return (
    <div
      className={`
        ${variantClasses[variant]} 
        ${animationClasses[animation]} 
        ${className}
      `}
      style={{
        width: variant === 'circular' ? (height || '40px') : width,
        height: variant === 'circular' ? (height || '40px') : defaultHeight,
      }}
      {...props}
    />
  );
}