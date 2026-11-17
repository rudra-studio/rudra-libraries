import React from 'react';

interface SpacerProps {
  size?: number;
  direction?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
}

const Spacer: React.FC<SpacerProps> = ({ size = 16, direction = 'horizontal', children }) => {
  const style = {
    width: direction === 'horizontal' ? size : 0,
    height: direction === 'vertical' ? size : 0,
    display: 'inline-block',
  };

  return <div style={style}>{children}</div>;
};

export default Spacer;