import React from 'react';
import { motion, Variants } from 'motion/react';

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'; /* @select|up|down|left|right|none */
  delay?: number; // E.g., 0.2
  duration?: number; // E.g., 0.5
  once?: boolean; // If true, it only animates the first time you scroll to it
  distance?: number; // How far it slides from
  cascade?: boolean; // If true and siblings exist, stagger them sequentially /* @select|true|false */
  staggerDelay?: number; // Time between each sibling animating (e.g., 0.15)
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>;

  /** * @type|class
   * @schema [{
   * "key": "Width",
   * "prefix": "w",
   * "type": "select",
   * "options": [
   * {"key": "full", "label": "Full Width"},
   * {"key": "fit", "label": "Fit Content"},
   * {"key": "auto", "label": "Auto"}
   * ]
   * },{
   * "key": "Layout Display",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "block", "label": "Block"},
   * {"key": "flex flex-col gap-4", "label": "Flex Column"},
   * {"key": "flex flex-row gap-4 flex-wrap", "label": "Flex Row"},
   * {"key": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", "label": "Responsive Grid"}
   * ]
   * }]
   */
  className?: string;
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  once = true,
  distance = 50,
  cascade = true,
  staggerDelay = 0.15,
  customAttributes = {},
  // Default to full width block layout
  className = 'w-full block',
  ...props
}: RevealProps) {
  
  // Calculate initial position based on the selected direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      case 'none': return { x: 0, y: 0 };
      default: return { y: distance, x: 0 };
    }
  };

  // Check if children actually consist of multiple sibling elements
  const childArray = React.Children.toArray(children);
  const isMultiChild = childArray.length > 1;

  // SCENARIO 1: Multiple Sibling Children & Cascade is Enabled
  if (isMultiChild && cascade) {
    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    };

    const itemVariants: Variants = {
      hidden: { 
        opacity: 0, 
        ...getInitialPosition() 
      },
      visible: { 
        opacity: 1, 
        x: 0, 
        y: 0,
        transition: {
          duration,
          ease: [0.25, 0.1, 0.25, 1], // Premium buttery curve
        }
      },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
        className={className}
        {...customAttributes}
        {...props}
      >
        {childArray.map((child, index) => (
          // We intentionally avoid giving the inner cascade wrapper styling so it inherits cleanly
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // SCENARIO 2: Default Behavior (Single child or Cascade disabled)
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className={className}
      {...customAttributes}
      {...props}
    >
      {children}
    </motion.div>
  );
}