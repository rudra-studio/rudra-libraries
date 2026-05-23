import React from 'react';
import styles from './styles.module.scss';

export interface GridItemProps {
  span?: number | string;
  mobileSpan?: number | string;
  tabletSpan?: number | string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GridItem({ 
  span = 1, 
  mobileSpan, 
  tabletSpan, 
  children, 
  className = '', 
  style 
}: GridItemProps) {
  const classes = [
    styles.item,
    styles[`span-${span}`],
    mobileSpan ? styles[`sm-span-${mobileSpan}`] : '',
    tabletSpan ? styles[`md-span-${tabletSpan}`] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}

export interface GridProps {
  cols?: number;
  mobileCols?: number;
  tabletCols?: number;
  gap?: string | number;
  columnGap?: string | number;
  rowGap?: string | number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
}

export default function Grid({
  cols = 12,
  mobileCols,
  tabletCols,
  gap = '1rem',
  columnGap,
  rowGap,
  children,
  className = '',
  style,
  onClick
}: GridProps) {
  const gridClasses = [
    styles.grid,
    styles[`cols-${cols}`],
    mobileCols ? styles[`sm-cols-${mobileCols}`] : '',
    tabletCols ? styles[`md-cols-${tabletCols}`] : '',
    className
  ].filter(Boolean).join(' ');

  const gridStyles: React.CSSProperties = {
    gap: gap,
    columnGap: columnGap,
    rowGap: rowGap,
    ...style
  };

  return (
    <div className={gridClasses} style={gridStyles} onClick={onClick}>
      {children}
    </div>
  );
}
