import React from "react";
import styles from "./styles.module.scss";

export type TimelineViewThemeMode = "light" | "dark";
export type TimelineViewOrientation = "vertical" | "horizontal";

export interface TimelineItemEntry {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  badge?: string;
}

export interface TimelineViewProps
  extends Omit<React.HTMLAttributes<HTMLOListElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: TimelineViewThemeMode;

  /**
   * Timeline layout orientation.
   *
   * @select|vertical|horizontal
   */
  orientation?: TimelineViewOrientation;

  /**
   * Chronological timeline items.
   */
  items?: TimelineItemEntry[];

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_TIMELINE: TimelineItemEntry[] = [
  {
    id: "t1",
    title: "Library Architecture",
    description: "Created reusable theme-aware UI components.",
    timestamp: "Step 01",
    badge: "Done",
  },
  {
    id: "t2",
    title: "Module Composition",
    description: "Wired components, props, and state inside Modules.",
    timestamp: "Step 02",
    badge: "Active",
  },
  {
    id: "t3",
    title: "Application Assembly",
    description: "Connected routes, data, and workflows for release.",
    timestamp: "Step 03",
    badge: "Next",
  },
];

export default function TimelineView({
  themeMode = "light",
  orientation = "vertical",
  items = DEFAULT_TIMELINE,
  className = "",
  ...props
}: TimelineViewProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const orientClass =
    orientation === "horizontal" ? styles.horizontal : styles.vertical;
  const list =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_TIMELINE;

  return (
    <ol
      {...props}
      data-theme={themeMode}
      className={[styles.list, modeClass, orientClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {list.map((entry, idx) => (
        <li key={entry.id || idx} className={styles.item}>
          <div className={styles.markerCol}>
            <span className={styles.dot} aria-hidden="true" />
            {idx < list.length - 1 && <span className={styles.connector} aria-hidden="true" />}
          </div>
          <div className={styles.content}>
            <div className={styles.metaRow}>
              {entry.timestamp && (
                <span className={styles.timestamp}>{entry.timestamp}</span>
              )}
              {entry.badge && <span className={styles.badge}>{entry.badge}</span>}
            </div>
            <div className={styles.title}>{entry.title}</div>
            {entry.description && (
              <p className={styles.desc}>{entry.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
