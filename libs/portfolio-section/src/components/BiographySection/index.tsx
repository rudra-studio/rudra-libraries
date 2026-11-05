import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { cursorInteractiveCharacter } from 'cursor-interactive-character';
import styles from './BiographySection.module.scss';

interface BiographySectionProps {
  title: string;
  biography: string;
  email: string;
  socialLinks: { label: string; url: string }[];
}

const BiographySection: React.FC<BiographySectionProps> = ({ title, biography, email, socialLinks }) => {
  const theme = useTheme();
  const [cursorCharacter, setCursorCharacter] = useState(null);

  useEffect(() => {
    const character = cursorInteractiveCharacter();
    setCursorCharacter(character);
    return () => {
      character.destroy();
    };
  }, []);

  return (
    <div className={`${styles.biographySection} ${$theme === 'dark' ? styles.dark : ''}`}
      role="region"
      aria-label="Biography and Contact Information"
    >
      <div className={styles.characterWrapper}>
        {cursorCharacter && <div className={styles.character} dangerouslySetInnerHTML={{ __html: cursorCharacter }} />}
      </div>
      <h1>{title}</h1>
      <div className={styles.biography}>{biography}</div>
      <div className={styles.contactSection}>
        <a href={`mailto:${email}`}>{email}</a>
        <div className={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiographySection;
