import React from 'react';
import styles from './index.module.scss';

interface ResumeLinkProps {
  url: string;
  label: string;
  theme: 'light' | 'dark' | 'system';
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ResumeLink: React.FC<ResumeLinkProps> = ({ url, label, theme, onClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === 'Enter') {
      onClick?.(event);
    }
  };

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={`${styles.resumeLink} ${theme === 'dark' ? styles.dark : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='button'
      aria-label={label}
    >
      {label}
    </a>
  );
};

export default ResumeLink;