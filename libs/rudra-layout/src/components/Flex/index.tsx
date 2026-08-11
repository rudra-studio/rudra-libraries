import React from "react";

export type FlexElement =
  | "div"
  | "section"
  | "article"
  | "main"
  | "aside"
  | "nav";

export interface FlexProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|div|section|article|main|aside|nav */
  as?: FlexElement;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Direction",
   *     "prefix":"flex",
   *     "type":"select",
   *     "options":[
   *       {"key":"row","label":"Row"},
   *       {"key":"row-reverse","label":"Row Reverse"},
   *       {"key":"col","label":"Column"},
   *       {"key":"col-reverse","label":"Column Reverse"}
   *     ]
   *   },
   *   {
   *     "key":"Align",
   *     "prefix":"items",
   *     "type":"select",
   *     "options":[
   *       {"key":"start","label":"Start"},
   *       {"key":"center","label":"Center"},
   *       {"key":"end","label":"End"},
   *       {"key":"stretch","label":"Stretch"},
   *       {"key":"baseline","label":"Baseline"}
   *     ]
   *   },
   *   {
   *     "key":"Justify",
   *     "prefix":"justify",
   *     "type":"select",
   *     "options":[
   *       {"key":"start","label":"Start"},
   *       {"key":"center","label":"Center"},
   *       {"key":"end","label":"End"},
   *       {"key":"between","label":"Space Between"},
   *       {"key":"around","label":"Space Around"},
   *       {"key":"evenly","label":"Space Evenly"}
   *     ]
   *   },
   *   {
   *     "key":"Wrap",
   *     "prefix":"flex",
   *     "type":"select",
   *     "options":[
   *       {"key":"nowrap","label":"No Wrap"},
   *       {"key":"wrap","label":"Wrap"},
   *       {"key":"wrap-reverse","label":"Wrap Reverse"}
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
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full"},
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
   *       {"key":"8","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  className?: string;
}

export default function Flex({
  children,
  as = "div",
  className = "",
  ...props
}: FlexProps) {
  const Element = as;

  return (
    <Element
      {...props}
      className={["flex", className].filter(Boolean).join(" ")}
    >
      {children}
    </Element>
  );
}