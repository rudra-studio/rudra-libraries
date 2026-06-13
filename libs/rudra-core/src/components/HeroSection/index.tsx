import React from 'react';
import styles from './styles.module.scss';

export interface HeroSectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaSlot?: React.ReactNode;
  imageSlot?: React.ReactNode;
  backgroundSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroSection({
  title,
  subtitle,
  ctaSlot,
  imageSlot,
  backgroundSlot,
  children,
  className = '',
  style
}: HeroSectionProps) {
  return (
    <section 
      className={`relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32 ${styles.heroContainer} ${className}`} 
      style={style}
    >
      {backgroundSlot && (
        <div className="absolute inset-0 -z-10">
          {backgroundSlot}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:items-center lg:gap-x-8">
          <div className="max-w-xl lg:max-w-lg">
            {title && (
              <div className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="mt-6 text-lg leading-8 text-gray-600">
                {subtitle}
              </div>
            )}
            {ctaSlot && (
              <div className="mt-10 flex items-center gap-x-6">
                {ctaSlot}
              </div>
            )}
            {children && (
               <div className="mt-8">
                  {children}
               </div>
            )}
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            {imageSlot ? (
              <div className="w-full max-w-none rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-400/10">
                {imageSlot}
              </div>
            ) : (
              <div className="aspect-[4/3] w-full max-w-none rounded-xl bg-gray-50 shadow-xl ring-1 ring-gray-400/10 flex items-center justify-center">
                <span className="text-gray-400">Hero Image Slot</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import styles from './styles.module.scss';

export interface HeroSectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaSlot?: React.ReactNode;
  imageSlot?: React.ReactNode;
  backgroundSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroSection({
  title,
  subtitle,
  ctaSlot,
  imageSlot,
  backgroundSlot,
  children,
  className = '',
  style
}: HeroSectionProps) {
  return (
    <section 
      className={`relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32 ${styles.heroContainer} ${className}`} 
      style={style}
    >
      {backgroundSlot && (
        <div className="absolute inset-0 -z-10">
          {backgroundSlot}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:items-center lg:gap-x-8">
          <div className="max-w-xl lg:max-w-lg">
            {title && (
              <div className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="mt-6 text-lg leading-8 text-gray-600">
                {subtitle}
              </div>
            )}
            {ctaSlot && (
              <div className="mt-10 flex items-center gap-x-6">
                {ctaSlot}
              </div>
            )}
            {children && (
               <div className="mt-8">
                  {children}
               </div>
            )}
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            {imageSlot ? (
              <div className="w-full max-w-none rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-400/10">
                {imageSlot}
              </div>
            ) : (
              <div className="aspect-[4/3] w-full max-w-none rounded-xl bg-gray-50 shadow-xl ring-1 ring-gray-400/10 flex items-center justify-center">
                <span className="text-gray-400">Hero Image Slot</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
