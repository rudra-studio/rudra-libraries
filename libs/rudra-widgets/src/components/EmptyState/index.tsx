import React from "react";

export type EmptyStateAlign =
  | "left"
  | "center"
  | "right";

export interface EmptyStateProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  title?: string;

  description?: string;

  /**
   * Optional icon / illustration.
   */
  icon?: React.ReactNode;

  /**
   * Additional custom content.
   */
  children?: React.ReactNode;

  primaryActionLabel?: string;

  secondaryActionLabel?: string;

  /**
   * @select|left|center|right
   */
  align?: EmptyStateAlign;

  /**
   * Maximum content width.
   *
   * 0 = unlimited.
   */
  maxWidth?: number;

  /**
   * Minimum component height.
   */
  minHeight?: number;

  /**
   * Show default placeholder graphic
   * when no icon is supplied.
   */
  showDefaultIcon?: boolean;

  /**
   * @color
   */
  iconColor?: string;

  /**
   * @color
   */
  primaryColor?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  iconClassName?: string;

  /**
   * @type|class
   */
  titleClassName?: string;

  /**
   * @type|class
   */
  descriptionClassName?: string;

  /**
   * @type|class
   */
  actionsClassName?: string;

  /**
   * @type|class
   */
  primaryActionClassName?: string;

  /**
   * @type|class
   */
  secondaryActionClassName?: string;

  /**
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string
  >;

  /**
   * @type|function
   */
  onPrimaryAction?: () => void;

  /**
   * @type|function
   */
  onSecondaryAction?: () => void;
}

function DefaultEmptyIcon({
  color,
}: {
  color: string;
}) {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        display: "block",
      }}
    >
      <rect
        x="12"
        y="16"
        width="48"
        height="40"
        rx="8"
        stroke={color}
        strokeWidth="2"
        opacity="0.35"
      />

      <path
        d="M24 30H48"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />

      <path
        d="M24 38H42"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />

      <path
        d="M24 46H36"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />

      <circle
        cx="54"
        cy="54"
        r="10"
        fill="white"
        stroke={color}
        strokeWidth="2"
      />

      <path
        d="M54 50V58"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M50 54H58"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EmptyState({
  title = "Nothing here yet",

  description =
    "There is currently no content to display.",

  icon,

  children,

  primaryActionLabel,

  secondaryActionLabel,

  align = "center",

  maxWidth = 480,

  minHeight = 240,

  showDefaultIcon = true,

  iconColor = "#64748b",

  primaryColor = "#2563eb",

  className = "w-full",

  iconClassName = "",

  titleClassName = "",

  descriptionClassName = "",

  actionsClassName = "",

  primaryActionClassName = "",

  secondaryActionClassName = "",

  customAttributes = {},

  onPrimaryAction,

  onSecondaryAction,

  style,

  ...props
}: EmptyStateProps) {
  const alignItems =
    align === "left"
      ? "flex-start"
      : align === "right"
        ? "flex-end"
        : "center";

  const textAlign =
    align === "left"
      ? "left"
      : align === "right"
        ? "right"
        : "center";

  const hasActions =
    Boolean(primaryActionLabel) ||
    Boolean(secondaryActionLabel);

  return (
    <div
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        position: "relative",

        display: "flex",

        flexDirection: "column",

        alignItems,

        justifyContent: "center",

        width: "100%",

        minHeight:
          Math.max(
            80,
            minHeight
          ),

        padding: 24,

        boxSizing: "border-box",

        ...style,
      }}
    >
      <div
        style={{
          display: "flex",

          flexDirection: "column",

          alignItems,

          width: "100%",

          maxWidth:
            maxWidth > 0
              ? maxWidth
              : undefined,

          textAlign,

          boxSizing: "border-box",
        }}
      >
        {(icon ||
          showDefaultIcon) && (
          <div
            className={
              iconClassName
            }
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              marginBottom: 16,

              color: iconColor,
            }}
          >
            {icon ?? (
              <DefaultEmptyIcon
                color={
                  iconColor
                }
              />
            )}
          </div>
        )}

        {title && (
          <div
            className={
              titleClassName
            }
            style={{
              color: "#111827",

              fontSize: 18,

              fontWeight: 700,

              lineHeight: 1.35,

              wordBreak: "break-word",
            }}
          >
            {title}
          </div>
        )}

        {description && (
          <div
            className={
              descriptionClassName
            }
            style={{
              marginTop:
                title
                  ? 7
                  : 0,

              color: "#6b7280",

              fontSize: 13,

              fontWeight: 400,

              lineHeight: 1.6,

              wordBreak: "break-word",
            }}
          >
            {description}
          </div>
        )}

        {children && (
          <div
            style={{
              width: "100%",

              marginTop: 14,

              boxSizing: "border-box",
            }}
          >
            {children}
          </div>
        )}

        {hasActions && (
          <div
            className={
              actionsClassName
            }
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent:
                align === "left"
                  ? "flex-start"
                  : align === "right"
                    ? "flex-end"
                    : "center",

              flexWrap: "wrap",

              gap: 8,

              width: "100%",

              marginTop: 18,
            }}
          >
            {primaryActionLabel && (
              <button
                type="button"
                className={
                  primaryActionClassName
                }
                onClick={() =>
                  onPrimaryAction?.()
                }
                style={{
                  minHeight: 36,

                  padding:
                    "8px 14px",

                  border: `1px solid ${primaryColor}`,

                  borderRadius: 7,

                  background:
                    primaryColor,

                  color: "#ffffff",

                  fontSize: 13,

                  fontWeight: 600,

                  lineHeight: 1.2,

                  cursor:
                    onPrimaryAction
                      ? "pointer"
                      : "default",

                  boxSizing: "border-box",
                }}
              >
                {
                  primaryActionLabel
                }
              </button>
            )}

            {secondaryActionLabel && (
              <button
                type="button"
                className={
                  secondaryActionClassName
                }
                onClick={() =>
                  onSecondaryAction?.()
                }
                style={{
                  minHeight: 36,

                  padding:
                    "8px 14px",

                  border:
                    "1px solid #d1d5db",

                  borderRadius: 7,

                  background:
                    "#ffffff",

                  color: "#374151",

                  fontSize: 13,

                  fontWeight: 600,

                  lineHeight: 1.2,

                  cursor:
                    onSecondaryAction
                      ? "pointer"
                      : "default",

                  boxSizing: "border-box",
                }}
              >
                {
                  secondaryActionLabel
                }
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}