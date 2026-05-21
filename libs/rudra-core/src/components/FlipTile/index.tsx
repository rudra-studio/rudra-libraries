import React, { useState } from 'react';
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
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    // Let the event bubble up to the Builder for selection
    if (onClick) onClick(e);
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`${styles.perspectiveContainer} ${className}`} 
      style={{ ...style, perspective: '1000px' }}
      onClick={handleFlip}
    >
      <div 
        className={styles.tileInner}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          transformStyle: 'preserve-3d',
          // 1. Tell the browser to animate any changes to 'transform'
          transition: `transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          // 2. React natively controls the rotation angle based on state!
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
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