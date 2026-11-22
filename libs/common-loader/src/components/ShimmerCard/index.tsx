import React from "react";
import styles from "./styles.module.scss";

export type ShimmerCardThemeMode = "light" | "dark";

export interface ShimmerCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  themeMode?: ShimmerCardThemeMode;
  showAvatar?: boolean;
  showMedia?: boolean;
  lines?: number;
  animated?: boolean;
  label?: string;
  className?: string;
}

export default function ShimmerCard({
  themeMode = "light",
  showAvatar = true,
  showMedia = false,
  lines = 3,
  animated = true,
  label = "Loading card content",
  className = "",
  ...props
}: ShimmerCardProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const animClass = animated ? styles.animated : "";
  const lineCount = Math.max(1, Math.min(6, Math.floor(lines) || 3));

  return (
    <div
      {...props}
      role="status"
      aria-label={label}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {showMedia && (
        <div className={[styles.block, styles.media, animClass].filter(Boolean).join(" ")} />
      )}

      {showAvatar && (
        <div className={styles.headerRow}>
          <div className={[styles.block, styles.avatar, animClass].filter(Boolean).join(" ")} />
          <div className={styles.headerLines}>
            <div className={[styles.block, styles.titleLine, animClass].filter(Boolean).join(" ")} />
            <div className={[styles.block, styles.subLine, animClass].filter(Boolean).join(" ")} />
          </div>
        </div>
      )}

      <div className={styles.bodyLines}>
        {Array.from({ length: lineCount }, (_, idx) => (
          <div
            key={idx}
            className={[
              styles.block,
              styles.bodyLine,
              animClass,
              idx === lineCount - 1 ? styles.shortLine : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
