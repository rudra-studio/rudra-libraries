import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import styles from './styles.module.scss';

export interface ButtonProps extends MuiButtonProps {
  /** @translate */
  label: string;

  /** @optional @hidden */
  analyticsId?: string;

  /** @select|primary|secondary|tertiary */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /** @select|small|medium|large */
  size?: 'small' | 'medium' | 'large';

  /** @type|function */
  onClick?: () => void;
}

export default function Button({
  label,
  analyticsId,
  variant = 'primary',
  size = 'medium',
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <MuiButton
      className={styles.button}
      variant={variant}
      size={size}
      onClick={onClick}
      data-analytics-id={analyticsId}
      {...rest}
    >
      {label}
    </MuiButton>
  );
}