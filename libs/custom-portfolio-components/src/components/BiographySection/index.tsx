import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.scss';

interface BiographySectionProps {
  name: string;
  title: string;
  biography: string;
  imageUrl?: string;
}

const BiographySection: React.FC<BiographySectionProps> = ({
  name,
  title,
  biography,
  imageUrl = 'https://via.placeholder.com/150'
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const biographyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = biographyRef.current?.getBoundingClientRect();
      const offsetX = event.clientX - rect?.left || 0;
      const offsetY = event.clientY - rect?.top || 0;
      setCursorPosition({ x: offsetX, y: offsetY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.biographySection}>
      <div className={styles.imageContainer} style={{ backgroundImage: `url(${imageUrl})` }}></div>
      <div className={styles.biographyContent} ref={biographyRef} style={{ transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)` }}>
        <h2>{name}</h2>
        <h3>{title}</h3>
        <p>{biography}</p>
      </div>
    </div>
  );
};

export default BiographySection;