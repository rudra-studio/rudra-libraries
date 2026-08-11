import React from "react";

export type NotificationBadgePosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface NotificationBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  children?: React.ReactNode;

  count?: number;

  max?: number;

  showZero?: boolean;

  dot?: boolean;

  pulse?: boolean;

  /** @select|top-right|top-left|bottom-right|bottom-left */
  position?: NotificationBadgePosition;

  /** @translate */
  ariaLabel?: string;

  /**
   * Wrapper customization.
   * @type|class
   * @schema [{"key":"Display","prefix":"","type":"select","options":[{"key":"inline-flex","label":"Inline Flex"},{"key":"flex","label":"Flex"}]},{"key":"Alignment","prefix":"","type":"select","options":[{"key":"items-center justify-center","label":"Center"},{"key":"items-start justify-start","label":"Start"}]}]
   */
  className?: string;

  /**
   * Badge customization.
   * @type|class
   * @schema [{"key":"Background","prefix":"bg","type":"select","options":[{"key":"red-500","label":"Red"},{"key":"blue-600","label":"Blue"},{"key":"green-600","label":"Green"},{"key":"amber-500","label":"Amber"},{"key":"purple-600","label":"Purple"},{"key":"gray-700","label":"Gray"}]},{"key":"Text Color","prefix":"text","type":"select","options":[{"key":"white","label":"White"},{"key":"black","label":"Black"},{"key":"gray-100","label":"Light Gray"}]},{"key":"Size","prefix":"","type":"select","options":[{"key":"min-w-4 h-4 px-1 text-[10px]","label":"Small"},{"key":"min-w-5 h-5 px-1.5 text-xs","label":"Medium"},{"key":"min-w-6 h-6 px-2 text-sm","label":"Large"}]},{"key":"Radius","prefix":"rounded","type":"select","options":[{"key":"none","label":"Square"},{"key":"md","label":"Medium"},{"key":"full","label":"Circle / Pill"}]},{"key":"Border","prefix":"","type":"select","options":[{"key":"border-0","label":"None"},{"key":"border-2 border-white","label":"White Border"},{"key":"border-2 border-gray-900","label":"Dark Border"}]}]
   */
  badgeClassName?: string;
}

const POSITION_CLASSES: Record<NotificationBadgePosition, string> = {
  "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
  "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
};

export default function NotificationBadge({
  children,
  count = 0,
  max = 99,
  showZero = false,
  dot = false,
  pulse = false,
  position = "top-right",
  ariaLabel,
  className = "",
  badgeClassName = "",
  ...props
}: NotificationBadgeProps) {
  const normalizedCount = Math.max(0, count);
  const normalizedMax = Math.max(1, max);

  const visible =
    dot ||
    normalizedCount > 0 ||
    showZero;

  const displayCount =
    normalizedCount > normalizedMax
      ? `${normalizedMax}+`
      : String(normalizedCount);

  const resolvedAriaLabel =
    ariaLabel ||
    (dot
      ? "New notification"
      : `${normalizedCount} notification${
          normalizedCount === 1 ? "" : "s"
        }`);

  const rootClassName = [
    "relative inline-flex",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedBadgeClassName = [
    "absolute z-10 inline-flex items-center justify-center font-semibold leading-none pointer-events-none",
    POSITION_CLASSES[position],
    dot
      ? "w-2.5 h-2.5 rounded-full bg-red-500"
      : "min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs",
    pulse ? "animate-pulse" : "",
    badgeClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      {...props}
      className={rootClassName}
    >
      {children}

      {visible && (
        <span
          className={resolvedBadgeClassName}
          role="status"
          aria-label={resolvedAriaLabel}
        >
          {!dot && (
            <span aria-hidden="true">
              {displayCount}
            </span>
          )}
        </span>
      )}
    </span>
  );
}