import React, { useState } from "react";
import styles from "./styles.module.scss";

export type TabStripThemeMode = "light" | "dark";
export type TabStripVariant = "underline" | "pills";

export interface TabStripTab {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

export interface TabStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: TabStripThemeMode;

  /**
   * Visual tab style.
   *
   * @select|underline|pills
   */
  variant?: TabStripVariant;

  /**
   * Available tabs in display order.
   */
  tabs?: TabStripTab[];

  /**
   * Controlled active tab ID.
   */
  activeId?: string;

  /**
   * Initial active tab ID when uncontrolled.
   */
  defaultActiveId?: string;

  /**
   * Callback when the selected tab changes.
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_TABS: TabStripTab[] = [
  { id: "preview", label: "Preview", badge: "Live" },
  { id: "code", label: "Code" },
  { id: "props", label: "Props", badge: "6" },
  { id: "history", label: "History", disabled: false },
];

export default function TabStrip({
  themeMode = "light",
  variant = "underline",
  tabs = DEFAULT_TABS,
  activeId,
  defaultActiveId,
  onTabChange,
  className = "",
  ...props
}: TabStripProps) {
  const list = Array.isArray(tabs) && tabs.length > 0 ? tabs : DEFAULT_TABS;
  const fallbackId = defaultActiveId || list[0]?.id || "";
  const [internalId, setInternalId] = useState(fallbackId);
  const currentId = activeId !== undefined ? activeId : internalId;

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const varClass = variant === "pills" ? styles.var_pills : styles.var_underline;

  const handleSelect = (tab: TabStripTab) => {
    if (tab.disabled) return;
    if (activeId === undefined) {
      setInternalId(tab.id);
    }
    onTabChange?.(tab.id);
  };

  return (
    <div
      {...props}
      role="tablist"
      aria-label="Tabs"
      data-theme={themeMode}
      className={[styles.bar, modeClass, varClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {list.map((tab, idx) => {
        const isActive = tab.id === currentId;
        return (
          <button
            key={tab.id || idx}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => handleSelect(tab)}
            className={[
              styles.tab,
              isActive ? styles.active : "",
              tab.disabled ? styles.disabled : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>{tab.label}</span>
            {tab.badge && <span className={styles.badge}>{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
