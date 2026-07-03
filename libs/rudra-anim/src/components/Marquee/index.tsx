import React from 'react';
import { motion } from 'motion/react';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Scrolling direction */
  direction?: 'left' | 'right'; /* @select|left|right */
  /** Time in seconds to complete one full horizontal scroll animation loop */
  speed?: number;
  /** Pause the scrolling animation when mouse enters the track */
  pauseOnHover?: boolean; /* @select|true|false */
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
   * "key": "Typography Size",
   * "prefix": "text",
   * "type": "select",
   * "options": [
   * {"key": "sm", "label": "Small"},
   * {"key": "base", "label": "Base"},
   * {"key": "lg", "label": "Large"},
   * {"key": "2xl", "label": "2XL"},
   * {"key": "4xl", "label": "4XL"},
   * {"key": "6xl", "label": "6XL"}
   * ]
   * },{
   * "key": "Typography Weight",
   * "prefix": "font",
   * "type": "select",
   * "options": [
   * {"key": "light", "label": "Light"},
   * {"key": "normal", "label": "Normal"},
   * {"key": "medium", "label": "Medium"},
   * {"key": "bold", "label": "Bold"},
   * {"key": "black", "label": "Black"}
   * ]
   * }]
   */
  className?: string;

  /** * @type|class
   * @schema [{
   * "key": "Item Gap",
   * "prefix": "gap",
   * "type": "select",
   * "options": [
   * {"key": "0", "label": "None"},
   * {"key": "4", "label": "Small (1rem)"},
   * {"key": "8", "label": "Medium (2rem)"},
   * {"key": "12", "label": "Large (3rem)"},
   * {"key": "16", "label": "Extra Large (4rem)"},
   * {"key": "24", "label": "2XL (6rem)"}
   * ]
   * }]
   */
  trackClassName?: string;
}

export default function Marquee({
  children,
  direction = 'right',
  speed = 20,
  pauseOnHover = true,
  customColor,
  customAttributes = {},
  // Solid Baseline Default for the root mask container
  className = 'group/marquee flex overflow-hidden select-none w-full text-base font-normal text-zinc-900 dark:text-zinc-100',
  // Solid Baseline Default for the animated track and duplicated chunks
  trackClassName = 'flex shrink-0 items-center justify-around gap-8',
  ...props
}: MarqueeProps) {

  // --- INFINITE LOOP DIRECTIONS ---
  // To look seamless, the track duplicates content. 
  // Right scroll animates from negative half position (-50%) to starting position (0)
  // Left scroll animates from starting position (0) to negative half position (-50%)
  const initialX = direction === 'right' ? '-50%' : '0%';
  const animateX = direction === 'right' ? '0%' : '-50%';

  return (
    <div
      className={className}
      style={customColor ? { color: customColor } : undefined}
      {...customAttributes}
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
        className={`min-w-full ${pauseOnHover ? 'group-hover/marquee:[animation-play-state:paused]' : ''} ${trackClassName}`.trim().replace(/\s+/g, ' ')}
      >
        {/* Render Primary List */}
        <div className={trackClassName}>
          {children}
        </div>

        {/* Render Duplicate List (Cloned for a pixel-perfect, gapless wrapping effect) */}
        <div aria-hidden="true" className={trackClassName}>
          {children}
        </div>
      </motion.div>
    </div>
  ); 
}