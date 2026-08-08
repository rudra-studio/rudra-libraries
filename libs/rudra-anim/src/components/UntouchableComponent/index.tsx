"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

export default function UntouchableComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  // We start with null so we don't render it in the wrong spot on the server
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  // Center the component on mount
  useEffect(() => {
    if (containerRef.current && elementRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const element = elementRef.current.getBoundingClientRect();

      setPosition({
        x: container.width / 2 - element.width / 2,
        y: container.height / 2 - element.height / 2,
      });
    }
  }, []);

  const jumpAway = () => {
    if (!containerRef.current || !elementRef.current || !position) return;

    const container = containerRef.current.getBoundingClientRect();
    const element = elementRef.current.getBoundingClientRect();

    // Calculate the maximum X and Y so it doesn't jump off-screen
    const maxX = container.width - element.width;
    const maxY = container.height - element.height;

    // Generate random coordinates within the safe bounds
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;

    // Ensure the new position is decently far away from its current position
    // If it tries to jump too close to where it currently is, push it further
    if (Math.abs(newX - position.x) < 150) {
      newX = (newX + 200) % maxX;
    }
    if (Math.abs(newY - position.y) < 150) {
      newY = (newY + 200) % maxY;
    }

    setPosition({ x: newX, y: newY });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[80svh] bg-neutral-950 overflow-hidden flex items-center justify-center font-sans"
    >
      <div className="absolute top-10 left-10 text-neutral-500 text-xl font-medium tracking-tight pointer-events-none">
        Try to click the button.
      </div>

      {/* Only render the motion div once we have the initial center coordinates */}
      {position && (
        <motion.div
          ref={elementRef}
          // The absolute positioning starts at top-left, and Framer Motion handles the exact placement via translate3d (x/y)
          className="absolute top-0 left-0"
          initial={false} // Prevents animation on initial mount so it just appears in the center
          animate={{ x: position.x, y: position.y }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
          }}
        >
          {/* 
                                                                                                                                                                                                                                                                                                                                                                      INVISIBLE FORCEFIELD (The Trigger Area)
                                                                                                                                                                                                                                                                                                                                                                                  This padding creates a 40px invisible barrier around the visual button.
                                                                                                                                                                                                                                                                                                                                                                                              When the mouse crosses this padding boundary, it triggers the jump.
                                                                                                                                                                                                                                                                                                                                                                                                        */}
          <div
            className="p-10 cursor-pointer"
            onPointerEnter={jumpAway}
            // Add onTouchStart so mobile users also get trolled when they tap near it
            onTouchStart={jumpAway}
          >
            {/* THE VISUAL BUTTON */}
            <div className="px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-colors flex items-center justify-center gap-2">
              <span className="text-xl">🚨</span>
              DO NOT PRESS
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
