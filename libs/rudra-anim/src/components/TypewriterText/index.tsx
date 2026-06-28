import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export interface TypewriterTextProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  text?: string;
  speed?: number; // Speed per character in milliseconds (e.g., 40)
  delay?: number; // Initial delay before typing starts (milliseconds)
  showCursor?: boolean; /* @select|true|false */
  hideCursorOnComplete?: boolean; /* @select|true|false */
  loop?: boolean; /* @select|true|false */
  loopDelay?: number; // How long to wait before erasing and re-typing (ms)
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'; /* @select|h1|h2|h3|p|span */
}

export default function TypewriterText({
  text = "Premium design meets enterprise performance.",
  speed = 40,
  delay = 0,
  showCursor = true,
  hideCursorOnComplete = false,
  loop = false,
  loopDelay = 2000,
  as: Component = 'p',
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

  // Determine if the blinking cursor should be rendered right now
  const shouldShowCursor = showCursor && (!hideCursorOnComplete || phase !== 'completed');

  return (
    <Component className={`min-h-[1.5em] tracking-tight text-slate-900 ${className}`} {...props}>
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
          className="inline-block w-[0.12em] h-[1em] bg-current ml-1 align-middle translate-y-[-0.05em]"
        />
      )}
    </Component>
  );
}