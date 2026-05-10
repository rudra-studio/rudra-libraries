import styles from "./styles.module.scss";
import React from 'react';
export interface ButtonProps {
  ariaLabel: string;
  children: React.ReactNode;
  onClick: (event:  any) => void;
  className: string;
}

export default function Button({ariaLabel, children, onClick, className}: ButtonProps) {
  return <button aria-label={ariaLabel} className={className} onClick={onClick}>{children}</button>;
}
