import React from "react";

export interface ProgressBarProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className"
  > {
  value?: number;
  min?: number;
  max?: number;

  showLabel?: boolean;

  /** @translate */
  label?: string;

  /**
   * Root customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"full","label":"Full Width"},
   *       {"key":"64","label":"Small"},
   *       {"key":"80","label":"Medium"},
   *       {"key":"96","label":"Large"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Track customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Height",
   *     "prefix":"h",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Extra Small"},
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"},
   *       {"key":"5","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-200","label":"Gray 200"},
   *       {"key":"gray-300","label":"Gray 300"},
   *       {"key":"gray-700","label":"Gray 700"},
   *       {"key":"gray-800","label":"Gray 800"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"full","label":"Full"}
   *     ]
   *   }
   * ]
   */
  trackClassName?: string;

  /**
   * Progress customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"blue-600","label":"Blue"},
   *       {"key":"green-600","label":"Green"},
   *       {"key":"red-600","label":"Red"},
   *       {"key":"yellow-500","label":"Yellow"},
   *       {"key":"purple-600","label":"Purple"},
   *       {"key":"black","label":"Black"},
   *       {"key":"white","label":"White"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"full","label":"Full"}
   *     ]
   *   }
   * ]
   */
  progressClassName?: string;

  /**
   * Label customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Text Size",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"xs","label":"Extra Small"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"base","label":"Medium"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-500","label":"Gray"},
   *       {"key":"gray-700","label":"Dark Gray"},
   *       {"key":"black","label":"Black"},
   *       {"key":"white","label":"White"}
   *     ]
   *   }
   * ]
   */
  labelClassName?: string;
}

export default function ProgressBar({
  value = 0,
  min = 0,
  max = 100,
  showLabel = false,
  label,
  className = "",
  trackClassName = "",
  progressClassName = "",
  labelClassName = "",
  ...props
}: ProgressBarProps) {
  const safeMin = Number.isFinite(min)
    ? min
    : 0;

  const safeMax =
    Number.isFinite(max) && max > safeMin
      ? max
      : safeMin + 100;

  const safeValue = Math.min(
    Math.max(
      Number.isFinite(value)
        ? value
        : safeMin,
      safeMin
    ),
    safeMax
  );

  const percentage =
    ((safeValue - safeMin) /
      (safeMax - safeMin)) *
    100;

  const displayLabel =
    label ??
    `${Math.round(percentage)}%`;

  return (
    <div
      {...props}
      className={[
        "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showLabel && (
        <div
          className={[
            "mb-1.5 flex items-center justify-between",
            "text-sm text-gray-600",
            labelClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{displayLabel}</span>

          {label && (
            <span>
              {Math.round(
                percentage
              )}
              %
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={safeMin}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        aria-label={
          label || "Progress"
        }
        className={[
          "h-2 w-full overflow-hidden",
          "rounded-full bg-gray-200",
          trackClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "h-full rounded-full",
            "bg-blue-600",
            "transition-[width]",
            "duration-300",
            progressClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}