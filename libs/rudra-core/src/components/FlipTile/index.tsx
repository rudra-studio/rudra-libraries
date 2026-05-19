import React, { useRef } from 'react';
import gsap from 'gsap';
import styles from './styles.module.scss';

export interface FlipTileProps {
  frontSlot: React.ReactNode;
  backSlot: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function FlipTile({
  frontSlot,
  backSlot,
  children,
  className = '',
  style,
  duration = 0.6,
  onClick
}: FlipTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const isFlipped = useRef(false);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(e);
    
    isFlipped.current = !isFlipped.current;
    
    if (tileRef.current) {
      gsap.to(tileRef.current, {
        rotateY: isFlipped.current ? 180 : 0,
        duration: duration,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <div 
      className={`${styles.perspectiveContainer} ${className}`} 
      style={style}
      onClick={handleFlip}
    >
      <div ref={tileRef} className={styles.tileInner}>
        <div className={`${styles.face} ${styles.frontFace}`}>
          {frontSlot}
        </div>
        <div className={`${styles.face} ${styles.backFace}`}>
          {backSlot}
        </div>
      </div>
      {children && <div className={styles.extraContent}>{children}</div>}
    </div>
  );
}
