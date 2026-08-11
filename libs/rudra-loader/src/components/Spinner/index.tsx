import React from "react";

export interface SpinnerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Accessible loading label.
   * @translate
   */
  label?: string;

  showLabel?: boolean;

  /**
   * Spinner customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Size",
   *     "prefix":"size",
   *     "type":"select",
   *     "options":[
   *       {"key":"3","label":"Extra Small"},
   *       {"key":"4","label":"Small"},
   *       {"key":"5","label":"Medium"},
   *       {"key":"6","label":"Large"},
   *       {"key":"8","label":"Extra Large"},
   *       {"key":"10","label":"2XL"},
   *       {"key":"12","label":"3XL"}
   *     ]
   *   },
   *   {
   *     "key":"Border Width",
   *     "prefix":"border",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Thin"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"8","label":"Thick"}
   *     ]
   *   },
   *   {
   *     "key":"Color",
   *     "prefix":"border-t",
   *     "type":"select",
   *     "options":[
   *       {"key":"blue-600","label":"Blue"},
   *       {"key":"green-600","label":"Green"},
   *       {"key":"red-600","label":"Red"},
   *       {"key":"purple-600","label":"Purple"},
   *       {"key":"gray-700","label":"Gray"},
   *       {"key":"white","label":"White"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   }
   * ]
   */
  className?: string;

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
   *       {"key":"base","label":"Medium"},
   *       {"key":"lg","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-500","label":"Gray"},
   *       {"key":"gray-700","label":"Dark Gray"},
   *       {"key":"white","label":"White"},
   *       {"key":"black","label":"Black"},
   *       {"key":"blue-600","label":"Blue"}
   *     ]
   *   }
   * ]
   */
  labelClassName?: string;
}

export default function Spinner({
  label = "Loading",
  showLabel = false,
  className = "",
  labelClassName = "",
  ...props
}: SpinnerProps) {
  return (
    <div
      {...props}
      role="status"
      aria-label={label}
      className="inline-flex items-center gap-2"
    >
      <span
        aria-hidden="true"
        className={[
          "size-6 animate-spin rounded-full",
          "border-2 border-gray-200",
          "border-t-blue-600",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {showLabel && (
        <span
          className={[
            "text-sm text-gray-500",
            labelClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </span>
      )}
    </div>
  );
}