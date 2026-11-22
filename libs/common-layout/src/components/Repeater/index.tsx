import React from "react";
import styles from "./styles.module.scss";

export type RepeaterThemeMode = "light" | "dark";
export type RepeaterLayout = "grid" | "stack" | "flex";

export interface RepeaterProps<T = Record<string, unknown>>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: RepeaterThemeMode;

  /**
   * Items to render repeatedly.
   */
  items?: T[];

  /**
   * Layout arrangement mode.
   *
   * @select|grid|stack|flex
   */
  layout?: RepeaterLayout;

  /**
   * Column count when layout is grid.
   */
  columns?: number;

  /**
   * Render function or static template node per item.
   */
  children?: ((ctx: { item: T; index: number }) => React.ReactNode) | React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_SAMPLE_ITEMS = [
  { id: 1, title: "Item One" },
  { id: 2, title: "Item Two" },
  { id: 3, title: "Item Three" },
];

export default function Repeater<T = Record<string, unknown>>({
  themeMode = "light",
  items = DEFAULT_SAMPLE_ITEMS as unknown as T[],
  layout = "grid",
  columns = 3,
  children,
  className = "gap-4",
  ...props
}: RepeaterProps<T>) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const safeCols = Math.max(1, Math.min(12, Math.floor(columns) || 3));

  const layoutClasses =
    layout === "stack"
      ? "flex flex-col"
      : layout === "flex"
        ? "flex flex-row flex-wrap"
        : "grid";

  const layoutStyle: React.CSSProperties =
    layout === "grid"
      ? { gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))` }
      : {};

  return (
    <div
      {...props}
      data-theme={themeMode}
      style={{ ...props.style, ...layoutStyle }}
      className={[styles.root, modeClass, "w-full", layoutClasses, className]
        .filter(Boolean)
        .join(" ")}
    >
      {items.length > 0 ? (
        items.map((item, index) => {
          if (typeof children === "function") {
            return (
              <React.Fragment key={index}>
                {(children as (ctx: { item: T; index: number }) => React.ReactNode)({
                  item,
                  index,
                })}
              </React.Fragment>
            );
          }

          if (children) {
            return <React.Fragment key={index}>{children}</React.Fragment>;
          }

          const record = item as Record<string, unknown>;
          const label =
            typeof record?.title === "string"
              ? record.title
              : `Item ${index + 1}`;

          return (
            <div key={index} className={styles.defaultCard}>
              <span>{label}</span>
            </div>
          );
        })
      ) : (
        <div className={styles.emptyState}>
          <span>No repeater items</span>
        </div>
      )}
    </div>
  );
}
