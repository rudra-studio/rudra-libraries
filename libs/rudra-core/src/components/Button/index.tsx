import React from "react";
import styles from "./styles.module.scss";

export type ButtonTheme =
  | "light"
  | "dark"
  | "auto";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

export interface ButtonActionEvent {
  componentId: string;

  action: "click";

  value?: string | number;

  metadata?: Record<string, unknown>;
}

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className" | "onClick"
  > {
  /**
   * Stable identifier for this Button instance.
   */
  id?: string;

  /**
   * Content displayed inside the button.
   */
  children?: React.ReactNode; /* @optional */

  /**
   * Optional bindable text label. When provided it takes precedence over
   * children, while children remains available for composed React content.
   *
   * @translate|@optional
   */
  label?: string;

  /**
   * Optional content displayed before the label.
   */
  leftIcon?: React.ReactNode;

  /**
   * Optional content displayed after the label.
   */
  rightIcon?: React.ReactNode;

  /**
   * @select|light|dark|auto
   */
  theme?: ButtonTheme;

  /**
   * @select|primary|secondary|outline|ghost|danger
   */
  variant?: ButtonVariant;

  /**
   * @select|xs|sm|md|lg|xl
   */
  size?: ButtonSize;

  /**
   * When true, the button occupies the available width.
   */
  fullWidth?: boolean;

  /**
   * Displays an internal loading indicator.
   */
  loading?: boolean;

  /**
   * @translate
   */
  loadingText?: string;

  /**
   * Accessible label for icon-only or custom buttons.
   *
   * @translate
   */
  ariaLabel?: string;

  /**
   * Additional application-specific information returned
   * through onAction.
   *
   * @type|json
   */
  metadata?: Record<string, unknown>;

  /**
   * Additional native/data/aria attributes.
   *
   * @type|complex
   * @schema {"type":"object"}
   */
  additionalAttributes?: Record<
    string,
    string | number | boolean | undefined
  >;

  /**
   * Complete visual class override.
   *
   * When className is provided, it becomes the visual
   * styling source for the button. When omitted, the
   * component uses its built-in theme/variant/size styles.
   *
   * @type|class
   * @schema [{"key":"Background","prefix":"bg","type":"select","options":[{"key":"blue-600","label":"Blue"},{"key":"gray-600","label":"Gray"},{"key":"white","label":"White"},{"key":"transparent","label":"Transparent"},{"key":"red-600","label":"Red"},{"key":"black","label":"Black"}]},{"key":"Text Color","prefix":"text","type":"select","options":[{"key":"white","label":"White"},{"key":"black","label":"Black"},{"key":"gray-900","label":"Dark"},{"key":"gray-700","label":"Gray"},{"key":"blue-600","label":"Blue"},{"key":"red-600","label":"Red"}]},{"key":"Radius","prefix":"rounded","type":"select","options":[{"key":"none","label":"Square"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"},{"key":"xl","label":"Extra Large"},{"key":"full","label":"Pill"}]},{"key":"Width","prefix":"w","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"full","label":"Full Width"}]},{"key":"Font Weight","prefix":"font","type":"select","options":[{"key":"normal","label":"Normal"},{"key":"medium","label":"Medium"},{"key":"semibold","label":"Semi Bold"},{"key":"bold","label":"Bold"}]},{"key":"Shadow","prefix":"shadow","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"}]}]
   */
  className?: string;

  /**
   * Single outward Rudra interaction callback.
   *
   * @type|function
   */
  onAction?: (
    event: ButtonActionEvent
  ) => void;
}

const SIZE_CLASSES: Record<
  ButtonSize,
  string
> = {
  xs: "px-2.5 py-1.5 text-xs gap-1.5",
  sm: "px-3 py-2 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
  xl: "px-6 py-3 text-lg gap-2.5",
};

const LIGHT_VARIANTS: Record<
  ButtonVariant,
  string
> = {
  primary:
    "border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",

  secondary:
    "border border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",

  outline:
    "border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500",

  ghost:
    "border border-transparent bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",

  danger:
    "border border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const DARK_VARIANTS: Record<
  ButtonVariant,
  string
> = {
  primary:
    "border border-transparent bg-blue-500 text-white hover:bg-blue-400 focus:ring-blue-400",

  secondary:
    "border border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500",

  outline:
    "border border-blue-400 bg-transparent text-blue-400 hover:bg-blue-950 focus:ring-blue-400",

  ghost:
    "border border-transparent bg-transparent text-gray-200 hover:bg-gray-800 focus:ring-gray-500",

  danger:
    "border border-transparent bg-red-500 text-white hover:bg-red-400 focus:ring-red-400",
};

const AUTO_VARIANTS: Record<
  ButtonVariant,
  string
> = {
  primary:
    "border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-400",

  secondary:
    "border border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-500",

  outline:
    "border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 dark:focus:ring-blue-400",

  ghost:
    "border border-transparent bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-500",

  danger:
    "border border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-400 dark:focus:ring-red-400",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-md font-medium " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "transition-colors select-none";

function getVariantClasses(
  theme: ButtonTheme,
  variant: ButtonVariant
) {
  if (theme === "dark") {
    return DARK_VARIANTS[variant];
  }

  if (theme === "auto") {
    return AUTO_VARIANTS[variant];
  }

  return LIGHT_VARIANTS[variant];
}

export default function Button({
  id = "rudra-button",

  children = "Click Me",

  label,

  leftIcon,

  rightIcon,

  theme = "auto",

  variant = "primary",

  size = "md",

  fullWidth = false,

  loading = false,

  loadingText,

  ariaLabel,

  metadata,

  additionalAttributes = {},

  className,

  type = "button",

  disabled = false,

  value,

  onAction,

  ...props
}: ButtonProps) {
  const isDisabled =
    disabled || loading;

  const defaultClassName = [
    BASE_CLASSES,

    SIZE_CLASSES[size],

    getVariantClasses(
      theme,
      variant
    ),

    fullWidth
      ? "w-full"
      : "w-auto",
  ]
    .filter(Boolean)
    .join(" ");

  /*
   * className is intentionally treated as a complete
   * visual override.
   *
   * This avoids conflicting Tailwind utilities such as:
   *
   * bg-blue-600 + bg-red-600
   *
   * when styling the component through Rudra's
   * class editor.
   */
  const resolvedClassName =
    className?.trim()
      ? className
      : defaultClassName;

  const handleClick = () => {
    if (isDisabled) {
      return;
    }

    onAction?.({
      componentId: id,

      action: "click",

      value:
        typeof value === "string" ||
          typeof value === "number"
          ? value
          : undefined,

      metadata,
    });
  };

  return (
    <button
      {...additionalAttributes}
      {...props}
      id={id}
      type={type}
      value={value}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={
        loading || undefined
      }
      className={
        resolvedClassName
      }
      onClick={
        handleClick
      }
    >
      <span
        className={
          styles.content
        }
      >
        {loading ? (
          <span
            className={
              styles.spinner
            }
            aria-hidden="true"
          />
        ) : (
          leftIcon && (
            <span
              className={
                styles.icon
              }
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )
        )}

        <span
          className={
            styles.label
          }
        >
          {loading &&
            loadingText
            ? loadingText
            : label ?? children}
        </span>

        {!loading &&
          rightIcon && (
            <span
              className={
                styles.icon
              }
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
      </span>
    </button>
  );
}