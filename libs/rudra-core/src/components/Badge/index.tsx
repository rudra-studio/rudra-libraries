import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string; /* @translate */
  variant?: 'solid' | 'subtle' | 'outline' | 'glow';
  customColor?: string; /* @color */
  icon?: React.ReactNode /* @icon */
  align?: 'inline' | 'left' | 'center' | 'right'; /* @select|inline|left|center|right */
  size?: 'sm' | 'md' | 'lg'; /* @select|sm|md|lg */
  isOffer?: boolean;
}

export default function Badge({
  label = 'Special Offer',
  variant = 'glow',
  customColor = '#8b5cf6', // Default to a striking purple
  icon,
  align = 'inline',
  size = 'md',
  isOffer = false,
  className = '',
  ...props
}: BadgeProps) {


  // Inline styles ensure the user's color picker choice applies instantly 
  // without needing arbitrary Tailwind compilation on the fly.
  const getDynamicStyles = () => {
    switch (variant) {
      case 'solid':
        return { backgroundColor: customColor, color: '#ffffff', borderColor: customColor };
      case 'outline':
        return { backgroundColor: 'transparent', color: customColor, borderColor: customColor };
      case 'glow':
        return {
          backgroundColor: `${customColor}15`,
          color: customColor,
          borderColor: `${customColor}40`,
          boxShadow: `0 0 16px ${customColor}30`
        };
      case 'subtle':
      default:
        return { backgroundColor: `${customColor}20`, color: customColor, borderColor: 'transparent' };
    }
  };

  const alignClasses = {
    inline: 'inline-flex',
    left: 'flex w-fit mr-auto',
    center: 'flex w-fit mx-auto',
    right: 'flex w-fit ml-auto',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2',
  };

  return (
    <div className={alignClasses[align]}>
      <div
        className={`
          relative items-center rounded-full font-bold tracking-wide border transition-all duration-300
          ${align === 'inline' ? 'inline-flex' : 'flex'}
          ${sizeClasses[size]} 
          ${className}
        `}
        style={getDynamicStyles()}
        {...props}
      >
        {/* Pulsing dot for the "Offer" state */}
        {isOffer && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: customColor }}
            />
            <span
              className="relative inline-flex rounded-full h-3 w-3"
              style={{ backgroundColor: customColor }}
            />
          </span>
        )}

        {icon}

        {label}
      </div>
    </div>
  );
}