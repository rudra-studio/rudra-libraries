import React from "react";

export type DividerOrientation =
  | "horizontal"
  | "vertical";

export interface DividerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  children?: React.ReactNode; /* @type|node|@optional */

  orientation?: DividerOrientation; /* @select|horizontal|vertical */

  /**
   * @type|class
   * @schema [{
   *   "key": "Color",
   *   "prefix": "border",
   *   "type": "select",
   *   "options": [
   *     {"key": "gray-100", "label": "Gray 100"},
   *     {"key": "gray-200", "label": "Gray 200"},
   *     {"key": "gray-300", "label": "Gray 300"},
   *     {"key": "gray-500", "label": "Gray 500"},
   *     {"key": "gray-700", "label": "Gray 700"},
   *     {"key": "gray-800", "label": "Gray 800"},
   *     {"key": "black", "label": "Black"},
   *     {"key": "white", "label": "White"}
   *   ]
   * },{
   *   "key": "Margin Y",
   *   "prefix": "my",
   *   "type": "select",
   *   "options": [
   *     {"key": "0", "label": "None"},
   *     {"key": "2", "label": "Small"},
   *     {"key": "4", "label": "Medium"},
   *     {"key": "6", "label": "Large"},
   *     {"key": "8", "label": "Extra Large"}
   *   ]
   * },{
   *   "key": "Margin X",
   *   "prefix": "mx",
   *   "type": "select",
   *   "options": [
   *     {"key": "0", "label": "None"},
   *     {"key": "2", "label": "Small"},
   *     {"key": "4", "label": "Medium"},
   *     {"key": "6", "label": "Large"},
   *     {"key": "8", "label": "Extra Large"}
   *   ]
   * }]
   */
  className?: string;

  /**
   * @type|class
   * @schema [{
   *   "key": "Text Color",
   *   "prefix": "text",
   *   "type": "select",
   *   "options": [
   *     {"key": "gray-400", "label": "Gray 400"},
   *     {"key": "gray-500", "label": "Gray 500"},
   *     {"key": "gray-600", "label": "Gray 600"},
   *     {"key": "gray-700", "label": "Gray 700"},
   *     {"key": "white", "label": "White"},
   *     {"key": "black", "label": "Black"}
   *   ]
   * },{
   *   "key": "Font Size",
   *   "prefix": "text",
   *   "type": "select",
   *   "options": [
   *     {"key": "xs", "label": "Extra Small"},
   *     {"key": "sm", "label": "Small"},
   *     {"key": "base", "label": "Base"}
   *   ]
   * }]
   */
  labelClassName?: string;
}

/**
 * Checks whether React children contain anything
 * that will actually render visibly.
 *
 * Handles:
 * - null
 * - undefined
 * - false
 * - empty strings
 * - whitespace
 * - empty fragments
 */
function hasRenderableContent(
  children: React.ReactNode
): boolean {
  if (
    children === null ||
    children === undefined ||
    typeof children === "boolean"
  ) {
    return false;
  }

  if (typeof children === "string") {
    return children.trim().length > 0;
  }

  if (typeof children === "number") {
    return true;
  }

  if (Array.isArray(children)) {
    return children.some(hasRenderableContent);
  }

  if (
    React.isValidElement(children) &&
    children.type === React.Fragment
  ) {
    return hasRenderableContent(
      (
        children.props as {
          children?: React.ReactNode;
        }
      ).children
    );
  }

  return true;
}

export default function Divider({
  children,
  orientation = "horizontal",
  className = "",
  labelClassName = "",
  ...props
}: DividerProps) {
  const hasLabel =
    orientation === "horizontal" &&
    hasRenderableContent(children);

  /*
   * Vertical divider
   */
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

  /*
   * Horizontal divider without content.
   *
   * Render ONE continuous border.
   * No flex, no gap, no empty center element.
   */
  if (!hasLabel) {
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

  /*
   * Horizontal divider with label.
   */
  return (
    <div
      {...props}
      role="separator"
      aria-orientation="horizontal"
      className={[
        "flex w-full items-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className="
          flex-1
          border-t
          border-gray-200
          dark:border-gray-700
        "
      />

      <div
        className={[
          "shrink-0 px-3 text-sm text-gray-500 dark:text-gray-400",
          labelClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>

      <div
        aria-hidden="true"
        className="
          flex-1
          border-t
          border-gray-200
          dark:border-gray-700
        "
      />
    </div>
  );
}