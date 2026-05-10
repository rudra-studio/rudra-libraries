import styles from "./styles.module.scss";
import React from 'react';
export interface ButtonProps {
  ariaLabel: string;
  text: string;
  onClick: (event:  any) => void;
  className: string;
}

export default function Button({ariaLabel = "Button", text = "Button", onClick, className = "text-3xl"}: ButtonProps) {
  return <button aria-label={ariaLabel} className={className} onClick={onClick}>{text}</button>;
}
