import React from "react";

export type AspectRatioElement =
  | "div"
  | "section"
  | "figure";

export interface AspectRatioProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|div|section|figure */
  as?: AspectRatioElement;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Aspect Ratio",
   *     "prefix":"aspect",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"square","label":"1:1 Square"},
   *       {"key":"video","label":"16:9 Video"},
   *       {"key":"[4/3]","label":"4:3"},
   *       {"key":"[3/2]","label":"3:2"},
   *       {"key":"[21/9]","label":"21:9"},
   *       {"key":"[9/16]","label":"9:16 Portrait"}
   *     ]
   *   },
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full Width"},
   *       {"key":"1/2","label":"50%"},
   *       {"key":"2/3","label":"66%"},
   *       {"key":"3/4","label":"75%"}
   *     ]
   *   },
   *   {
   *     "key":"Overflow",
   *     "prefix":"overflow",
   *     "type":"select",
   *     "options":[
   *       {"key":"visible","label":"Visible"},
   *       {"key":"hidden","label":"Hidden"},
   *       {"key":"auto","label":"Auto"}
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

export default function AspectRatio({
  children,
  as = "div",
  className = "",
  ...props
}: AspectRatioProps) {
  const Element = as;

  return (
    <Element
      {...props}
      className={["relative w-full overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Element>
  );
}