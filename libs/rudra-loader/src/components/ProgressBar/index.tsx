import React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 to 100
  max?: number;
  customColor?: string; /* @color */
  size?: 'sm' | 'md' | 'lg'; /* @select|sm|md|lg */
  showLabel?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  value = 45,
  max = 100,
  customColor = '#10b981', // Default emerald-500
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
  ...props
}: ProgressBarProps) {
  
  // Ensure value stays within bounds safely
  const safeValue = Math.min(Math.max(value, 0), max);
  const percentage = Math.round((safeValue / max) * 100);

  const sizeClasses = {
    sm: 'h-1.5 text-[10px]',
    md: 'h-2.5 text-xs',
    lg: 'h-4 text-sm',
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`} {...props}>
      
      {showLabel && (
        <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400 font-medium">
          <span className={sizeClasses[size].split(' ')[1]}>Progress</span>
          <span className={sizeClasses[size].split(' ')[1]}>{percentage}%</span>
        </div>
      )}

      <div className={`w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden ${sizeClasses[size].split(' ')[0]}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: customColor 
          }}
        >
          {/* Optional Barber-pole animation overlay */}
          {animated && (
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[progress_2s_linear_infinite]" 
                 style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}