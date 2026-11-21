import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import styles from './styles.module.scss';

export interface TextFieldProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @translate */
  placeholder?: string;
  /** @translate */
  helperText?: string;
  /** @translate */
  value?: string;
  /** @select|outlined|filled|standard */
  variant?: 'outlined' | 'filled' | 'standard';
  /** @select|small|medium */
  size?: 'small' | 'medium';
  /** @schema {"type":"boolean"} */
  multiline?: boolean;
  /** @schema {"type":"boolean"} */
  error?: boolean;
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onChange?: (value: string) => void;
}

export function TextField({
  themeMode = 'dark',
  label = 'Name',
  placeholder = 'Enter value',
  helperText = '',
  value = '',
  variant = 'outlined',
  size = 'medium',
  multiline = false,
  error = false,
  disabled = false,
  onChange,
}: TextFieldProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiTextField
        fullWidth
        label={label}
        placeholder={placeholder}
        helperText={helperText}
        value={value}
        variant={variant}
        size={size}
        multiline={multiline}
        error={error}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
export default TextField;
