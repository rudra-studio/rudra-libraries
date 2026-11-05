import React from 'react';
import styles from './styles.module.scss';

interface SocialLink {
  icon: React.ReactNode;
  url: string;
}

const SocialLinks: React.FC<{ links: SocialLink[] }> = ({ links }) => {
  return (
    <div className={styles.socialLinks}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;