import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps } from '@mui/material';
import styles from './styles.module.scss';

export interface CheckboxProps extends MuiCheckboxProps {
  /** @translate */
  label?: string;

  /** @translate @hidden */
  tooltip?: string;

  /** @color */
  color?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';

  /** @icon @hidden */
  icon?: React.ReactNode;

  /** @icon @hidden */
  checkedIcon?: React.ReactNode;

  /** @schema {"type":"boolean"} */
  defaultChecked?: boolean;

  /** @schema {"type":"boolean"} */
  checked?: boolean;

  /** @nodeFunction */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export default function Checkbox({ label, tooltip, color, icon, checkedIcon, defaultChecked, checked, onChange, ...props }: CheckboxProps) {
  return (
    <div className={styles.checkboxWrapper} >
      <MuiCheckbox
        color={color}
        icon={icon}
        checkedIcon={checkedIcon}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        {...props}
      />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}