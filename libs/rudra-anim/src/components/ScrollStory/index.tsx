"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type UIEvent,
} from "react";

import {
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import 
  ScrollStoryContext, {
  SCROLL_STORY_NAVIGATE_EVENT,
  type ScrollSectionAlignment,
  type ScrollStoryNavigateDetail,
  type ScrollStoryRange,
  type ScrollToSectionOptions,
} from "../ScrollStoryContext";

export type ScrollEasing =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "smoothstep";

export interface ScrollStoryProps {
  /**
   * Unique ID used when navigation links are
   * rendered outside ScrollStory.
   */
  storyId: string;

  /**
   * Optional fixed story height.
   *
   * When omitted, height is calculated from the
   * number of registered ScrollChapter components.
   */
  heightVh?: number;

  /**
   * Scroll distance allocated to each chapter.
   */
  sectionHeightVh?: number;

  viewportHeight?: string | number;

  scene: ReactNode;
  children?: ReactNode;

  className?: string;

  viewportStyle?: CSSProperties;
  style?: CSSProperties;
  stickyStyle?: CSSProperties;

  ariaLabel?: string;

  reducedMotion?: "start" | "end" | "allow";
  hideScrollbar?: boolean;

  /**
   * Default behaviour for section navigation.
   */
  smoothScroll?: boolean;
  updateHash?: boolean;

  onActiveSectionChange?: (
    sectionId: string | null,
  ) => void;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getTargetProgress(
  range: ScrollStoryRange,
  align: ScrollSectionAlignment,
): number {
  const [start, end] = range;

  switch (align) {
    case "start":
      return start;

    case "end":
      return end;

    case "center":
    default:
      return start + (end - start) / 2;
  }
}

export default function ScrollStory({
  storyId,
  heightVh,
  sectionHeightVh = 110,
  viewportHeight = "100vh",
  scene,
  children,
  className,
  viewportStyle,
  style,
  stickyStyle,
  ariaLabel = "Scroll-controlled visual story",
  reducedMotion = "allow",
  hideScrollbar = true,
  smoothScroll = true,
  updateHash = true,
  onActiveSectionChange,
}: ScrollStoryProps) {
  const viewportRef =
    useRef<HTMLDivElement>(null);

  const sectionsRef = useRef(
    new Map<string, ScrollStoryRange>(),
  );

  const initialHashHandledRef =
    useRef(false);

  const [sectionsVersion, setSectionsVersion] =
    useState(0);

  const [
    activeSectionId,
    setActiveSectionId,
  ] = useState<string | null>(null);

  const progress = useMotionValue(0);

  const prefersReducedMotion = Boolean(
    useReducedMotion(),
  );

  const registerSection = useCallback(
    (
      sectionId: string,
      range: ScrollStoryRange,
    ) => {
      sectionsRef.current.set(sectionId, range);

      setSectionsVersion(
        (currentVersion) =>
          currentVersion + 1,
      );

      return () => {
        sectionsRef.current.delete(sectionId);

        setSectionsVersion(
          (currentVersion) =>
            currentVersion + 1,
        );
      };
    },
    [],
  );

  const findActiveSection = useCallback(
    (
      currentProgress: number,
    ): string | null => {
      const sections = [
        ...sectionsRef.current.entries(),
      ].sort(
        ([, firstRange], [, secondRange]) =>
          firstRange[0] - secondRange[0],
      );

      if (sections.length === 0) {
        return null;
      }

      for (
        let index = 0;
        index < sections.length;
        index += 1
      ) {
        const [
          sectionId,
          [start, end],
        ] = sections[index];

        const isLast =
          index === sections.length - 1;

        const insideRange =
          currentProgress >= start &&
          (currentProgress < end ||
            (isLast &&
              currentProgress <= end));

        if (insideRange) {
          return sectionId;
        }
      }

      let closestSection = sections[0];
      let closestDistance =
        Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const [, [start, end]] = section;

        const centre =
          start + (end - start) / 2;

        const distance = Math.abs(
          currentProgress - centre,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      }

      return closestSection[0];
    },
    [],
  );

  const updateProgress = useCallback(
    (
      viewport: HTMLDivElement,
    ) => {
      if (
        prefersReducedMotion &&
        reducedMotion !== "allow"
      ) {
        const fixedProgress =
          reducedMotion === "end" ? 1 : 0;

        progress.set(fixedProgress);

        const nextSection =
          findActiveSection(
            fixedProgress,
          );

        setActiveSectionId(nextSection);

        return;
      }

      const scrollableDistance = Math.max(
        1,
        viewport.scrollHeight -
          viewport.clientHeight,
      );

      const nextProgress = clamp01(
        viewport.scrollTop /
          scrollableDistance,
      );

      progress.set(nextProgress);

      const nextSection =
        findActiveSection(nextProgress);

      setActiveSectionId(
        (currentSection) => {
          if (
            currentSection === nextSection
          ) {
            return currentSection;
          }

          onActiveSectionChange?.(
            nextSection,
          );

          return nextSection;
        },
      );
    },
    [
      findActiveSection,
      onActiveSectionChange,
      prefersReducedMotion,
      progress,
      reducedMotion,
    ],
  );

  const scrollToSection = useCallback(
    (
      sectionId: string,
      options: ScrollToSectionOptions = {},
    ) => {
      const viewport =
        viewportRef.current;

      const range =
        sectionsRef.current.get(
          sectionId,
        );

      if (!viewport || !range) {
        return;
      }

      const align =
        options.align ?? "center";

      const behavior =
        options.behavior ??
        (smoothScroll ? "smooth" : "auto");

      const shouldUpdateHash =
        options.updateHash ?? updateHash;

      const targetProgress =
        getTargetProgress(
          range,
          align,
        );

      const scrollableDistance = Math.max(
        0,
        viewport.scrollHeight -
          viewport.clientHeight,
      );

      viewport.scrollTo({
        top:
          targetProgress *
          scrollableDistance,

        behavior,
      });

      if (
        shouldUpdateHash &&
        typeof window !== "undefined"
      ) {
        window.history.replaceState(
          null,
          "",
          `#${sectionId}`,
        );
      }
    },
    [
      smoothScroll,
      updateHash,
    ],
  );

  const handleScroll = (
    event: UIEvent<HTMLDivElement>,
  ) => {
    updateProgress(
      event.currentTarget,
    );
  };

  useEffect(() => {
    const viewport =
      viewportRef.current;

    if (!viewport) {
      return;
    }

    updateProgress(viewport);

    const resizeObserver =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(() => {
            updateProgress(viewport);
          })
        : null;

    resizeObserver?.observe(viewport);

    return () => {
      resizeObserver?.disconnect();
    };
  }, [
    updateProgress,
    sectionsVersion,
  ]);

  /*
   * Allow ScrollStoryLink to work outside
   * the ScrollStory provider.
   */
  useEffect(() => {
    const handleNavigation = (
      event: Event,
    ) => {
      const customEvent =
        event as CustomEvent<ScrollStoryNavigateDetail>;

      if (
        customEvent.detail.storyId !==
        storyId
      ) {
        return;
      }

      scrollToSection(
        customEvent.detail.sectionId,
        customEvent.detail,
      );
    };

    window.addEventListener(
      SCROLL_STORY_NAVIGATE_EVENT,
      handleNavigation,
    );

    return () => {
      window.removeEventListener(
        SCROLL_STORY_NAVIGATE_EVENT,
        handleNavigation,
      );
    };
  }, [
    scrollToSection,
    storyId,
  ]);

  /*
   * Open a chapter directly from its URL hash.
   */
  useEffect(() => {
    if (
      initialHashHandledRef.current ||
      sectionsVersion === 0
    ) {
      return;
    }

    const hash = decodeURIComponent(
      window.location.hash.replace(
        /^#/,
        "",
      ),
    );

    if (
      !hash ||
      !sectionsRef.current.has(hash)
    ) {
      return;
    }

    initialHashHandledRef.current = true;

    const frame =
      window.requestAnimationFrame(() => {
        scrollToSection(hash, {
          behavior: "auto",
          align: "center",
          updateHash: false,
        });
      });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [
    scrollToSection,
    sectionsVersion,
  ]);

  const contextValue = useMemo(
    () => ({
      progress,
      prefersReducedMotion,
      activeSectionId,
      registerSection,
      scrollToSection,
    }),
    [
      progress,
      prefersReducedMotion,
      activeSectionId,
      registerSection,
      scrollToSection,
    ],
  );

  const sectionCount =
    sectionsRef.current.size;

  const calculatedHeightVh =
    heightVh ??
    Math.max(
      100,
      sectionCount * sectionHeightVh,
    );

  const viewportClassName = [
    "rudra-scroll-story-viewport",

    hideScrollbar
      ? "rudra-scroll-story-hide-scrollbar"
      : "",

    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>
        {`
          .rudra-scroll-story-hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .rudra-scroll-story-hide-scrollbar::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>

      <div
        ref={viewportRef}
        className={viewportClassName}
        onScroll={handleScroll}
        aria-label={ariaLabel}
        tabIndex={0}
        style={{
          position: "relative",

          width: "100%",
          height: viewportHeight,

          overflowX: "hidden",
          overflowY: "auto",

          overscrollBehavior: "contain",
          scrollBehavior:
            smoothScroll
              ? "smooth"
              : "auto",

          WebkitOverflowScrolling:
            "touch",

          ...viewportStyle,
        }}
      >
        <section
          style={{
            position: "relative",

            width: "100%",

            height: `${calculatedHeightVh}vh`,
            minHeight: `${calculatedHeightVh}vh`,

            ...style,
          }}
        >
          <ScrollStoryContext.Provider
            value={contextValue}
          >
            <div
              style={{
                position: "sticky",
                top: 0,

                width: "100%",
                height: viewportHeight,

                overflow: "hidden",
                isolation: "isolate",

                ...stickyStyle,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                }}
              >
                {scene}
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,

                  pointerEvents: "none",
                }}
              >
                {children}
              </div>
            </div>
          </ScrollStoryContext.Provider>
        </section>
      </div>
    </>
  );
}