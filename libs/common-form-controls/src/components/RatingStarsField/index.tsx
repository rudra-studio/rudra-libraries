import React, { useState } from "react";
import styles from "./styles.module.scss";

export type RatingStarsThemeMode = "light" | "dark";

export interface RatingStarsFieldProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: RatingStarsThemeMode;

  /**
   * Rating field label.
   *
   * @translate
   */
  label?: string;

  /**
   * Number of stars (1 to 10).
   */
  maxStars?: number;

  /**
   * Controlled star rating value.
   */
  rating?: number;

  /**
   * Lock stars to read-only display.
   *
   * @schema {"type":"boolean"}
   */
  readOnly?: boolean;

  /**
   * Emits selected rating number when clicked.
   */
  onChange?: (nextRating: number) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function RatingStarsField({
  themeMode = "light",
  label = "Rate Experience",
  maxStars = 5,
  rating,
  readOnly = false,
  onChange,
  className = "",
  ...props
}: RatingStarsFieldProps) {
  const count = Math.max(1, Math.min(10, Math.floor(Number(maxStars) || 5)));
  const [internalRating, setInternalRating] = useState<number>(
    rating !== undefined ? Number(rating) || 0 : 4
  );
  const currentRating =
    rating !== undefined ? Number(rating) || 0 : internalRating;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const selectStar = (val: number) => {
    if (readOnly) return;
    setInternalRating(val);
    onChange?.(val);
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, className].filter(Boolean).join(" ")}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.row}>
        <div className={styles.stars} role="group" aria-label={label || "Star rating"}>
          {Array.from({ length: count }, (_, idx) => {
            const starVal = idx + 1;
            const active = starVal <= currentRating;
            return (
              <button
                key={starVal}
                type="button"
                disabled={readOnly}
                aria-pressed={active}
                aria-label={`${starVal} of ${count} stars`}
                onClick={() => selectStar(starVal)}
                className={[styles.starBtn, active ? styles.active : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                {active ? "★" : "☆"}
              </button>
            );
          })}
        </div>
        <span className={styles.score}>
          {currentRating}/{count}
        </span>
      </div>
    </div>
  );
}
