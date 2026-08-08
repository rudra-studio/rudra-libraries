import {
  useContext,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import ScrollStoryContext,{
  SCROLL_STORY_NAVIGATE_EVENT,
  
  
  type ScrollSectionAlignment,
  type ScrollStoryNavigateDetail,
} from "../ScrollStoryContext";

export interface ScrollStoryLinkProps
  extends Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  > {
  storyId?: string;
  sectionId: string;

  children: ReactNode;

  behavior?: ScrollBehavior;
  align?: ScrollSectionAlignment;
  updateHash?: boolean;

  activeClassName?: string;
}

export default function ScrollStoryLink({
  storyId,
  sectionId,
  children,
  behavior = "smooth",
  align = "center",
  updateHash = true,
  className,
  activeClassName = "is-active",
  onClick,
  ...anchorProps
}: ScrollStoryLinkProps) {
  const context =
    useContext(ScrollStoryContext);

  const active =
    context?.activeSectionId ===
    sectionId;

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();

    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (context) {
      context.scrollToSection(
        sectionId,
        {
          behavior,
          align,
          updateHash,
        },
      );

      return;
    }

    if (!storyId) {
      console.warn(
        "ScrollStoryLink outside ScrollStory requires storyId.",
      );

      return;
    }

    const detail: ScrollStoryNavigateDetail =
      {
        storyId,
        sectionId,
        behavior,
        align,
        updateHash,
      };

    window.dispatchEvent(
      new CustomEvent(
        SCROLL_STORY_NAVIGATE_EVENT,
        {
          detail,
        },
      ),
    );
  };

  const linkClassName = [
    className ?? "",
    active ? activeClassName : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      {...anchorProps}
      href={`#${sectionId}`}
      className={linkClassName}
      aria-current={
        active ? "step" : undefined
      }
      onClick={handleClick}
    >
      {children}
    </a>
  );
}