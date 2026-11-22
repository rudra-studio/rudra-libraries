import React, { useState } from "react";
import styles from "./styles.module.scss";

export type SideNavThemeMode = "light" | "dark";

export interface SideNavItem {
  id: string;
  label: string;
  badge?: string;
  active?: boolean;
  icon?: string;
}

export interface SideNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SideNavThemeMode;

  /**
   * Optional sidebar title.
   *
   * @translate
   */
  title?: string;

  /**
   * Sidebar navigation entries.
   */
  items?: SideNavItem[];

  /**
   * Allow collapsing the sidebar width.
   *
   * @schema {"type":"boolean"}
   */
  collapsible?: boolean;

  /**
   * Initial collapsed state.
   *
   * @schema {"type":"boolean"}
   */
  defaultCollapsed?: boolean;

  /**
   * Callback when an item is selected.
   */
  onSelectItem?: (id: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_SIDE_ITEMS: SideNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊", active: true },
  { id: "components", label: "Components", icon: "🧩", badge: "12" },
  { id: "workflows", label: "Workflows", icon: "⚡" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export default function SideNav({
  themeMode = "light",
  title = "Navigation",
  items = DEFAULT_SIDE_ITEMS,
  collapsible = true,
  defaultCollapsed = false,
  onSelectItem,
  className = "",
  ...props
}: SideNavProps) {
  const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const list =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_SIDE_ITEMS;

  return (
    <nav
      {...props}
      aria-label={title || "Sidebar navigation"}
      data-theme={themeMode}
      className={[
        styles.nav,
        modeClass,
        collapsed ? styles.collapsed : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.top}>
        {!collapsed && <span className={styles.title}>{title}</span>}
        {collapsible && (
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((prev) => !prev)}
            className={styles.toggleBtn}
          >
            {collapsed ? "→" : "←"}
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {list.map((item, idx) => (
          <li key={item.id || idx}>
            <button
              type="button"
              onClick={() => onSelectItem?.(item.id)}
              aria-current={item.active ? "page" : undefined}
              className={[styles.itemBtn, item.active ? styles.active : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {item.icon && (
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {!collapsed && <span className={styles.label}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className={styles.badge}>{item.badge}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
