import styles from "./styles.module.scss";
import React from 'react';
export interface ButtonProps {
  ariaLabel: string;
  text: string;
  onClick: (event:  any) => void;
  className: string;
}

export default function Button({ariaLabel, text, onClick, className }: ButtonProps) {
  return <button aria-label={ariaLabel} className={`${styles.btn} text-4xl ${className}`} onClick={onClick}>{text}</button>;
  
}
