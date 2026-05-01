import React from 'react';
import styles from './styles.module.scss';

export interface BouncingBallProps {
  color?: string;
  size?: number;
  duration?: string;
}

const BouncingBall: React.FC<BouncingBallProps> = ({
  color = '#3498db',
  size = 50,
  duration = '0.6s'
}) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.ball}
        style={{
          backgroundColor: color,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: duration
        } as React.CSSProperties}
      />
      <div
        className={styles.shadow}
        style={{
          width: `${size}px`,
          animationDuration: duration
        } as React.CSSProperties}
      />
    </div>
  );
};

export default BouncingBall;