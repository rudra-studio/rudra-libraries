import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface SwapTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  activeKey?: string; // The trigger that tells Framer Motion to swap!
  animation?: 'fade' | 'slide-up' | 'scale' | 'flip'; /* @select|fade|slide-up|scale|flip */
  duration?: number;
  
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
   * "key": "Layout",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "relative block", "label": "Block"},
   * {"key": "relative flex items-center justify-center", "label": "Flex Center"}
   * ]
   * }]
   */
  className?: string;
}

export default function SwapTransition({
  children,
  activeKey = 'default',
  animation = 'fade',
  duration = 0.3,
  customAttributes = {},
  // Solid baseline default: handles stacking contexts and takes up available width
  className = 'relative w-full block',
  ...props
}: SwapTransitionProps) {

  // Define the entry/exit states based on user selection
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    'slide-up': {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 }
    },
    flip: {
      initial: { opacity: 0, rotateX: 90 },
      animate: { opacity: 1, rotateX: 0 },
      exit: { opacity: 0, rotateX: -90 }
    }
  };

  const selectedVariant = variants[animation];

  return (
    <div 
      className={className} 
      {...customAttributes} 
      {...props}
    >
      {/* mode="wait" ensures the old element finishes leaving BEFORE the new one enters */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey} // CRITICAL: This key tells Framer Motion when to trigger the swap
          initial="initial"
          animate="animate"
          exit="exit"
          variants={selectedVariant}
          transition={{ duration, ease: "easeInOut" }}
          // Inner container must stretch to fill whatever the user defines on the outer container
          className="w-full h-full"
        >
          {children || (
            <div className="w-full h-32 border-2 border-dashed border-teal-300 bg-teal-50/50 rounded flex flex-col items-center justify-center text-teal-600 text-xs font-semibold">
              <span>Swap Zone</span>
              <span className="text-[10px] font-normal opacity-70 mt-1">Bind 'activeKey' to animate changes</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}