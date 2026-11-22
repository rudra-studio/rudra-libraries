import React from "react";
import styles from "./styles.module.scss";

export type FeatureCardGridThemeMode = "light" | "dark";

export interface FeatureCardItem {
  id: string;
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  badge?: string;
}

export interface FeatureCardGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: FeatureCardGridThemeMode;

  /**
   * Eyebrow label above the section heading.
   *
   * @translate
   */
  kicker?: string;

  /**
   * Main section heading.
   *
   * @translate
   */
  heading?: string;

  /**
   * Supporting section subheading.
   *
   * @translate
   */
  subheading?: string;

  /**
   * Feature cards to display in the grid.
   */
  items?: FeatureCardItem[];

  /**
   * Optional action callback when a card CTA button is clicked.
   */
  onCardAction?: (item: FeatureCardItem) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_FEATURES: FeatureCardItem[] = [
  {
    id: "libraries",
    icon: "🧩",
    badge: "Code",
    title: "Reusable UI Libraries",
    description:
      "Author theme-aware React + TypeScript components with light and dark modes and clean prop schemas.",
    actionLabel: "Open Library",
  },
  {
    id: "modules",
    icon: "🎛️",
    badge: "Canvas",
    title: "Composable Modules",
    description:
      "Wire components, state, and workflows into self-contained building blocks across workspaces.",
    actionLabel: "Inspect Module",
  },
  {
    id: "applications",
    icon: "🚀",
    badge: "Ship",
    title: "Zero-Lock-In Applications",
    description:
      "Assemble routes, layouts, and data integrations with full ownership over generated structure.",
    actionLabel: "View App",
  },
];

export default function FeatureCardGrid({
  themeMode = "light",
  kicker = "CORE CAPABILITIES",
  heading = "Everything You Need for Modular Web Apps",
  subheading = "Compose structured sections, interactive blocks, and reusable UI primitives.",
  items = DEFAULT_FEATURES,
  onCardAction,
  className = "",
  ...props
}: FeatureCardGridProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const list =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_FEATURES;

  return (
    <section
      {...props}
      data-theme={themeMode}
      className={[styles.section, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.head}>
        {kicker && <span className={styles.kicker}>{kicker}</span>}
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {subheading && <p className={styles.sub}>{subheading}</p>}
      </div>

      <div className={styles.grid}>
        {list.map((item, idx) => (
          <article key={item.id || idx} className={styles.card}>
            <div className={styles.topRow}>
              {item.icon && (
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
            {item.actionLabel && (
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => onCardAction?.(item)}
              >
                {item.actionLabel} →
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
