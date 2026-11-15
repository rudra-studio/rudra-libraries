import React, { useState, useEffect, useRef } from 'react';
import './styles.module.scss';

interface ResumeLinkProps {
  url: string;
  text?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ResumeLink: React.FC<ResumeLinkProps> = ({ url, text = 'Download Resume', disabled = false, onClick }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !disabled) {
        onClick && onClick(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClick, disabled]);

  return (
    <a
      ref={linkRef}
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={`resume-link ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      tabIndex={disabled ? -1 : 0}
    >
      {text}
    </a>
  );
};

export default ResumeLink;