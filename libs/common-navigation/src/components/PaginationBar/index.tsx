import React from "react";
import styles from "./styles.module.scss";

export type PaginationBarThemeMode = "light" | "dark";

export interface PaginationBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: PaginationBarThemeMode;

  /**
   * Current active page (1-based).
   */
  page?: number;

  /**
   * Total number of pages.
   */
  totalPages?: number;

  /**
   * Optional page size display count.
   */
  pageSize?: number;

  /**
   * Callback when page changes.
   */
  onPageChange?: (nextPage: number) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function PaginationBar({
  themeMode = "light",
  page = 1,
  totalPages = 5,
  pageSize = 10,
  onPageChange,
  className = "",
  ...props
}: PaginationBarProps) {
  const safeTotal = Math.max(1, Math.floor(Number(totalPages) || 1));
  const safePage = Math.min(
    Math.max(1, Math.floor(Number(page) || 1)),
    safeTotal
  );
  const safeSize = Math.max(1, Math.floor(Number(pageSize) || 10));
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const pages = Array.from({ length: safeTotal }, (_, i) => i + 1);

  return (
    <nav
      {...props}
      aria-label="Pagination"
      data-theme={themeMode}
      className={[styles.bar, modeClass, className].filter(Boolean).join(" ")}
    >
      <span className={styles.info}>
        Page {safePage} of {safeTotal} ({safeSize}/page)
      </span>

      <div className={styles.controls}>
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange?.(safePage - 1)}
          className={styles.btn}
        >
          Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === safePage ? "page" : undefined}
            onClick={() => onPageChange?.(p)}
            className={[styles.btn, p === safePage ? styles.active : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={safePage >= safeTotal}
          onClick={() => onPageChange?.(safePage + 1)}
          className={styles.btn}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
