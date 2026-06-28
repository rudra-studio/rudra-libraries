import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

export interface TextScrambleProps extends React.HTMLAttributes<HTMLElement> {
  text: string; // The target string to decode
  scrambleSpeed?: number; // Milliseconds between each character scramble update (e.g., 40)
  revealDelay?: number; // Delay before it starts locking in the real text (e.g., 300)
  trigger?: 'onMount' | 'onView' | 'onHover'; /* @select|onMount|onView|onHover */
  characterSet?: string; 
  
  // Typography Props
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote' | 'label' | 'strong' | 'em';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify'; /* @select|left|center|right|justify */
  customColor?: string; /* @color */
  className?: string;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function TextScramble({
  text = "",
  scrambleSpeed = 40,
  revealDelay = 300,
  trigger = 'onView',
  characterSet = DEFAULT_CHARS,
  
  // Typography Defaults
  as: Component = 'span',
  size = 'base',
  weight = 'normal',
  align = 'left',
  customColor,
  className = '',
  ...props
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const frameRef = useRef<number | null>(null);

  // The core scrambling engine
  const scramble = () => {
    let iteration = 0;
    setIsScrambling(true);

    // Clear any existing intervals
    if (frameRef.current) clearInterval(frameRef.current);

    frameRef.current = window.setInterval(() => {
      setDisplayText((current) => {
        const newText = text
          .split('')
          .map((letter, index) => {
            // 1. If it's a space, keep it a space to preserve word wrapping
            if (letter === ' ') return ' ';
            
            // 2. If the iteration has passed this letter's index, lock in the real letter
            if (index < iteration) return text[index];
            
            // 3. Otherwise, return a random character from our set
            return characterSet[Math.floor(Math.random() * characterSet.length)];
          })
          .join('');

        return newText;
      });

      // Slowly increment the iteration to lock in letters one by one
      iteration += 1 / (text.length / 3); 

      // End condition
      if (iteration >= text.length) {
        clearInterval(frameRef.current!);
        setIsScrambling(false);
        setDisplayText(text); // Ensure final string is perfect
      }
    }, scrambleSpeed);
  };

  // Handle Triggers
  useEffect(() => {
    if (trigger === 'onMount') {
      setTimeout(scramble, revealDelay);
    }
  }, [trigger, revealDelay]);

  useEffect(() => {
    if (trigger === 'onView' && isInView) {
      setTimeout(scramble, revealDelay);
    }
  }, [trigger, isInView, revealDelay]);

  // Cleanup to prevent memory leaks if component unmounts mid-scramble
  useEffect(() => {
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, []);

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

  const isQuote = Component === 'blockquote';

  const finalClassName = `
    inline-block tabular-nums tracking-tight
    ${sizeClasses[size] || ''} 
    ${weightClasses[weight] || ''} 
    ${alignClasses[align] || ''} 
    ${isQuote ? 'pl-4 border-l-4 border-zinc-300 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component
      ref={containerRef as any}
      onMouseEnter={trigger === 'onHover' && !isScrambling ? scramble : undefined}
      className={finalClassName}
      style={customColor ? { color: customColor } : undefined}
      {...props}
    >
      {/* Accessibility layer: Screen readers read this perfect text */}
      <span className="sr-only">{text}</span>
      
      {/* Visual layer: Sighted users see this scrambled text. aria-hidden hides it from screen readers */}
      <span aria-hidden="true">{displayText}</span>
    </Component>
  );
}