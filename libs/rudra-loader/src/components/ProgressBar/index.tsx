import React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col'; /* @select|row|col */
  align?: 'start' | 'center' | 'end' | 'stretch'; /* @select|start|center|end|stretch */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'; /* @select|start|center|end|between|around */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'; /* @select|none|sm|md|lg|xl */
  wrap?: boolean;
  children?: React.ReactNode;
}

export default function Stack({
  direction = 'col',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className = '',
  children,
  ...props
}: StackProps) {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap';

  const alignClasses: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  return (
    <div
      className={`flex w-full ${directionClass} ${wrapClass} ${alignClasses[align]} ${justifyClasses[justify]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {/* Builder Dropzone Placeholder */}
      {children}
    </div>
  );
}