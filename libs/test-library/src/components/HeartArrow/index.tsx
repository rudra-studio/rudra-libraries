import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

export interface HeartArrowProps {
  size?: number;
  heartColor?: string;
  arrowColor?: string;
  onClick?: (isArrowStuck: boolean) => void;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
  rotation: number;
}

const HeartArrow: React.FC<HeartArrowProps> = ({
  size = 150,
  heartColor = '#ff4d4d',
  arrowColor = '#ffd700',
  onClick
}) => {
  const [isArrowStuck, setIsArrowStuck] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleClick = () => {
    const newState = !isArrowStuck;
    setIsArrowStuck(newState);

    if (newState) {
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        tx: (Math.random() - 0.5) * 200,
        ty: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);
      
      setTimeout(() => {
        setParticles([]);
      }, 2000);
    }

    if (onClick) onClick(newState);
  };

  return (
    <div 
      className={styles.container} 
      style={{ '--size': `${size}px`, '--heart-color': heartColor } as React.CSSProperties}
      onClick={handleClick}
    >
      <div className={`${styles.scene} ${isArrowStuck ? styles.arrowStuckScene : ''}`}>
        {/* Heart Shape */}
        <div className={styles.heartWrapper}>
          <svg 
            viewBox="0 0 32 32" 
            className={styles.heartSvg}
            style={{ fill: heartColor }}
          >
            <path d="M16 28.5L14.1 26.7C7.3 20.6 2.8 16.5 2.8 11.5C2.8 7.4 6 4.2 10.1 4.2C12.4 4.2 14.6 5.3 16 7C17.4 5.3 19.6 4.2 21.9 4.2C26 4.2 29.2 7.4 29.2 11.5C29.2 16.5 24.7 20.6 17.9 26.7L16 28.5Z" />
          </svg>
        </div>

        {/* Flying Arrow */}
        <div className={`${styles.arrow} ${isArrowStuck ? styles.flyAndStick : ''}`}>
          <svg 
            viewBox="0 0 24 24" 
            className={styles.arrowSvg}
            style={{ fill: arrowColor }}
          >
            <path d="M12 2L12 22M7 17L12 22L17 17" />
          </svg>
        </div>

        {/* Particle Hearts */}
        {particles.map(p => (
          <div 
            key={p.id} 
            className={styles.particle}
            style={{ 
              '--tx': `${p.tx}px`, 
              '--ty': `${p.ty}px`, 
              '--rot': `${p.rotation}deg` 
            } as React.CSSProperties}
          >
            <svg viewBox="0 0 32 32" className={styles.particleSvg}>
               <path d="M16 28.5L14.1 26.7C7.3 20.6 2.8 16.5 2.8 11.5C2.8 7.4 6 4.2 10.1 4.2C12.4 4.2 14.6 5.3 16 7C17.4 5.3 19.6 4.2 21.9 4.2C26 4.2 29.2 7.4 29.2 11.5C29.2 16.5 24.7 20.6 17.9 26.7L16 28.5Z" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeartArrow;
