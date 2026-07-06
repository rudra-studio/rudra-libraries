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
}

export default function FlipTile({
  frontContent = (
    <div className="flex flex-col h-full p-6 bg-white">
      <h3 className="text-2xl font-bold text-slate-900">Enterprise Plan</h3>
      <p className="text-slate-500 mt-2">Everything you need to scale.</p>
    </div>
  ),
  backContent = (
    <div className="flex flex-col h-full p-6 bg-slate-900 text-white">
      <h3 className="text-xl font-bold mb-4">Included Features:</h3>
      <ul className="space-y-2 text-sm text-slate-300">
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

  // Safety lock: if backContent is removed while flipped, force it closed
  const currentFlipState = isFlipped && !!backContent;

  return (
    <div
      className={className}
      style={{ perspective: '1000px' }}
      {...customAttributes}
      {...props}
    >
      <motion.div
        className="w-full h-full relative"
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
          className="relative w-full h-full rounded-2xl shadow-md border border-slate-200 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontContent}

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
            className="absolute inset-0 w-full h-full rounded-2xl shadow-xl overflow-hidden bg-slate-900"
            style={{
              backfaceVisibility: 'hidden',
              transform: `${rotateAxis}(180deg)`,
            }}
          >
            {/* 🚨 THE FIX: Added sleek inline Tailwind scrollbar styles. 
                Using arbitrary variants to style Webkit scrollbars and 'scrollbar-width:thin' for Firefox */}
            <div className="w-full h-full overflow-y-auto pb-16 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500/50 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin]">
              {backContent}
            </div>

            {/* Back Action Button (Close / X) */}
            <button
              onClick={handleFlip}
              className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md z-10 shadow-sm"
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