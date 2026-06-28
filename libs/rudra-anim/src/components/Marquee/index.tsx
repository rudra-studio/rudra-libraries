import React from 'react';
import { motion } from 'motion/react';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Scrolling direction */
  direction?: 'left' | 'right';
  /** Time in seconds to complete one full horizontal scroll animation loop */
  speed?: number; 
  /** Pause the scrolling animation when mouse enters the track */
  pauseOnHover?: boolean;
  /** Gap space between the scrolling items */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Typography Props (Applied directly if children contains text strings)
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  customColor?: string; /* @color */
  className?: string;
}

export default function Marquee({
  children,
  direction = 'right',
  speed = 20,
  pauseOnHover = true,
  gap = 'md',
  
  // Typography Defaults
  size = 'base',
  weight = 'normal',
  customColor,
  className = '',
  ...props
}: MarqueeProps) {

  // --- CONFIGURING GAP LAYOUT ---
  const gapClasses: Record<string, string> = {
    'none': 'gap-0',
    'sm': 'gap-4',
    'md': 'gap-8',
    'lg': 'gap-12',
    'xl': 'gap-16',
    '2xl': 'gap-24',
  };

  // --- TYPOGRAPHY STYLING ---
  const sizeClasses: Record<string, string> = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl leading-relaxed',
    '3xl': 'text-3xl leading-snug',
    '4xl': 'text-4xl leading-tight',
    '5xl': 'text-5xl leading-tight',
    '6xl': 'text-6xl leading-none',
    '7xl': 'text-7xl leading-none',
    '8xl': 'text-8xl leading-none',
    '9xl': 'text-9xl leading-none',
  };

  const weightClasses: Record<string, string> = {
    'thin': 'font-thin',
    'extralight': 'font-extralight',
    'light': 'font-light',
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold',
    'extrabold': 'font-extrabold',
    'black': 'font-black',
  };

  // --- INFINITE LOOP DIRECTIONS ---
  // To look seamless, the track duplicates content. 
  // Right scroll animates from negative half position (-50%) to starting position (0)
  // Left scroll animates from starting position (0) to negative half position (-50%)
  const initialX = direction === 'right' ? '-50%' : '0%';
  const animateX = direction === 'right' ? '0%' : '-50%';

  const finalClassName = `
    group/marquee flex overflow-hidden select-none w-full
    ${sizeClasses[size] || ''} 
    ${weightClasses[weight] || ''} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div 
      className={finalClassName} 
      style={customColor ? { color: customColor } : undefined}
      {...props}
    >
      <motion.div
        animate={{ x: [initialX, animateX] }}
        transition={{
          ease: 'linear',
          duration: speed,
          repeat: Infinity,
        }}
        // Pure CSS deceleration state triggered natively by Tailwind group selectors
        className={`flex min-w-full shrink-0 items-center justify-around ${gapClasses[gap]} ${
          pauseOnHover ? 'group-hover/marquee:[animation-play-state:paused]' : ''
        }`}
      >
        {/* Render Primary List */}
        <div className={`flex shrink-0 items-center justify-around ${gapClasses[gap]}`}>
          {children}
        </div>
        
        {/* Render Duplicate List (Cloned for a pixel-perfect, gapless wrapping effect) */}
        <div aria-hidden="true" className={`flex shrink-0 items-center justify-around ${gapClasses[gap]}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}