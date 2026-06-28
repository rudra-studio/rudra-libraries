import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';

export interface TextScrambleProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string; // The target string to decode
  scrambleSpeed?: number; // Milliseconds between each character scramble update (e.g., 30)
  revealDelay?: number; // Delay before it starts locking in the real text (e.g., 500)
  trigger?: 'onMount' | 'onView' | 'onHover'; /* @select|onMount|onView|onHover */
  characterSet?: string; 
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function TextScramble({
  children,
  scrambleSpeed = 40,
  revealDelay = 300,
  trigger = 'onView',
  characterSet = DEFAULT_CHARS,
  className = '',
  ...props
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const iterationRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  // The core scrambling engine
  const scramble = () => {
    let iteration = 0;
    setIsScrambling(true);

    // Clear any existing intervals
    if (frameRef.current) clearInterval(frameRef.current);

    frameRef.current = window.setInterval(() => {
      setDisplayText((current) => {
        const newText = children
          .split('')
          .map((letter, index) => {
            // 1. If it's a space, keep it a space to preserve word wrapping
            if (letter === ' ') return ' ';
            
            // 2. If the iteration has passed this letter's index, lock in the real letter
            if (index < iteration) return children[index];
            
            // 3. Otherwise, return a random character from our set
            return characterSet[Math.floor(Math.random() * characterSet.length)];
          })
          .join('');

        return newText;
      });

      // Slowly increment the iteration to lock in letters one by one
      // The fractional addition controls how "fast" the word solves itself
      iteration += 1 / (children.length / 3); 

      // End condition
      if (iteration >= children.length) {
        clearInterval(frameRef.current!);
        setIsScrambling(false);
        setDisplayText(children); // Ensure final string is perfect
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

  return (
    <motion.span
      ref={containerRef}
      onMouseEnter={trigger === 'onHover' && !isScrambling ? scramble : undefined}
      className={`inline-block tabular-nums ${className}`}
      {...props}
    >
      {displayText}
    </motion.span>
  );
}