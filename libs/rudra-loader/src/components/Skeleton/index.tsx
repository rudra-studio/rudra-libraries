import React from "react";

export type SkeletonVariant =
  | "text"
  | "rectangle"
  | "circle";

export interface SkeletonProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /** @select|text|rectangle|circle */
  variant?: SkeletonVariant;

  animated?: boolean;

  /**
   * Skeleton customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"4","label":"4"},
   *       {"key":"6","label":"6"},
   *       {"key":"8","label":"8"},
   *       {"key":"10","label":"10"},
   *       {"key":"12","label":"12"},
   *       {"key":"16","label":"16"},
   *       {"key":"20","label":"20"},
   *       {"key":"24","label":"24"},
   *       {"key":"32","label":"32"},
   *       {"key":"40","label":"40"},
   *       {"key":"48","label":"48"},
   *       {"key":"64","label":"64"},
   *       {"key":"full","label":"Full Width"}
   *     ]
   *   },
   *   {
   *     "key":"Height",
   *     "prefix":"h",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"2"},
   *       {"key":"3","label":"3"},
   *       {"key":"4","label":"4"},
   *       {"key":"5","label":"5"},
   *       {"key":"6","label":"6"},
   *       {"key":"8","label":"8"},
   *       {"key":"10","label":"10"},
   *       {"key":"12","label":"12"},
   *       {"key":"16","label":"16"},
   *       {"key":"20","label":"20"},
   *       {"key":"24","label":"24"},
   *       {"key":"32","label":"32"},
   *       {"key":"40","label":"40"}
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
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"2xl","label":"2XL"},
   *       {"key":"full","label":"Full"}
   *     ]
   *   }
   * ]
   */
  className?: string;
}

export default function Skeleton({
  variant = "text",
  animated = true,
  className = "",
  ...props
}: SkeletonProps) {
  const variantClass =
    variant === "circle"
      ? "size-10 rounded-full"
      : variant === "rectangle"
        ? "h-24 w-full rounded-lg"
        : "h-4 w-full rounded";

  return (
    <div
      {...props}
      aria-hidden="true"
      className={[
        "bg-gray-200",
        variantClass,
        animated ? "animate-pulse" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}