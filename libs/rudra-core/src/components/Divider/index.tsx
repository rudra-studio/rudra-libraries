import React from "react";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|horizontal|vertical */
  orientation?: DividerOrientation;

  /**
   * @type|class
   * @schema [{"key":"Color","prefix":"border","type":"select","options":[{"key":"gray-100","label":"Gray 100"},{"key":"gray-200","label":"Gray 200"},{"key":"gray-300","label":"Gray 300"},{"key":"gray-500","label":"Gray 500"},{"key":"gray-700","label":"Gray 700"},{"key":"gray-800","label":"Gray 800"},{"key":"black","label":"Black"},{"key":"white","label":"White"}]},{"key":"Margin Y","prefix":"my","type":"select","options":[{"key":"0","label":"None"},{"key":"2","label":"Small"},{"key":"4","label":"Medium"},{"key":"6","label":"Large"},{"key":"8","label":"Extra Large"}]},{"key":"Margin X","prefix":"mx","type":"select","options":[{"key":"0","label":"None"},{"key":"2","label":"Small"},{"key":"4","label":"Medium"},{"key":"6","label":"Large"},{"key":"8","label":"Extra Large"}]}]
   */
  className?: string;

  /**
   * @type|class
   * @schema [{"key":"Text Color","prefix":"text","type":"select","options":[{"key":"gray-400","label":"Gray 400"},{"key":"gray-500","label":"Gray 500"},{"key":"gray-600","label":"Gray 600"},{"key":"gray-700","label":"Gray 700"},{"key":"white","label":"White"},{"key":"black","label":"Black"}]},{"key":"Font Size","prefix":"text","type":"select","options":[{"key":"xs","label":"Extra Small"},{"key":"sm","label":"Small"},{"key":"base","label":"Base"}]}]
   */
  labelClassName?: string;
}

export default function Divider({
  children,
  orientation = "horizontal",
  className = "",
  labelClassName = "",
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        {...props}
        role="separator"
        aria-orientation="vertical"
        className={[
          "self-stretch border-l border-gray-200 dark:border-gray-700",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  if (!children) {
    return (
      <div
        {...props}
        role="separator"
        aria-orientation="horizontal"
        className={[
          "w-full border-t border-gray-200 dark:border-gray-700",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  return (
    <div
      {...props}
      role="separator"
      aria-orientation="horizontal"
      className={[
        "flex w-full items-center gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />

      <div
        className={[
          "shrink-0 text-sm text-gray-500 dark:text-gray-400",
          labelClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>

      <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
    </div>
  );
}