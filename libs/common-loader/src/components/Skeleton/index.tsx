import React from "react";
import styles from "./styles.module.scss";

export type SkeletonVariant = "text" | "rectangle" | "circle";
export type SkeletonThemeMode = "light" | "dark";

export interface SkeletonProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  themeMode?: SkeletonThemeMode;
  variant?: SkeletonVariant;
  animated?: boolean;
  lines?: number;
  className?: string;
}

export default function Skeleton({
  themeMode = "light",
  variant = "rectangle",
  animated = true,
  lines = 1,
  className = "",
  ...props
}: SkeletonProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const lineCount =
    variant === "text" ? Math.max(1, Math.min(8, Math.floor(lines) || 1)) : 1;

  if (variant === "text" && lineCount > 1) {
    return (
      <div
        {...props}
        aria-hidden="true"
        data-theme={themeMode}
        className={[styles.stack, modeClass, className]
          .filter(Boolean)
          .join(" ")}
      >
        {Array.from({ length: lineCount }, (_, idx) => (
          <div
            key={idx}
            className={[
              styles.root,
              modeClass,
              "h-4 rounded",
              animated ? styles.animated : "",
              idx === lineCount - 1 ? "w-4/5" : "w-full",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
    );
  }

  const variantClass =
    variant === "circle"
      ? "size-12 rounded-full"
      : variant === "rectangle"
        ? "h-24 w-full rounded-lg"
        : "h-4 w-full rounded";

  return (
    <div
      {...props}
      aria-hidden="true"
      data-theme={themeMode}
      className={[
        styles.root,
        modeClass,
        variantClass,
        animated ? styles.animated : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
