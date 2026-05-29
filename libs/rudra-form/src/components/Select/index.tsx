import React from 'react';
import styles from './styles.module.scss';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  className = '',
  style,
  children
}: SelectProps) {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        className={`${styles.select} ${error ? styles.selectError : ''}`}
        value={value}
        onChange={onChange}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
      {children}
    </div>
  );
}