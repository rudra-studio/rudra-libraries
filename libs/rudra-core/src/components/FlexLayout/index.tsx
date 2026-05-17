import React from 'react';
import styles from './styles.module.scss';

export interface FlexLayoutProps {
  direction?: 'row' | 'column';
  verticalGap?: string | number;
  horizontalGap?: string | number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  itemCount?: number;
}

export default function FlexLayout({
  direction = 'row',
  verticalGap = 0,
  horizontalGap = 0,
  className = '',
  style,
  children,
  itemCount
}: FlexLayoutProps) {
  const layoutStyle: React.CSSProperties = {
    flexDirection: direction,
    rowGap: typeof verticalGap === 'number' ? `${verticalGap}px` : verticalGap,
    columnGap: typeof horizontalGap === 'number' ? `${horizontalGap}px` : horizontalGap,
    ...style
  };

  return (
    <div 
      className={`${styles.flexLayout} ${className}`} 
      style={layoutStyle}
      data-item-count={itemCount}
    >
      {children}
    </div>
  );
}
