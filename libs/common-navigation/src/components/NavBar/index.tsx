import React from "react";
import styles from "./styles.module.scss";

export type NavBarThemeMode = "light" | "dark";

export interface NavBarItem {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
}

export interface NavBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: NavBarThemeMode;

  /**
   * Brand or application title.
   *
   * @translate
   */
  brandTitle?: string;

  /**
   * Optional short badge next to brand title.
   *
   * @translate
   */
  brandBadge?: string;

  /**
   * Top-level navigation links.
   */
  items?: NavBarItem[];

  /**
   * Optional call-to-action button text.
   *
   * @translate
   */
  ctaLabel?: string;

  /**
   * Callback when the CTA button is clicked.
   */
  onCtaClick?: () => void;

  /**
   * Root element customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_NAV_ITEMS: NavBarItem[] = [
  { id: "overview", label: "Overview", href: "#overview", active: true },
  { id: "modules", label: "Modules", href: "#modules", active: false },
  { id: "libraries", label: "Libraries", href: "#libraries", active: false },
  { id: "docs", label: "Docs", href: "#docs", active: false },
];

export default function NavBar({
  themeMode = "light",
  brandTitle = "Rudra Workspace",
  brandBadge = "v1",
  items = DEFAULT_NAV_ITEMS,
  ctaLabel = "New Module",
  onCtaClick,
  className = "",
  ...props
}: NavBarProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const navItems =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_NAV_ITEMS;

  return (
    <header
      {...props}
      data-theme={themeMode}
      className={[styles.header, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.brandGroup}>
        <span className={styles.brandTitle}>{brandTitle}</span>
        {brandBadge && <span className={styles.badge}>{brandBadge}</span>}
      </div>

      <nav aria-label="Primary navigation" className={styles.nav}>
        {navItems.map((item, idx) => (
          <a
            key={item.id || idx}
            href={item.href || "#"}
            aria-current={item.active ? "page" : undefined}
            className={[styles.link, item.active ? styles.active : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {ctaLabel && (
        <button type="button" onClick={onCtaClick} className={styles.cta}>
          {ctaLabel}
        </button>
      )}
    </header>
  );
}
