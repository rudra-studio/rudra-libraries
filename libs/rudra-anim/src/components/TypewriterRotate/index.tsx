import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export interface TypewriterRotateProps extends React.HTMLAttributes<HTMLSpanElement> {
  phrases?: string[]; /* @array */
  typingSpeed?: number; // ms per char (e.g., 100)
  deletingSpeed?: number; // ms per char (e.g., 50)
  pauseDuration?: number; // ms to pause on a completed word (e.g., 2000)
  cursorColor?: string; // Tailwind class like 'bg-blue-500'
}

export default function TypewriterRotate({
  phrases = ['Engineers', 'Designers', 'Founders'],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  cursorColor = 'bg-current',
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

  return (
    <span className={`inline-flex items-center ${className}`} {...props}>
      {/* 1. Accessibility Hidden Label */}
      <span className="sr-only">
        {/* Tells screen readers the full list of dynamic words */}
        {phrases.join(', ')}
      </span>

      {/* 2. Visual Output */}
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
        className={`inline-block w-[0.1em] h-[1.1em] ml-1 align-middle translate-y-[-0.05em] ${cursorColor}`}
      />
    </span>
  );
}