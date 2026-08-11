import React, { useEffect, useState } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";
export type AvatarStatus = "none" | "online" | "offline" | "busy" | "away";
export type AvatarTheme = "light" | "dark" | "auto";

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  src?: string;

  /** @translate */
  alt?: string;

  /** @translate */
  name?: string;

  /** @translate */
  fallback?: string;

  /** @select|xs|sm|md|lg|xl */
  size?: AvatarSize;

  /** @select|circle|rounded|square */
  shape?: AvatarShape;

  /** @select|none|online|offline|busy|away */
  status?: AvatarStatus;

  /** @select|light|dark|auto */
  theme?: AvatarTheme;

  /** @select|eager|lazy */
  loading?: "eager" | "lazy";

  referrerPolicy?: React.HTMLAttributeReferrerPolicy;

  /**
   * Root customization.
   * @type|class
   * @schema [{"key":"Shadow","prefix":"shadow","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"}]},{"key":"Opacity","prefix":"opacity","type":"select","options":[{"key":"100","label":"100%"},{"key":"75","label":"75%"},{"key":"50","label":"50%"}]}]
   */
  className?: string;

  /**
   * Image customization.
   * @type|class
   * @schema [{"key":"Object Fit","prefix":"object","type":"select","options":[{"key":"cover","label":"Cover"},{"key":"contain","label":"Contain"},{"key":"fill","label":"Fill"}]}]
   */
  imageClassName?: string;

  /**
   * Fallback customization.
   * When supplied, it replaces the default theme colors.
   * @type|class
   * @schema [{"key":"Background","prefix":"bg","type":"select","options":[{"key":"gray-200","label":"Light Gray"},{"key":"gray-700","label":"Dark Gray"},{"key":"blue-600","label":"Blue"},{"key":"green-600","label":"Green"},{"key":"red-600","label":"Red"},{"key":"purple-600","label":"Purple"}]},{"key":"Text Color","prefix":"text","type":"select","options":[{"key":"gray-700","label":"Dark Gray"},{"key":"gray-100","label":"Light Gray"},{"key":"white","label":"White"},{"key":"blue-600","label":"Blue"},{"key":"purple-600","label":"Purple"}]},{"key":"Font Weight","prefix":"font","type":"select","options":[{"key":"normal","label":"Normal"},{"key":"medium","label":"Medium"},{"key":"semibold","label":"Semi Bold"},{"key":"bold","label":"Bold"}]}]
   */
  fallbackClassName?: string;

  /**
   * Status indicator customization.
   * When supplied, it replaces the default status color and theme border.
   * @type|class
   * @schema [{"key":"Background","prefix":"bg","type":"select","options":[{"key":"green-500","label":"Green"},{"key":"gray-400","label":"Gray"},{"key":"red-500","label":"Red"},{"key":"amber-500","label":"Amber"},{"key":"blue-500","label":"Blue"}]},{"key":"Border Color","prefix":"border","type":"select","options":[{"key":"white","label":"White"},{"key":"gray-900","label":"Dark"},{"key":"transparent","label":"Transparent"}]},{"key":"Border Width","prefix":"border","type":"select","options":[{"key":"0","label":"None"},{"key":"2","label":"Medium"},{"key":"4","label":"Large"}]}]
   */
  statusClassName?: string;

  /** @type|function */
  onImageError?: (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[9px]",
  sm: "w-8 h-8 text-[11px]",
  md: "w-10 h-10 text-[13px]",
  lg: "w-13 h-13 text-base",
  xl: "w-17 h-17 text-xl",
};

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-lg",
  square: "rounded-none",
};

const STATUS_CLASSES: Record<Exclude<AvatarStatus, "none">, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

function initialsFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function getFallbackThemeClass(theme: AvatarTheme): string {
  if (theme === "dark") {
    return "bg-gray-700 text-gray-100";
  }

  if (theme === "auto") {
    return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100";
  }

  return "bg-gray-200 text-gray-700";
}

function getStatusBorderClass(theme: AvatarTheme): string {
  if (theme === "dark") {
    return "border-gray-900";
  }

  if (theme === "auto") {
    return "border-white dark:border-gray-900";
  }

  return "border-white";
}

export default function Avatar({
  src,
  alt,
  name = "Rudra User",
  fallback,
  size = "md",
  shape = "circle",
  status = "none",
  theme = "auto",
  loading = "lazy",
  referrerPolicy,
  className = "",
  imageClassName = "",
  fallbackClassName,
  statusClassName,
  onImageError,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const fallbackText = (fallback || initialsFromName(name))
    .slice(0, 2)
    .toUpperCase();

  const accessibleName = alt || name || "Avatar";
  const showImage = Boolean(src) && !imageFailed;

  const rootClassName = [
    "relative inline-flex shrink-0 items-center justify-center overflow-visible font-semibold select-none",
    SIZE_CLASSES[size],
    SHAPE_CLASSES[shape],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedImageClassName = [
    "w-full h-full object-cover",
    SHAPE_CLASSES[shape],
    imageClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedFallbackClassName = [
    "w-full h-full inline-flex items-center justify-center leading-none",
    SHAPE_CLASSES[shape],
    fallbackClassName || getFallbackThemeClass(theme),
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedStatusClassName =
    status !== "none"
      ? [
          "absolute right-0 bottom-0 w-1/4 h-1/4 min-w-[7px] min-h-[7px] rounded-full box-border",
          statusClassName ||
            `border-2 ${getStatusBorderClass(theme)} ${STATUS_CLASSES[status]}`,
        ]
          .filter(Boolean)
          .join(" ")
      : "";

  const ariaLabel =
    status === "none"
      ? accessibleName
      : `${accessibleName}, ${status}`;

  return (
    <span
      {...props}
      className={rootClassName}
      role="img"
      aria-label={ariaLabel}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          loading={loading}
          referrerPolicy={referrerPolicy}
          className={resolvedImageClassName}
          onError={(event) => {
            setImageFailed(true);
            onImageError?.(event);
          }}
        />
      ) : (
        <span className={resolvedFallbackClassName} aria-hidden="true">
          {fallbackText}
        </span>
      )}

      {status !== "none" && (
        <span
          className={resolvedStatusClassName}
          title={status}
          aria-hidden="true"
        />
      )}
    </span>
  );
}