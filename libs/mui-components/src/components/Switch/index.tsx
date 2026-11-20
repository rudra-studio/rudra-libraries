import React from 'react';
import { Switch as MUISwitch, FormControlLabel } from '@mui/material';
import { Check } from '@mui/icons-material';
import styles from './styles.module.scss';

export interface SwitchProps {
  /** @translate */
  label?: string;

  /** @select|true|false */
  checked?: boolean;

  /** @translate @hidden */
  labelPlacement?: 'start' | 'end';

  /** @hidden */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

  /** @hidden */
  size?: 'small' | 'medium';

  /** @hidden */
  disabled?: boolean;

  /** @hidden */
  inputRef?: React.Ref<HTMLInputElement>;

  /** @hidden */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  /** @hidden */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;

  /** @hidden */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;

  /** @hidden */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;

  /** @hidden */
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;

  /** @hidden */
  className?: string;

  /** @hidden */
  style?: React.CSSProperties;
}

export function Switch({
  label = '',
  checked = false,
  labelPlacement = 'end',
  color = 'primary',
  size = 'medium',
  disabled = false,
  inputRef,
  inputProps,
  onChange,
  onClick,
  onFocus,
  onBlur,
  className,
  style,
}: SwitchProps) {
  return (
    <FormControlLabel
      className={`${styles.switch} ${className}`}
      control={<MUISwitch
        checked={checked}
        color={color}
        size={size}
        disabled={disabled}
        inputRef={inputRef}
        inputProps={inputProps}
        onChange={onChange}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className={styles.control}
      />}
      label={label}
      labelPlacement={labelPlacement}
      style={style}
    />
  );
}

export default Switch;