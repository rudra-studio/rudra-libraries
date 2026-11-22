import React, { useState } from "react";
import styles from "./styles.module.scss";

export type CheckboxGroupThemeMode = "light" | "dark";

export interface CheckboxOptionItem {
  id: string;
  label: string;
}

export interface CheckboxGroupProps
  extends Omit<
    React.HTMLAttributes<HTMLFieldSetElement>,
    "onChange" | "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: CheckboxGroupThemeMode;

  /**
   * Group legend label.
   *
   * @translate
   */
  label?: string;

  /**
   * Checkbox options to display.
   */
  options?: CheckboxOptionItem[];

  /**
   * Controlled array of selected option IDs.
   */
  selectedValues?: string[];

  /**
   * Emits updated selected option IDs on change.
   */
  onChange?: (selected: string[]) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_OPTIONS: CheckboxOptionItem[] = [
  { id: "react", label: "React & TypeScript" },
  { id: "go_api", label: "Go & Microservices" },
  { id: "postgres", label: "PostgreSQL & Docker" },
];

export default function CheckboxGroup({
  themeMode = "light",
  label = "Select Capabilities",
  options = DEFAULT_OPTIONS,
  selectedValues,
  onChange,
  className = "",
  ...props
}: CheckboxGroupProps) {
  const list =
    Array.isArray(options) && options.length > 0 ? options : DEFAULT_OPTIONS;
  const [internalSelected, setInternalSelected] = useState<string[]>(
    Array.isArray(selectedValues) ? selectedValues : ["react"]
  );
  const current = Array.isArray(selectedValues)
    ? selectedValues
    : internalSelected;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const toggleItem = (id: string) => {
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setInternalSelected(next);
    onChange?.(next);
  };

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
        {list.map((opt) => {
          const checked = current.includes(opt.id);
          return (
            <label key={opt.id} className={styles.item}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(opt.id)}
                className={styles.checkbox}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
