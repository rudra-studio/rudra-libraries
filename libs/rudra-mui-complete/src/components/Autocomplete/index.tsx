import React from 'react';
import { Autocomplete as MuiAutocomplete, TextField } from '@mui/material';
import styles from './styles.module.scss';

export interface AutocompleteProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  label?: string;
  /** @translate */
  placeholder?: string;
  /** @type|json */
  options?: string[];
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onChange?: (value: string | null) => void;
}

const DEFAULT_OPTIONS = ['React', 'TypeScript', 'Material-UI', 'PostgreSQL', 'AWS'];

export function Autocomplete({
  themeMode = 'dark',
  label = 'Search',
  placeholder = 'Type to search...',
  options = DEFAULT_OPTIONS,
  disabled = false,
  onChange,
}: AutocompleteProps) {
  const list = Array.isArray(options) ? options : DEFAULT_OPTIONS;

  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiAutocomplete
        options={list}
        disabled={disabled}
        onChange={(_e, val) => onChange?.(val)}
        renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} />}
      />
    </div>
  );
}
export default Autocomplete;
