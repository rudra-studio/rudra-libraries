import React from 'react';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  
  // Layout
  direction?: 'row' | 'col'; /* @select|row|col */
  horizontalAlign?: 'start' | 'center' | 'end' | 'between' | 'stretch'; /* @select|start|center|end|between|stretch */
  verticalAlign?: 'start' | 'center' | 'end' | 'between' | 'stretch'; /* @select|start|center|end|between|stretch */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'; /* @select|none|sm|md|lg|xl */
  wrap?: boolean;
  
  // The Custom Attributes Dictionary
  customAttributes?: { name: string; value: string }[]; /* @complex|{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"value":{"type":"string"}}}} */
  
  className?: string;
}

export const Box: React.FC<BoxProps> = ({
  children,
  direction = 'row',
  horizontalAlign = 'start',
  verticalAlign = 'stretch',
  gap = 'none',
  wrap = false,
  customAttributes = [],
  className = '',
  ...props
}) => {
  
  // 1. Resolve Gap Classes
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  // 2. Intelligent Alignment Logic
  // This maps the intuitive "Horizontal/Vertical" intent to the correct main-axis/cross-axis Tailwind classes
  let justifyClass = '';
  let alignClass = '';

  const mainAxisMap: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    stretch: 'justify-stretch', // Rarely used in main axis, but mapped for completeness
  };

  const crossAxisMap: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    between: 'items-stretch', // Items cannot 'space-between', they stretch instead
    stretch: 'items-stretch',
  };

  if (direction === 'row') {
    // In a row, horizontal is main axis (justify), vertical is cross axis (align)
    justifyClass = mainAxisMap[horizontalAlign] || 'justify-start';
    alignClass = crossAxisMap[verticalAlign] || 'items-stretch';
  } else {
    // In a column, horizontal is cross axis (align), vertical is main axis (justify)
    justifyClass = mainAxisMap[verticalAlign] || 'justify-start';
    alignClass = crossAxisMap[horizontalAlign] || 'items-stretch';
  }

  // 3. Resolve Custom Attributes
  // Transforms the builder's array of {name, value} objects into a standard React prop dictionary
  const resolvedAttributes = customAttributes?.reduce((acc, attr) => {
    if (attr && attr.name && attr.name.trim() !== '') {
      acc[attr.name.trim()] = attr.value;
    }
    return acc;
  }, {} as Record<string, string>);

  return (
    <div
      className={`
        flex 
        ${direction === 'row' ? 'flex-row' : 'flex-col'} 
        ${wrap ? 'flex-wrap' : 'flex-nowrap'} 
        ${justifyClass} 
        ${alignClass} 
        ${gapClasses[gap]} 
        ${className}
      `}
      {...resolvedAttributes}
      {...props}
    >
      {children}
    </div>
  );
};

export default Box;