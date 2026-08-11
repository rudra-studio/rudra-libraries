import React from "react";

export type IconButtonTheme = "light" | "dark" | "auto";

export type IconButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className" | "onClick"
  > {
  icon?: React.ReactNode;

  /** @translate */
  ariaLabel?: string;

  /** @select|light|dark|auto */
  theme?: IconButtonTheme;

  /** @select|primary|secondary|outline|ghost|danger */
  variant?: IconButtonVariant;

  /** @select|xs|sm|md|lg|xl */
  size?: IconButtonSize;

  loading?: boolean;

  /**
   * @type|complex
   * @schema {"type":"object"}
   */
  additionalAttributes?: Record<
    string,
    string | number | boolean | undefined
  >;

  /**
   * @type|class
   * @schema [{"key":"Background","prefix":"bg","type":"select","options":[{"key":"blue-600","label":"Blue"},{"key":"gray-600","label":"Gray"},{"key":"white","label":"White"},{"key":"black","label":"Black"},{"key":"transparent","label":"Transparent"},{"key":"red-600","label":"Red"}]},{"key":"Text Color","prefix":"text","type":"select","options":[{"key":"white","label":"White"},{"key":"black","label":"Black"},{"key":"gray-700","label":"Gray"},{"key":"blue-600","label":"Blue"},{"key":"red-600","label":"Red"}]},{"key":"Radius","prefix":"rounded","type":"select","options":[{"key":"none","label":"Square"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"},{"key":"full","label":"Circle"}]},{"key":"Shadow","prefix":"shadow","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"}]}]
   */
  className?: string;

  /** @type|function */
  onClick?: () => void;
}

const SIZE_CLASSES: Record<IconButtonSize, string> = {
  xs: "w-7 h-7 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-14 h-14 text-xl",
};

const LIGHT_VARIANTS: Record<IconButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
  secondary:
    "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200",
  outline:
    "bg-transparent text-blue-600 hover:bg-blue-50 border-blue-600",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border-transparent",
};

const DARK_VARIANTS: Record<IconButtonVariant, string> = {
  primary:
    "bg-blue-500 text-white hover:bg-blue-400 border-transparent",
  secondary:
    "bg-gray-700 text-gray-100 hover:bg-gray-600 border-gray-600",
  outline:
    "bg-transparent text-blue-400 hover:bg-blue-950 border-blue-400",
  ghost:
    "bg-transparent text-gray-200 hover:bg-gray-800 border-transparent",
  danger:
    "bg-red-500 text-white hover:bg-red-400 border-transparent",
};

const AUTO_VARIANTS: Record<IconButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 border-transparent dark:bg-blue-500 dark:hover:bg-blue-400",

  secondary:
    "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:border-gray-600",

  outline:
    "bg-transparent text-blue-600 hover:bg-blue-50 border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950 dark:border-blue-400",

  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 border-transparent dark:text-gray-200 dark:hover:bg-gray-800",

  danger:
    "bg-red-600 text-white hover:bg-red-700 border-transparent dark:bg-red-500 dark:hover:bg-red-400",
};

function getVariantClass(
  theme: IconButtonTheme,
  variant: IconButtonVariant
) {
  if (theme === "dark") {
    return DARK_VARIANTS[variant];
  }

  if (theme === "auto") {
    return AUTO_VARIANTS[variant];
  }

  return LIGHT_VARIANTS[variant];
}

export default function IconButton({
  icon,
  ariaLabel = "Icon button",
  theme = "auto",
  variant = "ghost",
  size = "md",
  loading = false,
  additionalAttributes = {},
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || loading;

  const resolvedClassName = [
    "inline-flex shrink-0 items-center justify-center border rounded-full transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    SIZE_CLASSES[size],
    getVariantClass(theme, variant),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...additionalAttributes}
      {...props}
      type={type}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={resolvedClassName}
      onClick={() => {
        if (!isDisabled) {
          onClick?.();
        }
      }}
    >
      {loading ? (
        <span
          className="w-[45%] h-[45%] rounded-full border-2 border-current border-r-transparent animate-spin"
          aria-hidden="true"
        />
      ) : (
        <span
          className="inline-flex items-center justify-center leading-none"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </button>
  );
}