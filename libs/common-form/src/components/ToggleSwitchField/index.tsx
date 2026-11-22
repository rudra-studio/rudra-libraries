import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export type ToggleSwitchFieldThemeMode = "light" | "dark";

export interface ToggleSwitchFieldProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ToggleSwitchFieldThemeMode;

  /**
   * Switch label text.
   *
   * @translate
   */
  label?: string;

  /**
   * Optional helper caption below the switch.
   *
   * @translate
   */
  helperText?: string;

  /**
   * Controlled checked state.
   *
   * @schema {"type":"boolean"}
   */
  checked?: boolean;

  /**
   * Disable switch toggle.
   *
   * @schema {"type":"boolean"}
   */
  disabled?: boolean;

  /**
   * Emits boolean checked state when toggled.
   */
  onChange?: (checked: boolean) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function ToggleSwitchField({
  themeMode = "light",
  label = "Enable Instant Notifications",
  helperText = "Receive real-time updates for workspace activity",
  checked,
  disabled = false,
  onChange,
  className = "",
  ...props
}: ToggleSwitchFieldProps) {
  const switchId = useId();
  const [internalChecked, setInternalChecked] = useState<boolean>(
    Boolean(checked)
  );
  const isChecked = checked !== undefined ? Boolean(checked) : internalChecked;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.row}>
        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleToggle}
          className={`${styles.track} ${isChecked ? styles.checked : ""}`}
        >
          <span className={styles.thumb} />
        </button>
        {label && (
          <label htmlFor={switchId} className={styles.label}>
            {label}
          </label>
        )}
      </div>
      {helperText && <span className={styles.helper}>{helperText}</span>}
    </div>
  );
}
