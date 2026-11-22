import React from "react";
import styles from "./styles.module.scss";

export type PulseDotsThemeMode = "light" | "dark";
export type PulseDotsSize = "sm" | "md" | "lg";

export interface PulseDotsProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  themeMode?: PulseDotsThemeMode;
  size?: PulseDotsSize;
  count?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
  dotClassName?: string;
  labelClassName?: string;
}

export default function PulseDots({
  themeMode = "light",
  size = "md",
  count = 3,
  label = "Loading...",
  showLabel = false,
  className = "",
  dotClassName = "",
  labelClassName = "",
  ...props
}: PulseDotsProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const dotCount = Math.max(2, Math.min(6, Math.floor(count) || 3));

  return (
    <div
      {...props}
      role="status"
      aria-label={label}
      data-theme={themeMode}
      className={[
        styles.root,
        modeClass,
        styles[`size_${size}`],
        "inline-flex items-center gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true" className={styles.dots}>
        {Array.from({ length: dotCount }, (_, idx) => (
          <span
            key={idx}
            style={{ animationDelay: `${idx * 0.15}s` }}
            className={[styles.dot, dotClassName].filter(Boolean).join(" ")}
          />
        ))}
      </span>

      {showLabel && (
        <span className={[styles.label, "text-sm", labelClassName].filter(Boolean).join(" ")}>
          {label}
        </span>
      )}
    </div>
  );
}
