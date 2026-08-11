import React from "react";

export type ContainerElement =
  | "div"
  | "main"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer";

export type ContainerMaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full"
  | "none";

export interface ContainerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|div|main|section|article|aside|header|footer */
  as?: ContainerElement;

  /** @select|sm|md|lg|xl|2xl|full|none */
  maxWidth?: ContainerMaxWidth;

  centered?: boolean;

  /**
   * @type|class
   * @schema [{"key":"Width","prefix":"w","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"full","label":"Full Width"},{"key":"screen","label":"Screen"}]},{"key":"Padding X","prefix":"px","type":"select","options":[{"key":"0","label":"None"},{"key":"2","label":"Small"},{"key":"4","label":"Medium"},{"key":"6","label":"Large"},{"key":"8","label":"Extra Large"},{"key":"12","label":"2XL"}]},{"key":"Padding Y","prefix":"py","type":"select","options":[{"key":"0","label":"None"},{"key":"2","label":"Small"},{"key":"4","label":"Medium"},{"key":"6","label":"Large"},{"key":"8","label":"Extra Large"},{"key":"12","label":"2XL"}]},{"key":"Background","prefix":"bg","type":"select","options":[{"key":"transparent","label":"Transparent"},{"key":"white","label":"White"},{"key":"gray-50","label":"Gray 50"},{"key":"gray-100","label":"Gray 100"},{"key":"gray-900","label":"Gray 900"},{"key":"black","label":"Black"}]},{"key":"Min Height","prefix":"min-h","type":"select","options":[{"key":"0","label":"None"},{"key":"full","label":"Full"},{"key":"screen","label":"Screen"}]}]
   */
  className?: string;
}

const MAX_WIDTH_CLASSES: Record<ContainerMaxWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
  none: "",
};

export default function Container({
  children,
  as = "div",
  maxWidth = "xl",
  centered = true,
  className = "",
  ...props
}: ContainerProps) {
  const Element = as;

  const resolvedClassName = [
    "w-full",
    MAX_WIDTH_CLASSES[maxWidth],
    centered ? "mx-auto" : "",
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