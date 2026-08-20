import React from "react";

export interface BadgeActionEvent {
  componentId: string;
  action: "click";
  metadata?: Record<string, unknown>;
}

export interface BadgeProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "className" | "onClick"
  > {
  /** @translate */
  label?: string;

  /** @icon */
  icon?: React.ReactNode;

  isOffer?: boolean;

  /** @color */
  customColor?: string;

  /**
   * Semantic element. Interactive badges automatically use button when as is
   * omitted; decorative badges default to span.
   *
   * @select|span|div|button
   */
  as?: "span" | "div" | "button";

  /** @translate */
  ariaLabel?: string;

  disabled?: boolean;

  /**
   * Additional native/data/aria attributes.
   *
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string | number | boolean | undefined
  >;

  /**
   * Complete visual class override.
   *
   * @type|class
   * @schema [{"key":"Display & Alignment","prefix":"","type":"select","options":[{"key":"inline-flex","label":"Inline"},{"key":"flex w-fit mr-auto","label":"Left"},{"key":"flex w-fit mx-auto","label":"Center"},{"key":"flex w-fit ml-auto","label":"Right"}]},{"key":"Size","prefix":"","type":"select","options":[{"key":"px-2 py-0.5 text-[10px] gap-1","label":"Small"},{"key":"px-2.5 py-1 text-xs gap-1.5","label":"Medium"},{"key":"px-3.5 py-1.5 text-sm gap-2","label":"Large"}]},{"key":"Theme","prefix":"bg","type":"select","options":[{"key":"purple-100 text-purple-800 border-transparent","label":"Subtle Purple"},{"key":"purple-600 text-white border-purple-600","label":"Solid Purple"},{"key":"blue-100 text-blue-800 border-transparent","label":"Subtle Blue"},{"key":"blue-600 text-white border-blue-600","label":"Solid Blue"},{"key":"transparent text-purple-600 border-purple-600","label":"Outline Purple"}]}]
   */
  className?: string;

  /** @type|function|return:void|args:event */
  onClick?: React.MouseEventHandler<HTMLElement>;

  /** @type|function */
  onAction?: (event: BadgeActionEvent) => void;

  /** @type|json */
  metadata?: Record<string, unknown>;
}

const DEFAULT_CLASSES =
  "relative inline-flex items-center justify-center rounded-full font-bold " +
  "tracking-wide border transition-all duration-300 px-2.5 py-1 text-xs " +
  "gap-1.5 bg-purple-100 text-purple-800 border-transparent";

export default function Badge({
  id = "rudra-badge",
  label = "",
  icon,
  isOffer = false,
  customColor,
  as,
  ariaLabel,
  disabled = false,
  customAttributes = {},
  className = DEFAULT_CLASSES,
  onClick,
  onAction,
  metadata,
  ...props
}: BadgeProps) {
  const interactive = Boolean(onClick || onAction);
  const Element: React.ElementType =
    as || (interactive ? "button" : "span");

  const handleClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
    onAction?.({
      componentId: id,
      action: "click",
      metadata,
    });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLElement>
  ) => {
    props.onKeyDown?.(event);
    if (
      Element !== "button" &&
      interactive &&
      !disabled &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <Element
      {...customAttributes}
      {...props}
      id={id}
      type={Element === "button" ? "button" : undefined}
      disabled={Element === "button" ? disabled : undefined}
      role={Element !== "button" && interactive ? "button" : props.role}
      tabIndex={
        Element !== "button" && interactive
          ? props.tabIndex ?? 0
          : props.tabIndex
      }
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={className}
      style={
        customColor
          ? {
              ...props.style,
              backgroundColor: customColor,
              borderColor: customColor,
              color: "#ffffff",
            }
          : props.style
      }
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {isOffer && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-500" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      )}
      {icon}
      {label ? <span>{label}</span> : null}
    </Element>
  );
}
