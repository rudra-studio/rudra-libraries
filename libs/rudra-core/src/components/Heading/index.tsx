import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string; /* @translate */
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  align?: string; /* @select|left|center|right|justify */
  className?: string
}

export default function Heading({
  text = 'Heading Text',
  level = 'h2',
  align = 'left',
  className = '',
  ...props
}: HeadingProps) {
  const Tag = level;

  const alignmentClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const sizeClasses = {
    h1: 'text-4xl md:text-5xl font-extrabold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
    h5: 'text-lg md:text-xl font-medium',
    h6: 'text-base md:text-lg font-medium',
  };

  return (
    <Tag
      className={`text-zinc-900 dark:text-white tracking-tight ${sizeClasses[level]} ${alignmentClasses[align] || 'text-left'} ${className}`}
      {...props}
    >
      {text}
    </Tag>
  );
}import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string; /* @translate */
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  align?: string; /* @select|left|center|right|justify */
  className?: string
}

export default function Heading({
  text = 'Heading Text',
  level = 'h2',
  align = 'left',
  className = '',
  ...props
}: HeadingProps) {
  const Tag = level;

  const alignmentClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const sizeClasses = {
    h1: 'text-4xl md:text-5xl font-extrabold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
    h5: 'text-lg md:text-xl font-medium',
    h6: 'text-base md:text-lg font-medium',
  };

  return (
    <Tag
      className={`text-zinc-900 dark:text-white tracking-tight ${sizeClasses[level]} ${alignmentClasses[align] || 'text-left'} ${className}`}
      {...props}
    >
      {text}
    </Tag>
  );
}