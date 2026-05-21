import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import styles from './styles.module.scss';

export interface FlipTileProps {
  frontSlot: React.ReactNode;
  backSlot: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function FlipTile({
  frontSlot,
  backSlot,
  className = '',
  style,
  duration = 0.6,
  onClick
}: FlipTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  
  // 1. Use React State instead of a mutable ref
  const [isFlipped, setIsFlipped] = useState(false);

  // 2. Trigger GSAP *after* React finishes rendering
  useEffect(() => {
    if (tileRef.current) {
      gsap.to(tileRef.current, {
        rotateY: isFlipped ? 180 : 0,
        duration: duration,
        ease: "power2.inOut"
      });
    }
  }, [isFlipped, duration]);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    // Let the event bubble up so the Module Builder can select it!
    if (onClick) onClick(e);
    
    // Update state, which triggers a re-render, which triggers the useEffect
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`${styles.perspectiveContainer} ${className}`} 
      style={{ ...style, perspective: '1000px' }}
      onClick={handleFlip}
    >
      <div 
        ref={tileRef} 
        className={styles.tileInner}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          transformStyle: 'preserve-3d' 
        }}
      >
        <div 
          className={`${styles.face} ${styles.frontFace}`}
          style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}
        >
          {frontSlot}
        </div>
        
        <div 
          className={`${styles.face} ${styles.backFace}`}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)' 
          }}
        >
          {backSlot}
        </div>
      </div>
    </div>
  );
}