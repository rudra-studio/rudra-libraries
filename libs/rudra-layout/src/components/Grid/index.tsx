import React from "react";

export type GridElement =
  | "div"
  | "section"
  | "article"
  | "main"
  | "aside";

export interface GridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|div|section|article|main|aside */
  as?: GridElement;

  /**
   * Explicit equal-width column count. This is preferred when the desired
   * count is data-driven or not represented by a Tailwind utility.
   *
   * @type|number
   */
  columns?: number;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Columns",
   *     "prefix":"grid-cols",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"1 Column"},
   *       {"key":"2","label":"2 Columns"},
   *       {"key":"3","label":"3 Columns"},
   *       {"key":"4","label":"4 Columns"},
   *       {"key":"5","label":"5 Columns"},
   *       {"key":"6","label":"6 Columns"},
   *       {"key":"7","label":"7 Columns"},
   *       {"key":"8","label":"8 Columns"},
   *       {"key":"9","label":"9 Columns"},
   *       {"key":"10","label":"10 Columns"},
   *       {"key":"11","label":"11 Columns"},
   *       {"key":"12","label":"12 Columns"}
   *     ]
   *   },
   *   {
   *     "key":"Rows",
   *     "prefix":"grid-rows",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"1 Row"},
   *       {"key":"2","label":"2 Rows"},
   *       {"key":"3","label":"3 Rows"},
   *       {"key":"4","label":"4 Rows"},
   *       {"key":"5","label":"5 Rows"},
   *       {"key":"6","label":"6 Rows"}
   *     ]
   *   },
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"1"},
   *       {"key":"2","label":"2"},
   *       {"key":"3","label":"3"},
   *       {"key":"4","label":"4"},
   *       {"key":"6","label":"6"},
   *       {"key":"8","label":"8"},
   *       {"key":"10","label":"10"},
   *       {"key":"12","label":"12"}
   *     ]
   *   },
   *   {
   *     "key":"Column Gap",
   *     "prefix":"gap-x",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"},
   *       {"key":"8","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Row Gap",
   *     "prefix":"gap-y",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"},
   *       {"key":"8","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Align Items",
   *     "prefix":"items",
   *     "type":"select",
   *     "options":[
   *       {"key":"start","label":"Start"},
   *       {"key":"center","label":"Center"},
   *       {"key":"end","label":"End"},
   *       {"key":"stretch","label":"Stretch"}
   *     ]
   *   },
   *   {
   *     "key":"Justify Items",
   *     "prefix":"justify-items",
   *     "type":"select",
   *     "options":[
   *       {"key":"start","label":"Start"},
   *       {"key":"center","label":"Center"},
   *       {"key":"end","label":"End"},
   *       {"key":"stretch","label":"Stretch"}
   *     ]
   *   },
   *   {
   *     "key":"Auto Flow",
   *     "prefix":"grid-flow",
   *     "type":"select",
   *     "options":[
   *       {"key":"row","label":"Row"},
   *       {"key":"col","label":"Column"},
   *       {"key":"dense","label":"Dense"},
   *       {"key":"row-dense","label":"Row Dense"},
   *       {"key":"col-dense","label":"Column Dense"}
   *     ]
   *   },
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full Width"},
   *       {"key":"screen","label":"Screen"}
   *     ]
   *   },
   *   {
   *     "key":"Padding",
   *     "prefix":"p",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"},
   *       {"key":"8","label":"Extra Large"},
   *       {"key":"12","label":"2XL"}
   *     ]
   *   }
   * ]
   */
  className?: string;
}

export default function Grid({
  children,
  as = "div",
  columns,
  className = "",
  style,
  ...props
}: GridProps) {
  const Element = as;

  return (
    <Element
      {...props}
      className={["grid", className].filter(Boolean).join(" ")}
      style={
        columns
          ? {
              ...style,
              gridTemplateColumns: `repeat(${Math.max(1, Math.min(12, Math.floor(columns)))}, minmax(0, 1fr))`,
            }
          : style
      }
    >
      {children}
    </Element>
  );
}