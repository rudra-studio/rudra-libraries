import React, { useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type VirtualListThemeMode = "light" | "dark";

export interface VirtualListProps<T = Record<string, unknown>>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: VirtualListThemeMode;

  /**
   * List data items.
   */
  items?: T[];

  /**
   * Fixed height of each item in pixels.
   */
  itemHeight?: number;

  /**
   * Vertical gap between items in pixels.
   */
  gap?: number;

  /**
   * Viewport container height in pixels.
   */
  height?: number;

  /**
   * Number of extra items rendered outside the viewport.
   */
  overscan?: number;

  /**
   * Callback when a list item is clicked.
   */
  onItemClick?: (ctx: { item: T; index: number }) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: `Virtualized Row #${i + 1}`,
}));

export default function VirtualList<T = Record<string, unknown>>({
  themeMode = "light",
  items = DEFAULT_ITEMS as unknown as T[],
  itemHeight = 48,
  gap = 8,
  height = 240,
  overscan = 3,
  onItemClick,
  className = "w-full",
  ...props
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const safeItemHeight = Math.max(24, itemHeight);
  const safeGap = Math.max(0, gap);
  const stride = safeItemHeight + safeGap;
  const totalHeight = Math.max(0, items.length * stride - safeGap);

  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / stride) - overscan);
    const visibleCount = Math.ceil(height / stride) + overscan * 2;
    const end = Math.min(items.length, start + visibleCount);
    return {
      startIndex: start,
      endIndex: end,
      visibleItems: items.slice(start, end),
    };
  }, [scrollTop, stride, height, overscan, items]);

  return (
    <div
      {...props}
      ref={containerRef}
      data-theme={themeMode}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{ ...props.style, height: `${Math.max(120, height)}px` }}
      className={[styles.root, modeClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div style={{ height: `${totalHeight}px` }} className={styles.spacer}>
        {visibleItems.map((item, offsetIdx) => {
          const index = startIndex + offsetIdx;
          const record = item as Record<string, unknown>;
          const text =
            typeof record?.label === "string"
              ? record.label
              : typeof record?.title === "string"
                ? record.title
                : `Item ${index + 1}`;

          return (
            <div
              key={index}
              onClick={() => onItemClick?.({ item, index })}
              style={{
                height: `${safeItemHeight}px`,
                transform: `translateY(${index * stride}px)`,
              }}
              className={styles.row}
            >
              <span>{text}</span>
            </div>
          );
        })}
      </div>
      {endIndex === 0 && (
        <div className={styles.empty}>No items to display</div>
      )}
    </div>
  );
}
