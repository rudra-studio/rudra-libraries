import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export type SelectFieldThemeMode = "light" | "dark";

export interface SelectOptionItem {
  id: string;
  label: string;
}

export interface SelectFieldProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "className" | "value"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SelectFieldThemeMode;

  /**
   * Field label text.
   *
   * @translate
   */
  label?: string;

  /**
   * Optional helper text below the select box.
   *
   * @translate
   */
  helperText?: string;

  /**
   * Controlled selected option ID.
   */
  value?: string;

  /**
   * Available selectable options.
   */
  options?: SelectOptionItem[];

  /**
   * Disable the select field.
   *
   * @schema {"type":"boolean"}
   */
  disabled?: boolean;

  /**
   * Emits selected option ID on change.
   */
  onChange?: (value: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_OPTIONS: SelectOptionItem[] = [
  { id: "full_stack", label: "Full Stack Architecture" },
  { id: "ui_systems", label: "Reusable UI Libraries" },
  { id: "canvas_apps", label: "Visual Canvas Apps" },
];

export default function SelectField({
  themeMode = "light",
  label = "Category",
  helperText = "",
  value,
  options = DEFAULT_OPTIONS,
  disabled = false,
  onChange,
  className = "",
  ...props
}: SelectFieldProps) {
  const selectId = useId();
  const list =
    Array.isArray(options) && options.length > 0 ? options : DEFAULT_OPTIONS;
  const [internalVal, setInternalVal] = useState<string>(
    value ?? list[0]?.id ?? ""
  );
  const currentVal = value !== undefined ? value : internalVal;
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
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <select
        {...props}
        id={selectId}
        value={currentVal}
        disabled={disabled}
        onChange={(e) => {
          const next = String(e.target.value);
          setInternalVal(next);
          onChange?.(next);
        }}
        className={styles.select}
      >
        {list.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && <span className={styles.helper}>{helperText}</span>}
    </div>
  );
}
