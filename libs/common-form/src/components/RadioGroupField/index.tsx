import React, { useState } from "react";
import styles from "./styles.module.scss";

export type RadioGroupFieldThemeMode = "light" | "dark";

export interface RadioOptionItem {
  id: string;
  label: string;
}

export interface RadioGroupFieldProps
  extends Omit<
    React.HTMLAttributes<HTMLFieldSetElement>,
    "onChange" | "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: RadioGroupFieldThemeMode;

  /**
   * Group legend label.
   *
   * @translate
   */
  label?: string;

  /**
   * Radio group name attribute.
   */
  name?: string;

  /**
   * Radio options list.
   */
  options?: RadioOptionItem[];

  /**
   * Controlled selected option ID.
   */
  value?: string;

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

const DEFAULT_OPTIONS: RadioOptionItem[] = [
  { id: "morning", label: "Morning Slot" },
  { id: "afternoon", label: "Afternoon Slot" },
  { id: "evening", label: "Evening Slot" },
];

export default function RadioGroupField({
  themeMode = "light",
  label = "Preferred Callback Window",
  name = "callback_window",
  options = DEFAULT_OPTIONS,
  value,
  onChange,
  className = "",
  ...props
}: RadioGroupFieldProps) {
  const list =
    Array.isArray(options) && options.length > 0 ? options : DEFAULT_OPTIONS;
  const [internalVal, setInternalVal] = useState<string>(
    value ?? list[0]?.id ?? ""
  );
  const currentVal = value !== undefined ? value : internalVal;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <fieldset
      {...props}
      data-theme={themeMode}
      className={[styles.fieldset, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label && <legend className={styles.legend}>{label}</legend>}
      <div className={styles.list}>
        {list.map((opt) => (
          <label key={opt.id} className={styles.item}>
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={currentVal === opt.id}
              onChange={() => {
                setInternalVal(opt.id);
                onChange?.(opt.id);
              }}
              className={styles.radio}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
