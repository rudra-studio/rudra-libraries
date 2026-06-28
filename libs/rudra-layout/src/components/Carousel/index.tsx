import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface RudraCarouselProps {
  children: React.ReactNode[];
  variant?: 'inline-arrows' | 'bottom-controls'; /* @select|inline-arrows|bottom-controls */
  itemsPerView?: 'one' | 'multiple' | 'fractional'; /* @select|one|multiple|fractional */
  gap?: 'none' | 'sm' | 'md' | 'lg'; /* @select|none|sm|md|lg */
  className?: string;
}

const RudraCarousel: React.FC<RudraCarouselProps> = ({
  children,
  variant = 'inline-arrows',
  itemsPerView = 'one',
  gap = 'md',
  className
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalItems = React.Children.count(children);

  // --- RESPONSIVE WIDTH CALCULATION ---
  const getItemWidthClass = () => {
    switch (itemsPerView) {
      case 'one':
        return 'w-full';
      case 'multiple':
        // 1 on mobile, 2 on tablet, 3 on desktop, 4 on large screens
        return 'w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]';
      case 'fractional':
        // 1.1 on mobile, 2.5 on tablet, 4.5 on desktop 
        // This gives the cool "peek" effect telling users they can scroll
        return 'w-[85%] sm:w-[38%] md:w-[28%] lg:w-[21%]';
      default:
        return 'w-full';
    }
  };

  // --- GAP CALCULATION ---
  const getGapClass = () => {
    switch (gap) {
      case 'none': return 'gap-0';
      case 'sm': return 'gap-2';
      case 'lg': return 'gap-8';
      case 'md':
      default: return 'gap-4';
    }
  };

  // --- SCROLL LOGIC ---
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // Update Arrow States
    setIsAtStart(scrollLeft <= 10);
    setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10);

    // Update Dot State (Approximation based on scroll percentage)
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const scrollProgress = scrollLeft / maxScroll;
      const index = Math.round(scrollProgress * (totalItems - 1));
      setActiveIndex(index);
    } else {
      setActiveIndex(0);
    }
  };

  useEffect(() => {
    handleScroll(); // Init state
  }, [children, itemsPerView]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    // Scroll by the width of the container for a full "page" turn, or a specific item amount
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; 
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const scrollToDot = (index: number) => {
    if (!scrollContainerRef.current) return;
    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = maxScroll * (index / (totalItems - 1 || 1));
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Prevent rendering if empty
  if (!children || totalItems === 0) return null;

  return (
    <div className={`relative w-full flex flex-col group ${className}`}>
      
      {/* 
        The Scroll Container 
        Uses native CSS scroll snapping. The complicated classes hide the scrollbar across all browsers.
      */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`flex ${getGapClass()} overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 py-4`}
      >
        {React.Children.map(children, (child, index) => (
          <div 
            key={index} 
            className={`shrink-0 snap-center sm:snap-start transition-transform ${getItemWidthClass()}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* --- VARIANT 1: INLINE ARROWS (Overlapping the content, hiding on edges) --- */}
      {variant === 'inline-arrows' && (
        <>
          <button 
            onClick={() => scrollByAmount('left')}
            disabled={isAtStart}
            className={`absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none`}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={() => scrollByAmount('right')}
            disabled={isAtEnd}
            className={`absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none`}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* --- VARIANT 2: BOTTOM CONTROLS (Arrows + Dots underneath) --- */}
      {variant === 'bottom-controls' && (
        <div className="flex items-center justify-between w-full mt-4 px-2">
          
          <button 
            onClick={() => scrollByAmount('left')}
            disabled={isAtStart}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalItems }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToDot(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === idx 
                    ? 'w-6 h-1.5 bg-blue-600' 
                    : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={() => scrollByAmount('right')}
            disabled={isAtEnd}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      
    </div>
  );
};

export default RudraCarousel;