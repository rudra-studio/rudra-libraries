import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface MorphingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string; // Must be globally unique on the page to link the layouts
  thumbnailImage: string;
  title: string;
  subtitle?: string;
  description?: React.ReactNode;
}

export default function MorphingCard({
  id,
  thumbnailImage,
  title,
  subtitle,
  description,
  className = '',
  ...props
}: MorphingCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Accessibility: Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Premium Spring Physics for the morphing effect
  const transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  return (
    <>
      {/* 1. THUMBNAIL STATE (The Trigger) */}
      <motion.div
        layoutId={`card-container-${id}`}
        onClick={() => setIsOpen(true)}
        className={`relative w-full h-64 rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-md transition-shadow group ${className}`}
        {...props}
      >
        <motion.img
          layoutId={`card-image-${id}`}
          src={thumbnailImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <motion.div 
          layoutId={`card-text-container-${id}`}
          className="absolute bottom-0 left-0 p-6 flex flex-col"
        >
          <motion.h3 
            layoutId={`card-title-${id}`}
            className="text-white text-xl font-bold tracking-tight"
          >
            {title}
          </motion.h3>
          {subtitle && (
            <motion.p 
              layoutId={`card-subtitle-${id}`}
              className="text-slate-200 text-sm font-medium mt-1"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* 2. MODAL STATE (The Expanded View) */}
      <AnimatePresence>
        {isOpen && (
          <React.Fragment key={`modal-${id}`}>
            {/* The Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 cursor-zoom-out"
            />

            {/* The Expanded Card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
              <motion.div
                layoutId={`card-container-${id}`}
                className="w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto"
                transition={transition}
              >
                {/* Header Image Area */}
                <div className="relative w-full h-64 md:h-80 shrink-0">
                  <motion.img
                    layoutId={`card-image-${id}`}
                    src={thumbnailImage}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                    transition={transition}
                  />
                  {/* Close Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-10 overflow-y-auto">
                  <motion.div layoutId={`card-text-container-${id}`}>
                    <motion.h3 
                      layoutId={`card-title-${id}`}
                      className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
                      transition={transition}
                    >
                      {title}
                    </motion.h3>
                    {subtitle && (
                      <motion.p 
                        layoutId={`card-subtitle-${id}`}
                        className="text-emerald-600 font-semibold text-lg mt-2"
                        transition={transition}
                      >
                        {subtitle}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Body text fades in *after* the morph completes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="mt-6 text-slate-600 leading-relaxed text-lg"
                  >
                    {description || (
                      <p>
                        This is the expanded view. Notice how the image, the title, and the subtitle perfectly morphed from their thumbnail dimensions to their new modal dimensions. 
                        Because they share a `layoutId`, Framer calculates the CSS transform matrices on the GPU to invert the layout shift.
                      </p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </>
  );
}