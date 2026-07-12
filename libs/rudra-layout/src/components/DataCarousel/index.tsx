import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


export interface RepeaterCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: any[]; 
  children?: React.ReactNode | ((context: { item: any; index: number }) => React.ReactNode);
  
  /** * @select|inline-arrows|bottom-controls 
   */
  variant?: 'inline-arrows' | 'bottom-controls'; 
  
  /** * @select|one|multiple|fractional 
   */
  itemsPerView?: 'one' | 'multiple' | 'fractional'; 

  /** * @type|class
   * @schema [{
   * "key": "Outer Margin",
   * "prefix": "m",
   * "type": "select",
   * "options": [
   * {"key": "0", "label": "None"},
   * {"key": "4", "label": "Medium"}
   * ]
   * },{
   * "key": "Gap",
   * "prefix": "gap",
   * "type": "select",
   * "options": [
   * {"key": "0", "label": "None (0px)"},
   * {"key": "2", "label": "Small (8px)"},
   * {"key": "4", "label": "Medium (16px)"},
   * {"key": "8", "label": "Large (32px)"}
   * ]
   * }]
   */
  className?: string;
}

const RepeaterCarousel: React.FC<RepeaterCarouselProps> = ({
  items = [],
  children,
  variant = 'inline-arrows',
  itemsPerView = 'one',
  gap = 'md', // Default prop for engine logic
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalItems = items?.length || 0;

  // --- INTERNAL MAPPINGS ---
  const widthMap: Record<string, string> = {
    'one': 'w-full',
    'multiple': 'w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]',
    'fractional': 'w-[85%] sm:w-[38%] md:w-[28%] lg:w-[21%]'
  };

  const gapMap: Record<string, string> = {
    'none': 'gap-0',
    'sm': 'gap-2',
    'md': 'gap-4',
    'lg': 'gap-8'
  };

  // --- SCROLL LOGIC ---
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setIsAtStart(scrollLeft <= 10);
    setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    setActiveIndex(maxScroll > 0 ? Math.round((scrollLeft / maxScroll) * (totalItems - 1)) : 0);
  };

  useEffect(() => { handleScroll(); }, [items, itemsPerView]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; 
    scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const scrollToDot = (index: number) => {
    if (!scrollContainerRef.current) return;
    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    scrollContainerRef.current.scrollTo({ left: maxScroll * (index / (totalItems - 1 || 1)), behavior: 'smooth' });
  };

  if (totalItems === 0) return null;

  return (
    <div className={`relative w-full flex flex-col group ${className}`.trim()}>
      
      {/* The Scroll Container: 
         - Injected 'gap-*' classes from the Engine via Props 
      */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`flex ${gapMap[gap]} overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 py-4`}
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`shrink-0 snap-center sm:snap-start transition-transform ${widthMap[itemsPerView]}`}
          >
            {typeof children === "function" ? children({ item, index }) : children}
          </div>
        ))}
      </div>

      {/* --- VARIANTS --- */}
      {variant === 'inline-arrows' && (
        <>
          <button onClick={() => scrollByAmount('left')} disabled={isAtStart} className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scrollByAmount('right')} disabled={isAtEnd} className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none">
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {variant === 'bottom-controls' && (
        <div className="flex items-center justify-between w-full mt-4 px-2">
          <button onClick={() => scrollByAmount('left')} disabled={isAtStart} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalItems }).map((_, idx) => (
              <button key={idx} onClick={() => scrollToDot(idx)} className={`transition-all duration-300 rounded-full ${activeIndex === idx ? 'w-6 h-1.5 bg-blue-600' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'}`} aria-label={`Go to slide ${idx + 1}`} />
            ))}
          </div>
          <button onClick={() => scrollByAmount('right')} disabled={isAtEnd} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RepeaterCarousel;