import './styles.module.scss';

// src/components/WelcomeCard/index.tsx
import React from 'react';

interface WelcomeCardProps {
  title: string;
  message: string;
  onCompletion: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ title, message, onCompletion }) => {
  return (
    <div className="welcome-card"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <h1>{title}</h1>
      <p>{message}</p>
      <button
        type="button"
        onClick={onCompletion}
        tabIndex={0}
        aria-label="Mark as complete"
      >
        Mark as complete
      </button>
    </div>
  );
};

export default WelcomeCard;