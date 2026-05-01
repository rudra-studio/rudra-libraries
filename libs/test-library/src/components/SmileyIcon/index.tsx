import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface SmileyIconProps {
  /** Size of the icon in pixels */
  size?: number;
  /** Primary color of the smiley face */
  color?: string;
  /** Optional click handler */
  onClick?: () => void;
}

const SmileyIcon: React.FC<SmileyIconProps> = ({
  size = 100,
  color = '#FFD700',
  onClick
}) => {
  const [isExcited, setIsExcited] = useState(false);

  const handleClick = () => {
    setIsExcited(!isExcited);
    if (onClick) onClick();
  };

  return (
    <div
      className={`${styles.smileyWrapper} ${isExcited ? styles.excited : ''}`}
      style={{ '--size': `${size}px`, '--face-color': color } as React.CSSProperties}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        {/* Face Background */}
        <circle cx="50" cy="50" r="45" className={styles.face} />

        {/* Eyes Group */}
        <g className={styles.eyes}>
          <circle cx="35" cy="40" r="5" className={styles.eye} />
          <circle cx="65" cy="40" r="5" className={styles.eye} />
        </g>

        {/* Mouth */}
        <path
          d={isExcited ? "M30 70 Q50 95 70 70" : "M30 65 Q50 85 70 65"}
          className={styles.mouth}
        />

        {/* Blushed Cheeks */}
        <g className={styles.cheeks}>
          <circle cx="25" cy="55" r="6" className={styles.cheek} />
          <circle cx="75" cy="55" r="6" className={styles.cheek} />
        </g>
      </svg>
    </div>
  );
};

export default SmileyIcon;