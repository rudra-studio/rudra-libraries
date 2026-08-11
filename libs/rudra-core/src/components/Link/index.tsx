import React from "react";

export interface LinkProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "onClick"
  > {
  children?: React.ReactNode;
  href?: string;
  disabled?: boolean;

  /**
   * @type|class
   * @schema [{"key":"Text Color","prefix":"text","type":"select","options":[{"key":"blue-600","label":"Blue"},{"key":"gray-700","label":"Gray"},{"key":"gray-900","label":"Dark"},{"key":"white","label":"White"},{"key":"red-600","label":"Red"},{"key":"green-600","label":"Green"}]},{"key":"Font Size","prefix":"text","type":"select","options":[{"key":"xs","label":"Extra Small"},{"key":"sm","label":"Small"},{"key":"base","label":"Base"},{"key":"lg","label":"Large"},{"key":"xl","label":"Extra Large"}]},{"key":"Font Weight","prefix":"font","type":"select","options":[{"key":"normal","label":"Normal"},{"key":"medium","label":"Medium"},{"key":"semibold","label":"Semi Bold"},{"key":"bold","label":"Bold"}]},{"key":"Decoration","prefix":"","type":"select","options":[{"key":"no-underline","label":"None"},{"key":"underline","label":"Underline"}]}]
   */
  className?: string;

  /** @type|function */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Link({
  children = "Link",
  href = "#",
  disabled = false,
  className = "",
  target,
  rel,
  onClick,
  ...props
}: LinkProps) {
  const resolvedRel =
    target === "_blank"
      ? rel || "noopener noreferrer"
      : rel;

  const resolvedClassName = [
    "inline-flex items-center text-blue-600 hover:text-blue-700",
    "transition-colors",
    disabled
      ? "opacity-50 cursor-not-allowed pointer-events-none"
      : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      {...props}
      href={disabled ? undefined : href}
      target={target}
      rel={resolvedRel}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      className={resolvedClassName}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}