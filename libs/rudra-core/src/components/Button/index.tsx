import React from 'react';
import styles from './styles.module.scss';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  additionalAttributes?: any; /* @type|json */
}

export default function Button({
  variant = 'primary',
  children,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  style,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
      case 'tertiary':
        return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
    >
      {leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
    </button>
  );
}