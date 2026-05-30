import React from 'react';
import styles from './styles.module.scss';

export interface CardProps {
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({
  headerSlot,
  footerSlot,
  children,
  onClick,
  className = '',
  style
}: CardProps) {
  return (
    <div 
      className={`${styles.card} ${className}`}
      style={style}
      onClick={onClick}
    >
      {headerSlot && <div className={styles.header}>{headerSlot}</div>}
      <div className={styles.content}>
        {children}
      </div>
      {footerSlot && <div className={styles.footer}>{footerSlot}</div>}
    </div>
  );
}