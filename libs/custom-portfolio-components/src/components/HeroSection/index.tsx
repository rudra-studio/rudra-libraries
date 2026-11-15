import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

const HeroSection: React.FC<{ title: string; biography: string; contact: string; social: string[]; resumeLink: string }> = ({ title, biography, contact, social, resumeLink }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursorPosition = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', updateCursorPosition);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
    };
  }, []);

  const { x, y } = cursorPosition;

  return (
    <section className={styles.heroSection} role='banner'>
      <div className={styles.heroContent} style={{ transform: `translate(${x / 10}px, ${y / 10}px)` }}>
        <h1>{title}</h1>
        <p>{biography}</p>
        <a href={resumeLink} target='_blank' rel='noopener noreferrer'>Resume</a>
        <ul className={styles.socialLinks}>
          {social.map((link, index) => (
            <li key={index}><a href={link} target='_blank' rel='noopener noreferrer'>Link {index + 1}</a></li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;