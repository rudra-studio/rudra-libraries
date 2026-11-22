import React from "react";
import styles from "./styles.module.scss";

export type CoreNavbarThemeMode = "light" | "dark";

export interface CoreNavItem {
  id: string;
  label: string;
}

export interface CoreNavbarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: CoreNavbarThemeMode;

  /**
   * Brand or platform name.
   *
   * @translate
   */
  brandName?: string;

  /**
   * Optional subtitle or tagline.
   *
   * @translate
   */
  tagline?: string;

  /**
   * Brand icon or mark text.
   *
   * @translate
   */
  brandMark?: string;

  /**
   * Navigation items list.
   */
  navItems?: CoreNavItem[];

  /**
   * Currently active navigation item ID.
   */
  activeItemId?: string;

  /**
   * Callback when a navigation item is selected.
   */
  onSelectItem?: (itemId: string) => void;

  /**
   * Optional callback to toggle between light and dark mode.
   */
  onToggleTheme?: (nextTheme: CoreNavbarThemeMode) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_NAV_ITEMS: CoreNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "workflow", label: "How It Works" },
  { id: "templates", label: "Templates" },
];

export default function CoreNavbar({
  themeMode = "light",
  brandName = "Rudra App",
  tagline = "Modular Visual & Code Orchestration",
  brandMark = "✦",
  navItems = DEFAULT_NAV_ITEMS,
  activeItemId = "overview",
  onSelectItem,
  onToggleTheme,
  className = "",
  ...props
}: CoreNavbarProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const items =
    Array.isArray(navItems) && navItems.length > 0
      ? navItems
      : DEFAULT_NAV_ITEMS;
  const nextTheme: CoreNavbarThemeMode =
    themeMode === "dark" ? "light" : "dark";

  return (
    <header
      {...props}
      data-theme={themeMode}
      className={[styles.bar, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">
          {brandMark}
        </span>
        <div>
          <div className={styles.brandName}>{brandName}</div>
          {tagline && <div className={styles.tagline}>{tagline}</div>}
        </div>
      </div>

      <nav className={styles.nav} aria-label="Primary navigation">
        {items.map((item) => {
          const isActive = activeItemId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              className={`${styles.navBtn} ${isActive ? styles.activeBtn : ""}`}
              onClick={() => onSelectItem?.(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {onToggleTheme && (
        <button
          type="button"
          className={styles.themeBtn}
          aria-label={`Switch to ${nextTheme} mode`}
          onClick={() => onToggleTheme(nextTheme)}
        >
          {themeMode === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      )}
    </header>
  );
}
