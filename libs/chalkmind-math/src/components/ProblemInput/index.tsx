import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export interface ProblemInputProps {
  /** @translate @textarea */
  value?: string;

  /** @translate @textarea */
  placeholder?: string;

  /** @translate */
  label?: string;

  /** @translate */
  helperText?: string;

  disabled?: boolean;

  /** @widget|slider */
  rows?: number;

  /** @type|function|return:void|args:payload */
  onValueChange?: (payload: { value: string }) => void;

  /** @type|class */
  className?: string;
}

export default function ProblemInput({
  value,
  placeholder = "Type or paste any problem in mathematical notation or plain English",
  label = "Enter your problem",
  helperText = "You can enter arithmetic, algebra, geometry, calculus, statistics, proof, logic, engineering maths, or a word problem.",
  disabled = false,
  rows = 5,
  onValueChange,
  className = "",
}: ProblemInputProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value || "");
  const currentValue = value === undefined ? internalValue : value;

  const updateValue = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.({ value: next });
  };

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <textarea
        id={id}
        className={styles.textarea}
        value={currentValue}
        placeholder={placeholder}
        disabled={disabled}
        rows={Math.max(2, rows)}
        spellCheck
        onChange={(event) => updateValue(event.target.value)}
      />
      <p className={styles.helper}>{helperText}</p>
    </div>
  );
}
