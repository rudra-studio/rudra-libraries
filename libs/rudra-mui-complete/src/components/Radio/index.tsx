import React from 'react';
import { Radio as MuiRadio, FormControlLabel } from '@mui/material';
import styles from './styles.module.scss';

export interface RadioProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @translate */
  name?: string;
  /** @translate */
  value?: string;
  /** @schema {"type":"boolean"} */
  checked?: boolean;
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onChange?: (value: string) => void;
}

export function Radio({
  themeMode = 'dark',
  label = 'Radio option',
  name = 'radio_group',
  value = 'option_1',
  checked = false,
  disabled = false,
  onChange,
}: RadioProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <FormControlLabel
        label={label}
        disabled={disabled}
        control={
          <MuiRadio
            name={name}
            value={value}
            checked={checked}
            onChange={(e) => onChange?.(e.target.value)}
          />
        }
      />
    </span>
  );
}
export default Radio;
