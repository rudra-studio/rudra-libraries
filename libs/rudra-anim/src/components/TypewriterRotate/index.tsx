import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export interface TypewriterRotateProps extends React.HTMLAttributes<HTMLElement> {
  phrases?: string[]; /* @array */
  typingSpeed?: number; // ms per char (e.g., 100)
  deletingSpeed?: number; // ms per char (e.g., 50)
  pauseDuration?: number; // ms to pause on a completed word (e.g., 2000)
  cursorColor?: string; // Tailwind class like 'bg-blue-500' or 'bg-current'
  
  // Typography Props
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote' | 'label' | 'strong' | 'em';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify'; /* @select|left|center|right|justify */
  customColor?: string; /* @color */
  className?: string;
}

export default function TypewriterRotate({
  phrases = ['Engineers', 'Designers', 'Founders'],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  cursorColor = 'bg-current',
  
  // Typography Defaults
  as: Component = 'span',
  size = 'base',
  weight = 'normal',
  align = 'left',
  customColor,
  className = '',
  ...props
}: TypewriterRotateProps) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeedDelta, setTypingSpeedDelta] = useState(typingSpeed);

  useEffect(() => {
    // Determine the current full word based on the loop iteration
    const i = loopNum % phrases.length;
    const fullText = phrases[i];

    const handleType = () => {
      setText((current) => 
        isDeleting 
          ? fullText.substring(0, current.length - 1) 
          : fullText.substring(0, current.length + 1)
      );

      // Randomize typing speed slightly for a human feel
      setTypingSpeedDelta(isDeleting ? deletingSpeed : typingSpeed - Math.random() * 30);

      // Transition to Deleting phase
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } 
      // Transition to Typing phase for the next word
      else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeedDelta);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed, deletingSpeed, pauseDuration, typingSpeedDelta]);

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

  // Cleanly compile the final class string
  // Note: inline-flex is kept so the cursor always aligns perfectly next to the text
  const finalClassName = `
    inline-flex items-center tracking-tight
    ${sizeClasses[size] || ''} 
    ${weightClasses[weight] || ''} 
    ${alignClasses[align] || ''} 
    ${isQuote ? 'pl-4 border-l-4 border-zinc-300 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component 
      className={finalClassName} 
      style={customColor ? { color: customColor } : undefined} 
      {...props}
    >
      {/* 1. Accessibility Hidden Label */}
      <span className="sr-only">
        {/* Tells screen readers the full list of dynamic words */}
        {phrases.join(', ')}
      </span>

      {/* 2. Visual Output */}
      {/* min-h ensures the container doesn't collapse to 0 height when the word is fully deleted */}
      <span aria-hidden="true" className="min-h-[1.2em]">
        {text}
      </span>

      {/* 3. The Animated Cursor */}
      <motion.span
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          times: [0, 0.49, 0.5, 1], // Crisp on/off blinking
        }}
        // bg-current automatically matches the customColor, or uses the specific Tailwind cursorColor prop
        className={`inline-block w-[0.1em] h-[1.1em] ml-1 align-middle translate-y-[-0.05em] ${cursorColor}`}
      />
    </Component>
  );
}