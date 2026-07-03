import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export interface TypewriterRotateProps extends React.HTMLAttributes<HTMLElement> {
  phrases?: string[]; /* @array */
  typingSpeed?: number; // ms per char (e.g., 100)
  deletingSpeed?: number; // ms per char (e.g., 50)
  pauseDuration?: number; // ms to pause on a completed word (e.g., 2000)
  cursorColor?: string; // Tailwind class like 'bg-blue-500' or 'bg-current'
  
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote' | 'label' | 'strong' | 'em';
  customColor?: string; /* @color */
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>;

  /** * @type|class
   * @schema [{
   * "key": "Size",
   * "prefix": "text",
   * "type": "select",
   * "options": [
   * {"key": "xs", "label": "Extra Small"},
   * {"key": "sm", "label": "Small"},
   * {"key": "base", "label": "Base"},
   * {"key": "lg", "label": "Large"},
   * {"key": "xl", "label": "Extra Large"},
   * {"key": "2xl", "label": "2XL"},
   * {"key": "3xl", "label": "3XL"},
   * {"key": "4xl", "label": "4XL"},
   * {"key": "5xl", "label": "5XL"},
   * {"key": "6xl", "label": "6XL"},
   * {"key": "7xl", "label": "7XL"},
   * {"key": "8xl", "label": "8XL"},
   * {"key": "9xl", "label": "9XL"}
   * ]
   * },{
   * "key": "Weight",
   * "prefix": "font",
   * "type": "select",
   * "options": [
   * {"key": "thin", "label": "Thin"},
   * {"key": "extralight", "label": "Extra Light"},
   * {"key": "light", "label": "Light"},
   * {"key": "normal", "label": "Normal"},
   * {"key": "medium", "label": "Medium"},
   * {"key": "semibold", "label": "Semi Bold"},
   * {"key": "bold", "label": "Bold"},
   * {"key": "extrabold", "label": "Extra Bold"},
   * {"key": "black", "label": "Black"}
   * ]
   * },{
   * "key": "Align",
   * "prefix": "text",
   * "type": "select",
   * "options": [
   * {"key": "left", "label": "Left"},
   * {"key": "center", "label": "Center"},
   * {"key": "right", "label": "Right"},
   * {"key": "justify", "label": "Justify"}
   * ]
   * }]
   */
  className?: string;
}

export default function TypewriterRotate({
  phrases = ['Engineers', 'Designers', 'Founders'],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  cursorColor = 'bg-current',
  as: Component = 'span',
  customColor,
  customAttributes = {},
  // Includes inline-flex and tracking-tight to keep the cursor perfectly aligned
  className = 'inline-flex items-center tracking-tight text-base font-normal text-left text-zinc-900 dark:text-zinc-100',
  ...props
}: TypewriterRotateProps) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeedDelta, setTypingSpeedDelta] = useState(typingSpeed);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

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
    <Component 
      className={className} 
      style={customColor ? { color: customColor } : undefined} 
      {...customAttributes}
      {...props}
    >
      {/* 1. Accessibility Hidden Label */}
      <span className="sr-only">
        {/* Tells screen readers the full list of dynamic words */}
        {phrases?.join(', ')}
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