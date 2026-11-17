import React from 'react';
import './styles.module.scss';

interface BlockProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Block: React.FC<BlockProps> = ({ children, className, style }) => {
  return (
    <div className={`block ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Block;