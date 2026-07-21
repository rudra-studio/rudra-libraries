import React from 'react';


export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string; /* @translate */
  icon?: React.ReactNode; /* @icon */
  isOffer?: boolean;
  customColor?: string; /* @color */
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>;

  /** * @type|class
   * @schema [{
   * "key": "Display & Alignment",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "inline-flex", "label": "Inline"},
   * {"key": "flex w-fit mr-auto", "label": "Left"},
   * {"key": "flex w-fit mx-auto", "label": "Center"},
   * {"key": "flex w-fit ml-auto", "label": "Right"}
   * ]
   * },{
   * "key": "Size",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "px-2 py-0.5 text-[10px] gap-1", "label": "Small"},
   * {"key": "px-2.5 py-1 text-xs gap-1.5", "label": "Medium"},
   * {"key": "px-3.5 py-1.5 text-sm gap-2", "label": "Large"}
   * ]
   * },{
   * "key": "Theme",
   * "prefix": "bg",
   * "type": "select",
   * "options": [
   * {"key": "purple-100 text-purple-800 border-transparent", "label": "Subtle Purple"},
   * {"key": "purple-600 text-white border-purple-600", "label": "Solid Purple"},
   * {"key": "blue-100 text-blue-800 border-transparent", "label": "Subtle Blue"},
   * {"key": "blue-600 text-white border-blue-600", "label": "Solid Blue"},
   * {"key": "transparent text-purple-600 border-purple-600", "label": "Outline Purple"}
   * ]
   * }]
   */
  className?: string;
  onClick?: (event: any) => void; /* @type|function|return:void|args:event*/ 
}

export default function Badge({
  label = 'Special Offer',
  icon,
  isOffer = false,
  customColor,
  customAttributes = {},
  // Set the "subtle" look with relative positioning as the solid baseline default
  className = 'relative inline-flex items-center justify-center rounded-full font-bold tracking-wide border transition-all duration-300 px-2.5 py-1 text-xs gap-1.5 bg-purple-100 text-purple-800 border-transparent',
  ...props
}: BadgeProps) {

  return (
    <div
      className={className}
      // If a custom color is picked, it acts as a solid override 
      style={customColor ? { backgroundColor: customColor, borderColor: customColor, color: '#ffffff' } : undefined}
      {...customAttributes}
      {...props}
    >
      {/* Pulsing dot for the "Offer" state */}
      {isOffer && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-500" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      )}

      {icon}
      {label && <span>{label}</span>}
    </div>
  );
}