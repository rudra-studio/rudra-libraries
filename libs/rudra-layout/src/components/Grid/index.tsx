import styles from "./styles.module.scss";
import React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: '1' | '2' | '3' | '4' | 'auto-fit'; /* @select|1|2|3|4|auto-fit */
  gap?: 'sm' | 'md' | 'lg' | 'xl'; /* @select|sm|md|lg|xl */
  children?: React.ReactNode;
}

export default function Grid({
  columns = '3',
  gap = 'md',
  className = '',
  children,
  ...props
}: GridProps) {
  
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  const columnClasses: Record<string, string> = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    'auto-fit': 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]', // Great for responsive cards
  };

  return (
    <div 
      className={`grid w-full ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}