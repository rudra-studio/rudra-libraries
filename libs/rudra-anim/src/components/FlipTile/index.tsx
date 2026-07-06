import React, { useState } from 'react';
import { motion } from 'motion/react';


export interface FlipTileProps extends React.HTMLAttributes<HTMLDivElement> {
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  direction?: 'horizontal' | 'vertical'; /* @select|horizontal|vertical */

  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>;

  /** * @type|class
   * @schema [{
   * "key": "Height",
   * "prefix": "h",
   * "type": "select",
   * "options": [
   * {"key": "fit", "label": "Fit Content (Auto)"},
   * {"key": "auto", "label": "Auto Height"},
   * {"key": "64", "label": "Small (16rem)"},
   * {"key": "72", "label": "Medium-Small (18rem)"},
   * {"key": "80", "label": "Medium (20rem)"},
   * {"key": "96", "label": "Large (24rem)"},
   * {"key": "full", "label": "Full Height"}
   * ]
   * },{
   * "key": "Width",
   * "prefix": "w",
   * "type": "select",
   * "options": [
   * {"key": "full", "label": "Full Width"},
   * {"key": "fit", "label": "Fit Content"},
   * {"key": "64", "label": "Small (16rem)"},
   * {"key": "80", "label": "Medium (20rem)"},
   * {"key": "96", "label": "Large (24rem)"}
   * ]
   * }]
   */
  className?: string;

  /** * @type|class
   * @schema [{
   * "key": "Background",
   * "prefix": "bg",
   * "type": "select",
   * "options": [
   * {"key": "white", "label": "White"},
   * {"key": "slate-50", "label": "Slate 50"},
   * {"key": "slate-100", "label": "Slate 100"},
   * {"key": "slate-800", "label": "Slate 800"},
   * {"key": "slate-900", "label": "Slate 900"}
   * ]
   * },{
   * "key": "Text Color",
   * "prefix": "text",
   * "type": "select",
   * "options": [
   * {"key": "slate-900", "label": "Dark Slate"},
   * {"key": "white", "label": "White"}
   * ]
   * }]
   */
  backContentClassName?: string;
}

export default function FlipTile({
  frontContent = (
    <div className="flex flex-col h-full p-6 bg-white">
      <h3 className="text-2xl font-bold text-slate-900">Enterprise Plan</h3>
      <p className="text-slate-500 mt-2">Everything you need to scale.</p>
    </div>
  ),
  backContent = (
    <div className="flex flex-col h-full p-6">
      <h3 className="text-xl font-bold mb-4">Included Features:</h3>
      <ul className="space-y-2 text-sm opacity-80">
        <li>✓ Unlimited Users</li>
        <li>✓ 24/7 Dedicated Support</li>
        <li>✓ Custom SLA</li>
        <li>✓ Advanced Analytics</li>
      </ul>
    </div>
  ),
  direction = 'horizontal',
  customAttributes = {},
  className = 'relative w-full h-fit',
  backContentClassName = 'bg-white text-slate-900',
  ...props
}: FlipTileProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Determine the rotation axis based on the direction prop
  const rotateAxis = direction === 'horizontal' ? 'rotateY' : 'rotateX';

  // Toggle function
  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent clicks if nested
    // Only allow flip if backContent exists
    if (backContent) {
      setIsFlipped(!isFlipped);
    }
  };

  const currentFlipState = isFlipped && !!backContent;

  return (
    <div
      className={className}
      style={{ perspective: '1000px' }}
      {...customAttributes}
      {...props}
    >
      <motion.div
        // 🚨 THE FIX: Container is now a Grid. 
        className="w-full h-full grid relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          [rotateAxis]: currentFlipState ? 180 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 25,
          mass: 1.2,
        }}
      >
        {/* --- FRONT FACE --- */}
        <div
          // 🚨 THE FIX: [grid-area:1/1] layers elements without absolute positioning.
          // Because it is in the document flow, it actively controls the height of the component!
          className="[grid-area:1/1] relative w-full h-full flex flex-col rounded-2xl shadow-md border border-slate-200 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Inner scrolling container allows text to scroll while keeping the button pinned */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] ${backContent ? 'pb-16' : ''}`}>
            {frontContent}
          </div>

          {/* Conditionally render Front Action Button (Plus) */}
          {backContent && (
            <button
              onClick={handleFlip}
              className="absolute bottom-4 right-4 w-10 h-10 bg-slate-100/80 hover:bg-slate-200 backdrop-blur-md text-slate-900 rounded-full flex items-center justify-center transition-colors shadow-sm z-10"
              aria-label="Reveal details"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          )}
        </div>

        {/* --- CONDITIONAL BACK FACE --- */}
        {backContent && (
          <div
            // 🚨 THE FIX: Also [grid-area:1/1]. If the back text is extremely long, 
            // the entire card will expand its height to fit the back text!
            className={`[grid-area:1/1] relative w-full h-full flex flex-col rounded-2xl shadow-xl overflow-hidden border border-slate-200 ${backContentClassName}`.trim()}
            style={{
              backfaceVisibility: 'hidden',
              transform: `${rotateAxis}(180deg)`,
            }}
          >
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-16 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin]">
              {backContent}
            </div>

            {/* Back Action Button (Close / X) */}
            <button
              onClick={handleFlip}
              className="absolute bottom-4 right-4 w-10 h-10 bg-slate-100/80 hover:bg-slate-200 backdrop-blur-md text-slate-900 rounded-full flex items-center justify-center transition-colors shadow-sm z-10"
              aria-label="Close details"
            >
              <motion.svg
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </motion.svg>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}