import React, { useRef, useState } from "react";
import styles from "./styles.module.scss";

export type CarouselThemeMode = "light" | "dark";
export type CarouselVariant = "inline-arrows" | "bottom-controls";
export type CarouselItemsPerView = "one" | "multiple" | "fractional";

export interface CarouselProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: CarouselThemeMode;

  /**
   * Control bar placement variant.
   *
   * @select|inline-arrows|bottom-controls
   */
  variant?: CarouselVariant;

  /**
   * Slide sizing preset.
   *
   * @select|one|multiple|fractional
   */
  itemsPerView?: CarouselItemsPerView;

  /**
   * Gap between slides in pixels.
   */
  gap?: number;

  /**
   * Slide elements to display.
   */
  children?: React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_SLIDES = ["Slide 1", "Slide 2", "Slide 3"];

export default function Carousel({
  themeMode = "light",
  variant = "inline-arrows",
  itemsPerView = "one",
  gap = 16,
  children,
  className = "w-full",
  ...props
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const slides = React.Children.toArray(children);
  const effectiveSlides =
    slides.length > 0
      ? slides
      : DEFAULT_SLIDES.map((label, idx) => (
          <div key={idx} className={styles.sampleSlide}>
            <span>{label}</span>
          </div>
        ));

  const scrollToSlide = (index: number) => {
    const count = effectiveSlides.length;
    if (count === 0) return;
    const wrapped = ((index % count) + count) % count;
    setActiveIndex(wrapped);
    const track = trackRef.current;
    if (track) {
      const slideWidth = track.clientWidth;
      track.scrollTo({
        left: wrapped * slideWidth,
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
          {effectiveSlides.map((slide, idx) => (
            <div
              key={idx}
              className={[styles.slide, slideBasisClass]
                .filter(Boolean)
                .join(" ")}
            >
              {slide}
            </div>
          ))}
        </div>

        {variant === "inline-arrows" && effectiveSlides.length > 1 && (
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

      {variant === "bottom-controls" && effectiveSlides.length > 1 && (
        <div className={styles.bottomControls}>
          <button
            type="button"
            onClick={() => scrollToSlide(activeIndex - 1)}
            className={styles.controlBtn}
          >
            Prev
          </button>
          <div className={styles.dots}>
            {effectiveSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => scrollToSlide(idx)}
                className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ""}`}
              />
            ))}
          </div>
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
