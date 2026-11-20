import styles from "./styles.module.scss";
import React from 'react';
import { Select as MuiSelect, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  '& .MuiSelect-select': {
    color: theme.palette.text.primary,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.action.active,
  },
}));

export interface SelectProps {
  /** @translate */
  label?: string;
  /** @translate @textarea */
  placeholder?: string;
  /** @hidden */
  disabled?: boolean;
  /** @select|one|two|three */
  options?: Array<{ id: string; label: string }>;
  /** @hidden */
  value?: string;
  /** @hidden */
  onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
  /** @hidden */
  inputRef?: React.Ref<HTMLInputElement>;
  /** @hidden */
  sx?: object;
  /** @hidden */
  'data-testid'?: string;
}

export function Select({
  label,
  placeholder,
  disabled,
  options = [],
  value,
  onChange,
  inputRef,
  sx,
  'data-testid': dataTestId,
}: SelectProps) {
  return (
    <StyledSelect
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      inputRef={inputRef}
      sx={sx}
      data-testid={dataTestId}
    >
      {options.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.label}
        </MenuItem>
      ))}
    </StyledSelect>
  );
}

export default Select;