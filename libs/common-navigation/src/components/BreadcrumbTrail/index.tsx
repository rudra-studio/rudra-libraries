import React from "react";
import styles from "./styles.module.scss";

export type BreadcrumbTrailThemeMode = "light" | "dark";
export type BreadcrumbSeparator = "/" | ">";

export interface BreadcrumbTrailItem {
  id: string;
  label: string;
  href?: string;
}

export interface BreadcrumbTrailProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: BreadcrumbTrailThemeMode;

  /**
   * Path segments in order from root to current page.
   */
  items?: BreadcrumbTrailItem[];

  /**
   * Separator character between crumbs.
   *
   * @select|/|&gt;
   */
  separator?: BreadcrumbSeparator;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_BREADCRUMBS: BreadcrumbTrailItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "libraries", label: "Libraries", href: "#libraries" },
  { id: "common-navigation", label: "common-navigation" },
];

export default function BreadcrumbTrail({
  themeMode = "light",
  items = DEFAULT_BREADCRUMBS,
  separator = "/",
  className = "",
  ...props
}: BreadcrumbTrailProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const crumbs =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_BREADCRUMBS;

  return (
    <nav
      {...props}
      aria-label="Breadcrumb"
      data-theme={themeMode}
      className={[styles.nav, modeClass, className].filter(Boolean).join(" ")}
    >
      <ol className={styles.list}>
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={crumb.id || idx} className={styles.item}>
              {isLast ? (
                <span aria-current="page" className={styles.current}>
                  {crumb.label}
                </span>
              ) : (
                <a href={crumb.href || "#"} className={styles.link}>
                  {crumb.label}
                </a>
              )}
              {!isLast && (
                <span aria-hidden="true" className={styles.sep}>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
