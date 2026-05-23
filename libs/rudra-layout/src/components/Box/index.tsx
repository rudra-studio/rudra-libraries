import React from 'react';
import styles from './styles.module.scss';

export interface BoxProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  role?: string;
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  tabIndex?: number;
}

export default function Box({
  children,
  className = '',
  style,
  as: Component = 'div',
  role,
  id,
  ariaLabel,
  ariaLabelledBy,
  onClick,
  tabIndex,
}: BoxProps) {
  return (
    <Component
      id={id}
      className={`${styles.box} ${className}`}
      style={style}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {children}
    </Component>
  );
}
