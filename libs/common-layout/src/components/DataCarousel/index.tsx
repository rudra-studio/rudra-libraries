import React, { useRef, useState } from "react";
import styles from "./styles.module.scss";

export type DataCarouselThemeMode = "light" | "dark";
export type DataCarouselVariant = "inline-arrows" | "bottom-controls";
export type DataCarouselItemsPerView = "one" | "multiple" | "fractional";

export interface DataCarouselProps<T = Record<string, unknown>>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: DataCarouselThemeMode;

  /**
   * Control placement variant.
   *
   * @select|inline-arrows|bottom-controls
   */
  variant?: DataCarouselVariant;

  /**
   * Slide width preset.
   *
   * @select|one|multiple|fractional
   */
  itemsPerView?: DataCarouselItemsPerView;

  /**
   * Gap between slides in pixels.
   */
  gap?: number;

  /**
   * Array of data items to render into slides.
   */
  items?: T[];

  /**
   * Render function or static slide node per item.
   */
  children?: ((ctx: { item: T; index: number }) => React.ReactNode) | React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_DATA_ITEMS = [
  { id: "1", title: "Card Alpha" },
  { id: "2", title: "Card Beta" },
  { id: "3", title: "Card Gamma" },
];

export default function DataCarousel<T = Record<string, unknown>>({
  themeMode = "light",
  variant = "inline-arrows",
  itemsPerView = "one",
  gap = 16,
  items = DEFAULT_DATA_ITEMS as unknown as T[],
  children,
  className = "w-full",
  ...props
}: DataCarouselProps<T>) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) {
    return null;
  }

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const scrollToSlide = (index: number) => {
    const count = items.length;
    const wrapped = ((index % count) + count) % count;
    setActiveIndex(wrapped);
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: wrapped * trackRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const slideBasisClass =
    itemsPerView === "multiple"
      ? "basis-1/2 md:basis-1/3"
      : itemsPerView === "fractional"
        ? "basis-4/5 md:basis-2/3"
        : "basis-full";

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.viewport}>
        <div
          ref={trackRef}
          style={{ gap: `${Math.max(0, gap)}px` }}
          className={styles.track}
        >
          {items.map((item, index) => {
            const record = item as Record<string, unknown>;
            const fallbackLabel =
              typeof record?.title === "string"
                ? record.title
                : `Item ${index + 1}`;

            const rendered =
              typeof children === "function"
                ? (children as (ctx: { item: T; index: number }) => React.ReactNode)({
                    item,
                    index,
                  })
                : children || (
                    <div className={styles.sampleSlide}>
                      <span>{fallbackLabel}</span>
                    </div>
                  );

            return (
              <div
                key={index}
                className={[styles.slide, slideBasisClass]
                  .filter(Boolean)
                  .join(" ")}
              >
                {rendered}
              </div>
            );
          })}
        </div>

        {variant === "inline-arrows" && items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => scrollToSlide(activeIndex - 1)}
              className={`${styles.arrowBtn} ${styles.prevBtn}`}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => scrollToSlide(activeIndex + 1)}
              className={`${styles.arrowBtn} ${styles.nextBtn}`}
            >
              ›
            </button>
          </>
        )}
      </div>

      {variant === "bottom-controls" && items.length > 1 && (
        <div className={styles.bottomControls}>
          <button
            type="button"
            onClick={() => scrollToSlide(activeIndex - 1)}
            className={styles.controlBtn}
          >
            Prev
          </button>
          <span className={styles.counter}>
            {activeIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => scrollToSlide(activeIndex + 1)}
            className={styles.controlBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
