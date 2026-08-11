import React from "react";

export type CardTheme = "light" | "dark" | "auto";
export type CardElement = "div" | "article" | "section";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|div|article|section */
  as?: CardElement;

  /** @select|light|dark|auto */
  theme?: CardTheme;

  /**
   * @type|class
   * @schema [{"key":"Background","prefix":"bg","type":"select","options":[{"key":"white","label":"White"},{"key":"gray-50","label":"Light Gray"},{"key":"gray-100","label":"Gray"},{"key":"gray-800","label":"Dark Gray"},{"key":"gray-900","label":"Dark"},{"key":"transparent","label":"Transparent"}]},{"key":"Padding","prefix":"p","type":"select","options":[{"key":"0","label":"None"},{"key":"2","label":"Small"},{"key":"4","label":"Medium"},{"key":"6","label":"Large"},{"key":"8","label":"Extra Large"}]},{"key":"Radius","prefix":"rounded","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"},{"key":"xl","label":"Extra Large"},{"key":"2xl","label":"2XL"},{"key":"3xl","label":"3XL"}]},{"key":"Shadow","prefix":"shadow","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"},{"key":"xl","label":"Extra Large"},{"key":"2xl","label":"2XL"}]},{"key":"Border Width","prefix":"border","type":"select","options":[{"key":"0","label":"None"},{"key":"","label":"Default"},{"key":"2","label":"2px"},{"key":"4","label":"4px"}]},{"key":"Width","prefix":"w","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"full","label":"Full Width"},{"key":"1/2","label":"50%"},{"key":"1/3","label":"33%"},{"key":"2/3","label":"66%"}]},{"key":"Overflow","prefix":"overflow","type":"select","options":[{"key":"visible","label":"Visible"},{"key":"hidden","label":"Hidden"},{"key":"auto","label":"Auto"},{"key":"scroll","label":"Scroll"}]}]
   */
  className?: string;
}

const THEME_CLASSES: Record<CardTheme, string> = {
  light: "bg-white text-gray-900 border-gray-200",
  dark: "bg-gray-900 text-gray-100 border-gray-700",
  auto:
    "bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
};

export default function Card({
  children,
  as = "div",
  theme = "auto",
  className = "",
  ...props
}: CardProps) {
  const Element = as;

  const resolvedClassName = [
    "relative overflow-hidden rounded-xl border",
    THEME_CLASSES[theme],
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