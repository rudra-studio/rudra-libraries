import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export type SearchInputBoxThemeMode = "light" | "dark";

export interface SearchInputBoxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "className" | "type"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SearchInputBoxThemeMode;

  /**
   * Field label text.
   *
   * @translate
   */
  label?: string;

  /**
   * Placeholder text inside search field.
   *
   * @translate
   */
  placeholder?: string;

  /**
   * Controlled search value.
   */
  value?: string;

  /**
   * Show clear button when search query is non-empty.
   *
   * @schema {"type":"boolean"}
   */
  showClear?: boolean;

  /**
   * Emits search string whenever input changes or clears.
   */
  onSearchChange?: (query: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function SearchInputBox({
  themeMode = "light",
  label = "Search",
  placeholder = "Search items, tags, or names...",
  value,
  showClear = true,
  onSearchChange,
  className = "",
  ...props
}: SearchInputBoxProps) {
  const inputId = useId();
  const [internalQuery, setInternalQuery] = useState(value ?? "");
  const query = value !== undefined ? value : internalQuery;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const updateQuery = (next: string) => {
    if (value === undefined) {
      setInternalQuery(next);
    }
    onSearchChange?.(next);
  };

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
      <div className={styles.inputBox}>
        <span className={styles.icon} aria-hidden="true">
          🔍
        </span>
        <input
          {...props}
          id={inputId}
          type="search"
          value={query}
          placeholder={placeholder}
          onChange={(e) => updateQuery(e.target.value)}
          className={styles.input}
        />
        {showClear && query.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => updateQuery("")}
            className={styles.clearBtn}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
