import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export type TextInputFieldThemeMode = "light" | "dark";
export type TextInputKind = "text" | "email" | "tel" | "password" | "url";

export interface TextInputFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "className" | "type"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: TextInputFieldThemeMode;

  /**
   * Field label text.
   *
   * @translate
   */
  label?: string;

  /**
   * Input placeholder text.
   *
   * @translate
   */
  placeholder?: string;

  /**
   * Optional helper or validation hint text.
   *
   * @translate
   */
  helperText?: string;

  /**
   * Controlled input value.
   */
  value?: string;

  /**
   * HTML input type.
   *
   * @select|text|email|tel|password|url
   */
  inputType?: TextInputKind;

  /**
   * Mark field as required.
   *
   * @schema {"type":"boolean"}
   */
  required?: boolean;

  /**
   * Disable input interaction.
   *
   * @schema {"type":"boolean"}
   */
  disabled?: boolean;

  /**
   * Emits updated input value on change.
   */
  onChange?: (value: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function TextInputField({
  themeMode = "light",
  label = "Full Name",
  placeholder = "Enter your name",
  helperText = "",
  value,
  inputType = "text",
  required = false,
  disabled = false,
  onChange,
  className = "",
  ...props
}: TextInputFieldProps) {
  const inputId = useId();
  const [internalVal, setInternalVal] = useState(value ?? "");
  const currentValue = value !== undefined ? value : internalVal;
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
          {required && <span className={styles.req}> *</span>}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        type={inputType}
        value={currentValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-required={required}
        onChange={(e) => {
          setInternalVal(e.target.value);
          onChange?.(e.target.value);
        }}
        className={styles.input}
      />
      {helperText && <span className={styles.helper}>{helperText}</span>}
    </div>
  );
}
