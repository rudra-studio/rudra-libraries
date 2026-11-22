import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export type TextAreaFieldThemeMode = "light" | "dark";

export interface TextAreaFieldProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: TextAreaFieldThemeMode;

  /**
   * Field label text.
   *
   * @translate
   */
  label?: string;

  /**
   * Placeholder text inside textarea.
   *
   * @translate
   */
  placeholder?: string;

  /**
   * Optional helper text shown alongside the character counter.
   *
   * @translate
   */
  helperText?: string;

  /**
   * Controlled textarea value.
   */
  value?: string;

  /**
   * Visible row count.
   */
  rows?: number;

  /**
   * Maximum allowed character length.
   */
  maxLength?: number;

  /**
   * Disable textarea interaction.
   *
   * @schema {"type":"boolean"}
   */
  disabled?: boolean;

  /**
   * Emits updated text value on change.
   */
  onChange?: (value: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function TextAreaField({
  themeMode = "light",
  label = "Notes or Description",
  placeholder = "Write details here...",
  helperText = "",
  value,
  rows = 4,
  maxLength = 500,
  disabled = false,
  onChange,
  className = "",
  ...props
}: TextAreaFieldProps) {
  const areaId = useId();
  const [internalVal, setInternalVal] = useState(value ?? "");
  const currentValue = value !== undefined ? value : internalVal;
  const limit = Math.max(10, Math.floor(Number(maxLength) || 500));
  const safeRows = Math.max(2, Math.floor(Number(rows) || 4));
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
        <label htmlFor={areaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        id={areaId}
        rows={safeRows}
        maxLength={limit}
        value={currentValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => {
          setInternalVal(e.target.value);
          onChange?.(e.target.value);
        }}
        className={styles.textarea}
      />
      <div className={styles.metaRow}>
        <span className={styles.helper}>{helperText}</span>
        <span className={styles.counter}>
          {currentValue.length}/{limit}
        </span>
      </div>
    </div>
  );
}
