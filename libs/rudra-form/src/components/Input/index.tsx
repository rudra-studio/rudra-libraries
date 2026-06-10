import React from 'react';
import styles from './styles.module.scss';

export interface InputProps {
  label?: string; /* @translate */
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Input({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  leftIcon, 
  rightIcon, 
  className = '', 
  style, 
  children 
}: InputProps) {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
      {children}
    </div>
  );
}