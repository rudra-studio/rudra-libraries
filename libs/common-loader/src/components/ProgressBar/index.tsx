import React from "react";
import styles from "./styles.module.scss";

export type ProgressBarThemeMode = "light" | "dark";

export interface ProgressBarProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className"
  > {
  themeMode?: ProgressBarThemeMode;
  value?: number;
  min?: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
  labelClassName?: string;
}

export default function ProgressBar({
  themeMode = "light",
  value = 65,
  min = 0,
  max = 100,
  showLabel = true,
  label,
  className = "",
  trackClassName = "",
  progressClassName = "",
  labelClassName = "",
  ...props
}: ProgressBarProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax =
    Number.isFinite(max) && max > safeMin ? max : safeMin + 100;

  const safeValue = Math.min(
    Math.max(Number.isFinite(value) ? value : safeMin, safeMin),
    safeMax
  );

  const percentage = ((safeValue - safeMin) / (safeMax - safeMin)) * 100;
  const roundedPercentage = Math.round(percentage);
  const displayLabel = label ?? `${roundedPercentage}%`;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {showLabel && (
        <div
          className={[
            styles.labelRow,
            "mb-1.5 flex items-center justify-between text-sm",
            labelClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{displayLabel}</span>
          {label && <span>{roundedPercentage}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={safeMin}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        aria-label={label || "Progress"}
        className={[
          styles.track,
          "h-2 w-full overflow-hidden rounded-full",
          trackClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            styles.fill,
            "h-full rounded-full",
            progressClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            transform: `scaleX(${percentage / 100})`,
            transformOrigin: "left center",
          }}
        />
      </div>
    </div>
  );
}
