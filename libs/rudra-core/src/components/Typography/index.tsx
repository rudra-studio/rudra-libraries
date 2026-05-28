import React from 'react';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  content: string; /* @translate @textarea */
  as?: 'p' | 'span' | 'blockquote' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify'; /* @select|left|center|right|justify */
  customColor?: string; /* @color */
}

export default function Typography({
  content = 'Add your text here...',
  as: Tag = 'p',
  size = 'base',
  weight = 'normal',
  align = 'left',
  customColor,
  className = '',
  ...props
}: TypographyProps) {
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl leading-relaxed',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const alignClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  // Blockquotes get special default styling
  const isQuote = Tag === 'blockquote';

  return (
    <Tag
      className={`
        ${sizeClasses[size]} 
        ${weightClasses[weight]} 
        ${alignClasses[align]} 
        ${isQuote ? 'pl-4 border-l-4 border-zinc-300 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}
        ${className}
      `}
      style={customColor ? { color: customColor } : undefined}
      {...props}
    >
      {content}
    </Tag>
  );
}