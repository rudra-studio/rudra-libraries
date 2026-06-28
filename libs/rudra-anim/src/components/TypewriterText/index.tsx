import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export interface TypewriterTextProps extends React.HTMLAttributes<HTMLElement> {
  text?: string; /* @translate @textarea */
  speed?: number; // Speed per character in milliseconds (e.g., 40)
  delay?: number; // Initial delay before typing starts (milliseconds)
  showCursor?: boolean; /* @select|true|false */
  hideCursorOnComplete?: boolean; /* @select|true|false */
  loop?: boolean; /* @select|true|false */
  loopDelay?: number; // How long to wait before erasing and re-typing (ms)
  
  // Typography Props
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote' | 'label' | 'strong' | 'em';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify'; /* @select|left|center|right|justify */
  customColor?: string; /* @color */
  className?: string;
}

export default function TypewriterText({
  text = "Premium design meets enterprise performance.",
  speed = 40,
  delay = 0,
  showCursor = true,
  hideCursorOnComplete = false,
  loop = false,
  loopDelay = 2000,
  
  // Typography Defaults
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  align = 'left',
  customColor,
  className = '',
  ...props
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'idle' | 'typing' | 'completed' | 'erasing'>('idle');
  
  // Keep track of the current character index across renders safely
  const currentIndexRef = useRef(0);

  useEffect(() => {
    let timer: number;

    // Phase 1: Handle Initial Delay
    if (phase === 'idle') {
      timer = window.setTimeout(() => {
        setPhase('typing');
      }, delay);
    }

    // Phase 2: Typing Loop
    if (phase === 'typing') {
      timer = window.setInterval(() => {
        if (currentIndexRef.current < text.length) {
          currentIndexRef.current += 1;
          setDisplayText(text.substring(0, currentIndexRef.current));
        } else {
          clearInterval(timer);
          setPhase('completed');
        }
      }, speed);
    }

    // Phase 3: Completion & Optional Loop Reset
    if (phase === 'completed' && loop) {
      timer = window.setTimeout(() => {
        setPhase('erasing');
      }, loopDelay);
    }

    // Phase 4: Erasing/Backspace sequence (if loop is enabled)
    if (phase === 'erasing') {
      timer = window.setInterval(() => {
        if (currentIndexRef.current > 0) {
          currentIndexRef.current -= 1;
          setDisplayText(text.substring(0, currentIndexRef.current));
        } else {
          clearInterval(timer);
          setPhase('typing'); // Restart typing cycle
        }
      }, speed * 0.5); // Erasing happens twice as fast as typing for cleaner UX
    }

    return () => {
      clearTimeout(timer);
      clearInterval(timer);
    };
  }, [phase, text, speed, delay, loop, loopDelay]);

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

  const alignClasses: Record<string, string> = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
    'justify': 'text-justify',
  };

  // Blockquotes get special default styling
  const isQuote = Component === 'blockquote';
  
  // Cleanly compile the final class string
  const finalClassName = `
    min-h-[1.5em] tracking-tight
    ${sizeClasses[size] || ''} 
    ${weightClasses[weight] || ''} 
    ${alignClasses[align] || ''} 
    ${isQuote ? 'pl-4 border-l-4 border-zinc-300 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Determine if the blinking cursor should be rendered right now
  const shouldShowCursor = showCursor && (!hideCursorOnComplete || phase !== 'completed');

  return (
    <Component className={finalClassName} style={customColor ? { color: customColor } : undefined} {...props}>
      {/* 1. ACCESSIBILITY: Clean, continuous text layer for screen readers */}
      <span className="sr-only">{text}</span>

      {/* 2. VISUAL LAYER: Perfectly stable layout text rendering */}
      <span aria-hidden="true" className="inline-block whitespace-pre-wrap">
        {displayText}
      </span>

      {/* 3. TERMINAL CURSOR: Clean CSS hardware blink */}
      {shouldShowCursor && (
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            times: [0, 0.49, 0.5, 1], // Sharp digital cuts instead of muddy analog opacity fades
          }}
          // bg-current ensures the cursor automatically inherits the customColor applied to the parent Component
          className="inline-block w-[0.12em] h-[1em] bg-current ml-1 align-middle translate-y-[-0.05em]" 
        />
      )}
    </Component>
  );
}