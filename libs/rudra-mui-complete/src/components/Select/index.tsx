import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';
import styles from './styles.module.scss';

export interface SelectOptionItem {
  id: string;
  label: string;
}

export interface SelectProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @translate */
  helperText?: string;
  /** @translate */
  value?: string;
  /** @type|json */
  options?: SelectOptionItem[];
  /** @select|small|medium */
  size?: 'small' | 'medium';
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onChange?: (value: string) => void;
}

const DEFAULT_OPTIONS: SelectOptionItem[] = [
  { id: 'option_1', label: 'Option 1' },
  { id: 'option_2', label: 'Option 2' },
];

export function Select({
  themeMode = 'dark',
  label = 'Select',
  helperText = '',
  value = 'option_1',
  options = DEFAULT_OPTIONS,
  size = 'medium',
  disabled = false,
  onChange,
}: SelectProps) {
  const list = Array.isArray(options) && options.length > 0 ? options : DEFAULT_OPTIONS;
  const labelId = React.useId();

  return (
    <div data-theme={themeMode} className={styles.root}>
      <FormControl fullWidth size={size} disabled={disabled}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <MuiSelect
          labelId={labelId}
          label={label}
          value={value}
          onChange={(e) => onChange?.(String(e.target.value))}
        >
          {list.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              {opt.label}
            </MenuItem>
          ))}
        </MuiSelect>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
export default Select;
