import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export type DateInputThemeMode = "light" | "dark";

export interface DateInputFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "className" | "type" | "value"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: DateInputThemeMode;

  /**
   * Field label text.
   *
   * @translate
   */
  label?: string;

  /**
   * Optional helper caption below input.
   *
   * @translate
   */
  helperText?: string;

  /**
   * Controlled ISO date string (YYYY-MM-DD).
   */
  value?: string;

  /**
   * Minimum selectable date (YYYY-MM-DD).
   */
  minDate?: string;

  /**
   * Maximum selectable date (YYYY-MM-DD).
   */
  maxDate?: string;

  /**
   * Disable date input.
   *
   * @schema {"type":"boolean"}
   */
  disabled?: boolean;

  /**
   * Emits date string on change.
   */
  onChange?: (dateStr: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function DateInputField({
  themeMode = "light",
  label = "Event Date",
  helperText = "Select a date in YYYY-MM-DD format",
  value,
  minDate = "",
  maxDate = "",
  disabled = false,
  onChange,
  className = "",
  ...props
}: DateInputFieldProps) {
  const inputId = useId();
  const [internalDate, setInternalDate] = useState(value ?? "2026-12-20");
  const currentDate = value !== undefined ? value : internalDate;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <div
      data-theme={themeMode}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        type="date"
        value={currentDate}
        min={minDate || undefined}
        max={maxDate || undefined}
        disabled={disabled}
        onChange={(e) => {
          const next = e.target.value;
          setInternalDate(next);
          onChange?.(next);
        }}
        className={styles.input}
      />
      {helperText && <span className={styles.helper}>{helperText}</span>}
    </div>
  );
}
