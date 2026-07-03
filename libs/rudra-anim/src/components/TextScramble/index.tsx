import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

export interface TextScrambleProps extends React.HTMLAttributes<HTMLElement> {
  text?: string; /* @translate @textarea */
  scrambleSpeed?: number; // Milliseconds between each character scramble update (e.g., 40)
  revealDelay?: number; // Delay before it starts locking in the real text (e.g., 300)
  trigger?: 'onMount' | 'onView' | 'onHover'; /* @select|onMount|onView|onHover */
  characterSet?: string; 
  
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

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function TextScramble({
  text = "Initialize Sequence",
  scrambleSpeed = 40,
  revealDelay = 300,
  trigger = 'onView',
  characterSet = DEFAULT_CHARS,
  as: Component = 'span',
  customColor,
  customAttributes = {},
  // Includes inline-block and tabular-nums to prevent layout shifts + standard baseline styling
  className = 'inline-block tabular-nums tracking-tight text-base font-normal text-left text-zinc-900 dark:text-zinc-100',
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

  return (
    <Component
      ref={containerRef as any}
      onMouseEnter={trigger === 'onHover' && !isScrambling ? scramble : undefined}
      className={className}
      style={customColor ? { color: customColor } : undefined}
      {...customAttributes}
      {...props}
    >
      {/* Accessibility layer: Screen readers read this perfect text */}
      <span className="sr-only">{text}</span>
      
      {/* Visual layer: Sighted users see this scrambled text. aria-hidden hides it from screen readers */}
      <span aria-hidden="true">{displayText}</span>
    </Component>
  );
}