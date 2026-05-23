import React from 'react';
import styles from './styles.module.scss';

export interface StackProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: number | string;
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
  as?: any;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function Stack({
  direction = 'column',
  gap = 0,
  align = 'stretch',
  justify = 'start',
  wrap = false,
  as: Component = 'div',
  children,
  className = '',
  style,
  onClick
}: StackProps) {
  const flexWrap = typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : wrap;

  const getJustifyContent = (val: string) => {
    const map: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly'
    };
    return map[val] || val;
  };

  const getAlignItems = (val: string) => {
    const map: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      baseline: 'baseline',
      stretch: 'stretch'
    };
    return map[val] || val;
  };

  const stackStyles: React.CSSProperties = {
    display: 'flex', // Standard flex for layout
    flexDirection: direction,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    alignItems: getAlignItems(align),
    justifyContent: getJustifyContent(justify),
    flexWrap: flexWrap as any,
    ...style
  };

  return (
    <Component
      className={`${styles.stack} ${className}`}
      style={stackStyles}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
