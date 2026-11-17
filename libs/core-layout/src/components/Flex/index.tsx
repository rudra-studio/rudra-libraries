import React from 'react';
import './styles.module.scss';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  gap = 0,
  flexWrap = 'nowrap',
}) => {
  return (
    <div
      className={`flex-container ${direction} ${alignItems} ${justifyContent} ${flexWrap}`}
      style={{ gap: `${gap}px` }}
    >
      {children}
    </div>
  );
};

export default Flex;