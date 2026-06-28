import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';

export interface StickyScrollItem {
  id: string;
  title: string;
  description: string | React.ReactNode;
  visual: React.ReactNode; // The image, video, or component to show on the right
}

export interface StickyScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: StickyScrollItem[];
  contentAlignment?: 'left' | 'right'; /* @select|left|right */
  overlayFade?: boolean; /* @select|true|false */
}

export default function StickyScroll({
  items = [
    {
      id: '1',
      title: 'Real-time Analytics',
      description: 'Monitor your traffic as it happens. Our low-latency edge network ensures you see every click, bounce, and conversion in real-time.',
      visual: <div className="w-full h-full bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">Analytics Dashboard</div>
    },
    {
      id: '2',
      title: 'Instant Deployments',
      description: 'Push to main and watch your code go live globally in under 3 seconds. Zero downtime, zero configuration required.',
      visual: <div className="w-full h-full bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">Deployment Logs</div>
    },
    {
      id: '3',
      title: 'Global Edge Network',
      description: 'Route your users to the nearest data center automatically. Cut latency by up to 80% with our distributed infrastructure.',
      visual: <div className="w-full h-full bg-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">Server Map</div>
    }
  ],
  contentAlignment = 'left',
  overlayFade = true,
  className = '',
  ...props
}: StickyScrollProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Hardware-Accelerated Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start center" means the tracking begins when the top of the container hits the center of the viewport
    offset: ["start center", "end center"] 
  });

  // 2. Derive Active Index from Scroll Progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Divide the scroll progress into equal chunks based on the number of items
    const chunk = 1 / items.length;
    // Calculate which chunk we are currently in
    const currentIndex = Math.min(
      Math.max(Math.floor(latest / chunk), 0),
      items.length - 1
    );

    // Only update React state if the index actually changes
    if (currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  });

  const isLeftAlign = contentAlignment === 'left';

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex items-start gap-10 md:gap-20 ${className}`}
      {...props}
    >
      {/* TEXT COLUMN (Scrolls normally) */}
      <div className={`w-full md:w-1/2 py-[30vh] ${isLeftAlign ? 'order-1' : 'order-2'}`}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          
          return (
            <motion.div 
              key={item.id} 
              className="mb-32 last:mb-0 transition-opacity duration-500"
              style={{ opacity: isActive || !overlayFade ? 1 : 0.3 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                {item.title}
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* VISUAL COLUMN (Sticky) */}
      <div className={`hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center ${isLeftAlign ? 'order-2' : 'order-1'}`}>
        <div className="relative w-full aspect-square max-h-[600px]">
          {/* mode="popLayout" prevents the new image from stacking below the old one during the crossfade */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1] 
              }}
              className="absolute inset-0 shadow-2xl rounded-2xl overflow-hidden"
            >
              {items[activeIndex].visual}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}