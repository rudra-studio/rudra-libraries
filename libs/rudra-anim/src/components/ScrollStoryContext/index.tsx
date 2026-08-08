"use client";

import {
  createContext,
  useContext,
} from "react";

import type { MotionValue } from "motion/react";

export type ScrollStoryRange = readonly [
  number,
  number,
];

export type ScrollSectionAlignment =
  | "start"
  | "center"
  | "end";

export interface ScrollToSectionOptions {
  behavior?: ScrollBehavior;
  align?: ScrollSectionAlignment;
  updateHash?: boolean;
}

export interface ScrollStoryContextValue {
  progress: MotionValue<number>;
  prefersReducedMotion: boolean;

  activeSectionId: string | null;

  registerSection: (
    sectionId: string,
    range: ScrollStoryRange,
  ) => () => void;

  scrollToSection: (
    sectionId: string,
    options?: ScrollToSectionOptions,
  ) => void;
}

export interface ScrollStoryNavigateDetail
  extends ScrollToSectionOptions {
  storyId: string;
  sectionId: string;
}

export const SCROLL_STORY_NAVIGATE_EVENT =
  "rudra:scroll-story-navigate";

const ScrollStoryContext =
  createContext<ScrollStoryContextValue | null>(
    null,
  );

  export default ScrollStoryContext;
