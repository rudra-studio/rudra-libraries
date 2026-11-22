import React from "react";
import styles from "./styles.module.scss";

export type FormContainerThemeMode = "light" | "dark";

export interface FormContainerProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "className" | "title" | "onSubmit" | "onReset"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: FormContainerThemeMode;

  /**
   * Form heading text.
   *
   * @translate
   */
  title?: string;

  /**
   * Supporting description copy.
   *
   * @translate
   */
  description?: string;

  /**
   * Submit button label.
   *
   * @translate
   */
  submitLabel?: string;

  /**
   * Reset button label.
   *
   * @translate
   */
  resetLabel?: string;

  /**
   * Show the reset button alongside submit.
   *
   * @schema {"type":"boolean"}
   */
  showReset?: boolean;

  /**
   * Callback invoked when the form is submitted.
   */
  onSubmit?: () => void;

  /**
   * Callback invoked when the form is reset.
   */
  onReset?: () => void;

  /**
   * Form body fields or child elements.
   */
  children?: React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function FormContainer({
  themeMode = "light",
  title = "Workspace Intake Form",
  description = "Fill out the fields below and submit your changes.",
  submitLabel = "Submit",
  resetLabel = "Reset",
  showReset = true,
  onSubmit,
  onReset,
  children,
  className = "",
  ...props
}: FormContainerProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.();
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <form
      {...props}
      data-theme={themeMode}
      onSubmit={handleSubmit}
      onReset={handleReset}
      className={[styles.form, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {(title || description) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.desc}>{description}</p>}
        </div>
      )}

      <div className={styles.body}>
        {children || (
          <div className={styles.sampleBody}>
            <span>Compose form fields inside FormContainer</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {showReset && (
          <button type="reset" className={styles.resetBtn}>
            {resetLabel}
          </button>
        )}
        <button type="submit" className={styles.submitBtn}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
