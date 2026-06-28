import React from 'react';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  content: string; /* @translate @textarea */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote' | 'label' | 'strong' | 'em';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify'; /* @select|left|center|right|justify */
  customColor?: string; /* @color */
  className?: string;
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
  
  const sizeClasses: Record<string, string> = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl leading-relaxed',
    '3xl': 'text-3xl leading-snug',
    '4xl': 'text-4xl leading-tight',
    '5xl': 'text-5xl leading-tight',
    '6xl': 'text-6xl leading-none',
    '7xl': 'text-7xl leading-none',
    '8xl': 'text-8xl leading-none',
    '9xl': 'text-9xl leading-none',
  };

  const weightClasses: Record<string, string> = {
    'thin': 'font-thin',
    'extralight': 'font-extralight',
    'light': 'font-light',
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold',
    'extrabold': 'font-extrabold',
    'black': 'font-black',
  };

  const alignClasses: Record<string, string> = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
    'justify': 'text-justify',
  };

  // Blockquotes get special default styling
  const isQuote = Tag === 'blockquote';

  return (
    <Tag
      className={`
        ${sizeClasses[size] || ''} 
        ${weightClasses[weight] || ''} 
        ${alignClasses[align] || ''} 
        ${isQuote ? 'pl-4 border-l-4 border-zinc-300 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}
        ${className}
      `.trim().replace(/\s+/g, ' ')} // Cleans up excess whitespace from template literals
      style={customColor ? { color: customColor } : undefined}
      {...props}
    >
      {content}
    </Tag>
  );
}