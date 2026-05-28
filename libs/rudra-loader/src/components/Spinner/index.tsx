
import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'circle' | 'dots' | 'ring'; /* @select|circle|dots|ring */
  size?: 'sm' | 'md' | 'lg' | 'xl'; /* @select|sm|md|lg|xl */
  customColor?: string; /* @color */
  label?: string; /* @translate */
}

export default function Spinner({
  variant = 'ring',
  size = 'md',
  customColor = '#3b82f6', // Default blue-500
  label,
  className = '',
  ...props
}: SpinnerProps) {
  
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} {...props}>
      
      {/* Variant 1: Classic Tailwind Spin Ring */}
      {variant === 'ring' && (
        <div 
          className={`${currentSize} rounded-full animate-spin`}
          style={{ 
            border: `3px solid ${customColor}30`, 
            borderTopColor: customColor 
          }}
        />
      )}

      {/* Variant 2: SVG Circle Pulse */}
      {variant === 'circle' && (
        <svg className={`${currentSize} animate-spin`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ color: customColor }}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ color: customColor }}></path>
        </svg>
      )}

      {/* Variant 3: Bouncing Dots */}
      {variant === 'dots' && (
        <div className="flex space-x-2 justify-center items-center h-full">
          <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: customColor, animationDelay: '-0.3s' }}></span>
          <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: customColor, animationDelay: '-0.15s' }}></span>
          <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: customColor }}></span>
        </div>
      )}

      {/* Optional Loading Text */}
      {label && (
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}