import React from "react";

export type ScrollAreaElement =
  | "div"
  | "section"
  | "article"
  | "aside";

export interface ScrollAreaProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|div|section|article|aside */
  as?: ScrollAreaElement;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Overflow X",
   *     "prefix":"overflow-x",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"scroll","label":"Scroll"},
   *       {"key":"hidden","label":"Hidden"},
   *       {"key":"visible","label":"Visible"}
   *     ]
   *   },
   *   {
   *     "key":"Overflow Y",
   *     "prefix":"overflow-y",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"scroll","label":"Scroll"},
   *       {"key":"hidden","label":"Hidden"},
   *       {"key":"visible","label":"Visible"}
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
   *     "key":"Height",
   *     "prefix":"h",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"32","label":"Small"},
   *       {"key":"48","label":"Medium"},
   *       {"key":"64","label":"Large"},
   *       {"key":"96","label":"Extra Large"},
   *       {"key":"full","label":"Full Height"},
   *       {"key":"screen","label":"Screen"}
   *     ]
   *   },
   *   {
   *     "key":"Max Height",
   *     "prefix":"max-h",
   *     "type":"select",
   *     "options":[
   *       {"key":"32","label":"Small"},
   *       {"key":"48","label":"Medium"},
   *       {"key":"64","label":"Large"},
   *       {"key":"96","label":"Extra Large"},
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
   *   },
   *   {
   *     "key":"Scroll Snap",
   *     "prefix":"snap",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"x","label":"Horizontal"},
   *       {"key":"y","label":"Vertical"},
   *       {"key":"both","label":"Both"}
   *     ]
   *   },
   *   {
   *     "key":"Scroll Behavior",
   *     "prefix":"scroll",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"smooth","label":"Smooth"}
   *     ]
   *   }
   * ]
   */
  className?: string;
}

export default function ScrollArea({
  children,
  as = "div",
  className = "",
  ...props
}: ScrollAreaProps) {
  const Element = as;

  return (
    <Element
      {...props}
      className={["overflow-auto", className].filter(Boolean).join(" ")}
    >
      {children}
    </Element>
  );
}