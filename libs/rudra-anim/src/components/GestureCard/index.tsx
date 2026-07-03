import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';

export interface GestureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  dragDirection?: 'x' | 'y' | 'both'; /* @select|x|y|both */
  swipeThreshold?: number; // How many pixels of drag before it commits to dismissing (e.g., 100)
  rotateOnDrag?: boolean; /* @select|true|false */
  onDismiss?: () => void; // Callback fired when the card is successfully swiped away
  
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
   * "key": "Layout & Interaction",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "relative block touch-none select-none cursor-grab active:cursor-grabbing", "label": "Block (Draggable)"},
   * {"key": "relative flex items-center justify-center touch-none select-none cursor-grab active:cursor-grabbing", "label": "Flex Center (Draggable)"},
   * {"key": "relative inline-block touch-none select-none cursor-grab active:cursor-grabbing", "label": "Inline Block (Draggable)"}
   * ]
   * }]
   */
  className?: string;
}

export default function GestureCard({
  children,
  dragDirection = 'x',
  swipeThreshold = 120,
  rotateOnDrag = true,
  onDismiss,
  customAttributes = {},
  // Solid baseline default: Includes crucial touch-action and cursor states for hardware dragging
  className = 'relative block w-full touch-none select-none cursor-grab active:cursor-grabbing',
  ...props
}: GestureCardProps) {
  // We manage an internal presence state so the card can animate its own exit
  const [isPresent, setIsPresent] = useState(true);

  // 1. Hardware-accelerated Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 2. Value Transformers
  // Map the X pixel drag to a subtle rotation (e.g., dragging 200px right rotates it 15 degrees)
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  // Map the X pixel drag to opacity (fades out as it gets closer to the threshold)
  const opacity = useTransform(
    x,
    [-swipeThreshold, 0, swipeThreshold],
    [0.2, 1, 0.2]
  );

  // 3. Drag Logic
  const handleDragEnd = (event: any, info: any) => {
    // Determine if the drag exceeded our threshold on either axis
    const draggedX = Math.abs(info.offset.x);
    const draggedY = Math.abs(info.offset.y);
    const velocityX = Math.abs(info.velocity.x);

    // If they drag past the threshold OR flick it really fast
    if (
      (dragDirection === 'x' || dragDirection === 'both') && 
      (draggedX > swipeThreshold || velocityX > 500)
    ) {
      setIsPresent(false);
      if (onDismiss) setTimeout(onDismiss, 300); // Allow exit animation to play
      return;
    }

    if (
      (dragDirection === 'y' || dragDirection === 'both') && 
      (draggedY > swipeThreshold)
    ) {
      setIsPresent(false);
      if (onDismiss) setTimeout(onDismiss, 300);
      return;
    }
  };

  return (
    <AnimatePresence>
      {isPresent && (
        <motion.div
          // Enable hardware dragging
          drag={dragDirection === 'both' ? true : dragDirection}
          
          // Elastic bounds - snaps back to origin if released before threshold
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          
          // How much the card resists being pulled away from the origin
          dragElastic={0.7}
          
          // Tie our GPU motion values to the physical styles
          style={{ 
            x: dragDirection === 'x' || dragDirection === 'both' ? x : 0, 
            y: dragDirection === 'y' || dragDirection === 'both' ? y : 0, 
            rotate: rotateOnDrag && dragDirection !== 'y' ? rotate : 0, 
            opacity 
          }}
          
          // Handlers
          onDragEnd={handleDragEnd}
          
          // Entrance and Exit animations
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 0.5, 
            transition: { duration: 0.2 } 
          }}
          
          // Spring physics for when the card snaps back
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          
          className={className}
          {...customAttributes}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}