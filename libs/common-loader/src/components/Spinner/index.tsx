import React from "react";
import styles from "./styles.module.scss";

export type SpinnerThemeMode = "light" | "dark";
export type SpinnerVariant = "ring" | "dots" | "bars";

export interface SpinnerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  themeMode?: SpinnerThemeMode;
  variant?: SpinnerVariant;
  label?: string;
  showLabel?: boolean;
  className?: string;
  labelClassName?: string;
}

export default function Spinner({
  themeMode = "light",
  variant = "ring",
  label = "Loading",
  showLabel = false,
  className = "",
  labelClassName = "",
  ...props
}: SpinnerProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <div
      {...props}
      role="status"
      aria-label={label}
      data-theme={themeMode}
      className={[styles.root, modeClass, "inline-flex items-center gap-2"]
        .filter(Boolean)
        .join(" ")}
    >
      {variant === "dots" ? (
        <span
          aria-hidden="true"
          className={[styles.dots, className].filter(Boolean).join(" ")}
        >
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
      ) : variant === "bars" ? (
        <span
          aria-hidden="true"
          className={[styles.bars, className].filter(Boolean).join(" ")}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className={[
            styles.ring,
            "size-6 rounded-full border-2",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}

      {showLabel && (
        <span
          className={[styles.label, "text-sm", labelClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </span>
      )}
    </div>
  );
}
