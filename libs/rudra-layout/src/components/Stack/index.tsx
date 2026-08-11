import React from "react";

export type StackElement =
  | "div"
  | "section"
  | "article"
  | "main"
  | "aside"
  | "nav";

export type StackDirection = "vertical" | "horizontal";

export type StackGap =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "6"
  | "8"
  | "10"
  | "12";

export type StackAlign =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "baseline";

export type StackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface StackProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|div|section|article|main|aside|nav */
  as?: StackElement;

  /** @select|vertical|horizontal */
  direction?: StackDirection;

  /** @select|0|1|2|3|4|6|8|10|12 */
  gap?: StackGap;

  /** @select|start|center|end|stretch|baseline */
  align?: StackAlign;

  /** @select|start|center|end|between|around|evenly */
  justify?: StackJustify;

  wrap?: boolean;

  /**
   * @type|class
   * @schema [{"key":"Width","prefix":"w","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"full","label":"Full Width"},{"key":"screen","label":"Screen"}]},{"key":"Height","prefix":"h","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"full","label":"Full Height"},{"key":"screen","label":"Screen"}]},{"key":"Padding","prefix":"p","type":"select","options":[{"key":"0","label":"None"},{"key":"2","label":"Small"},{"key":"4","label":"Medium"},{"key":"6","label":"Large"},{"key":"8","label":"Extra Large"},{"key":"12","label":"2XL"}]},{"key":"Background","prefix":"bg","type":"select","options":[{"key":"transparent","label":"Transparent"},{"key":"white","label":"White"},{"key":"gray-50","label":"Gray 50"},{"key":"gray-100","label":"Gray 100"},{"key":"gray-900","label":"Gray 900"},{"key":"black","label":"Black"}]}]
   */
  className?: string;
}

const DIRECTION_CLASSES: Record<StackDirection, string> = {
  vertical: "flex-col",
  horizontal: "flex-row",
};

const GAP_CLASSES: Record<StackGap, string> = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
};

const ALIGN_CLASSES: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const JUSTIFY_CLASSES: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export default function Stack({
  children,
  as = "div",
  direction = "vertical",
  gap = "4",
  align = "stretch",
  justify = "start",
  wrap = false,
  className = "",
  ...props
}: StackProps) {
  const Element = as;

  const resolvedClassName = [
    "flex",
    DIRECTION_CLASSES[direction],
    GAP_CLASSES[gap],
    ALIGN_CLASSES[align],
    JUSTIFY_CLASSES[justify],
    wrap ? "flex-wrap" : "flex-nowrap",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element {...props} className={resolvedClassName}>
      {children}
    </Element>
  );
}