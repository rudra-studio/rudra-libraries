import React from 'react';
import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import styles from './styles.module.scss';

export interface CheckboxProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @schema {"type":"boolean"} */
  checked?: boolean;
  /** @select|primary|secondary|success|error|info|warning */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /** @select|small|medium */
  size?: 'small' | 'medium';
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onChange?: (checked: boolean) => void;
}

export function Checkbox({
  themeMode = 'dark',
  label = 'Checkbox',
  checked = false,
  color = 'primary',
  size = 'medium',
  disabled = false,
  onChange,
}: CheckboxProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <FormControlLabel
        label={label}
        disabled={disabled}
        control={
          <MuiCheckbox
            checked={checked}
            color={color}
            size={size}
            onChange={(e) => onChange?.(e.target.checked)}
          />
        }
      />
    </span>
  );
}
export default Checkbox;
