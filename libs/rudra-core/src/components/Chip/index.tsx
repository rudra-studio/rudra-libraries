import React from "react";

export type ChipVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export type ChipSize = "sm" | "md" | "lg";
export type ChipTheme = "light" | "dark" | "auto";

export interface ChipProps
  extends Omit<
    React.HTMLAttributes<HTMLSpanElement>,
    "children" | "className" | "onClick"
  > {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  removeIcon?: React.ReactNode;

  /** @select|neutral|primary|success|warning|danger */
  variant?: ChipVariant;

  /** @select|sm|md|lg */
  size?: ChipSize;

  /** @select|light|dark|auto */
  theme?: ChipTheme;

  removable?: boolean;
  disabled?: boolean;

  /**
   * @type|class
   * @schema [{"key":"Radius","prefix":"rounded","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"},{"key":"full","label":"Full"}]},{"key":"Shadow","prefix":"shadow","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"}]},{"key":"Font Weight","prefix":"font","type":"select","options":[{"key":"normal","label":"Normal"},{"key":"medium","label":"Medium"},{"key":"semibold","label":"Semi Bold"},{"key":"bold","label":"Bold"}]}]
   */
  className?: string;

  /** @type|function */
  onClick?: () => void;

  /** @type|function */
  onRemove?: () => void;
}

const SIZE_CLASSES: Record<ChipSize, string> = {
  sm: "min-h-6 px-2 text-xs gap-1",
  md: "min-h-8 px-3 text-sm gap-1.5",
  lg: "min-h-10 px-4 text-base gap-2",
};

const LIGHT_VARIANTS: Record<ChipVariant, string> = {
  neutral: "bg-gray-100 text-gray-700",
  primary: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-700",
};

const DARK_VARIANTS: Record<ChipVariant, string> = {
  neutral: "bg-gray-700 text-gray-100",
  primary: "bg-blue-900 text-blue-200",
  success: "bg-green-900 text-green-200",
  warning: "bg-yellow-900 text-yellow-200",
  danger: "bg-red-900 text-red-200",
};

const AUTO_VARIANTS: Record<ChipVariant, string> = {
  neutral:
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100",
  primary:
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  success:
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  danger:
    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

function getVariantClass(
  theme: ChipTheme,
  variant: ChipVariant
) {
  if (theme === "dark") {
    return DARK_VARIANTS[variant];
  }

  if (theme === "auto") {
    return AUTO_VARIANTS[variant];
  }

  return LIGHT_VARIANTS[variant];
}

export default function Chip({
  children = "Chip",
  icon,
  removeIcon,
  variant = "neutral",
  size = "md",
  theme = "auto",
  removable = false,
  disabled = false,
  className = "",
  onClick,
  onRemove,
  ...props
}: ChipProps) {
  const clickable = Boolean(onClick) && !disabled;

  const resolvedClassName = [
    "inline-flex items-center rounded-full font-medium",
    "transition-colors select-none",
    SIZE_CLASSES[size],
    getVariantClass(theme, variant),
    clickable ? "cursor-pointer" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      {...props}
      className={resolvedClassName}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={() => {
        if (!disabled) {
          onClick?.();
        }
      }}
      onKeyDown={(event) => {
        if (
          clickable &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      {icon && (
        <span
          className="inline-flex shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <span>{children}</span>

      {removable && (
        <button
          type="button"
          aria-label="Remove"
          disabled={disabled}
          className="ml-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          onClick={(event) => {
            event.stopPropagation();

            if (!disabled) {
              onRemove?.();
            }
          }}
        >
          {removeIcon || (
            <span className="text-base leading-none" aria-hidden="true">
              ×
            </span>
          )}
        </button>
      )}
    </span>
  );
}