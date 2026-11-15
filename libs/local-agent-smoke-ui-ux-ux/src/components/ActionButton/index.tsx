import "./styles.module.scss";
import React, { useState } from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='action-button'
    >
      {label}
    </button>
  );
};

export default ActionButton;