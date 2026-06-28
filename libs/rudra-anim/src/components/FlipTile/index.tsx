import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface FlipTileProps extends React.HTMLAttributes<HTMLDivElement> {
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  direction?: 'horizontal' | 'vertical'; /* @select|horizontal|vertical */
  cardHeight?: string; // e.g., 'h-72', 'h-96'
}

export default function FlipTile({
  frontContent = (
    <div className="flex flex-col h-full p-6">
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
  cardHeight = 'h-80',
  className = '',
  ...props
}: FlipTileProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Determine the rotation axis based on the direction prop
  const rotateAxis = direction === 'horizontal' ? 'rotateY' : 'rotateX';

  // Toggle function
  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent clicks if nested
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      // 1. The Perspective Container: Gives the 3D rotation actual depth
      className={`relative w-full ${cardHeight} ${className}`}
      style={{ perspective: '1000px' }}
      {...props}
    >
      <motion.div
        // 2. The 3D Engine: Preserves 3D children during rotation
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          [rotateAxis]: isFlipped ? 180 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 25,
          mass: 1.2, // Slightly heavy mass makes the flip feel premium
        }}
      >
        {/* --- FRONT FACE --- */}
        <div
          className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontContent}

          {/* Front Action Button (Plus) */}
          <button
            onClick={handleFlip}
            className="absolute bottom-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full flex items-center justify-center transition-colors shadow-sm"
            aria-label="Reveal details"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* --- BACK FACE --- */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl shadow-xl overflow-hidden"
          // Rotate it 180 degrees by default so it faces away from the camera, and hide the backface
          style={{
            backfaceVisibility: 'hidden',
            transform: `${rotateAxis}(180deg)`,
          }}
        >
          {backContent}

          {/* Back Action Button (Close / X) */}
          <button
            onClick={handleFlip}
            // Using motion to rotate the icon in as the card flips
            className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
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
      </motion.div>
    </div>
  );
}