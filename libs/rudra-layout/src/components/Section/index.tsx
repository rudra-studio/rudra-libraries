import React from "react";

export type SectionElement =
  | "section"
  | "div"
  | "main"
  | "article"
  | "aside";

export interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "className"> {
  children?: React.ReactNode;

  /** @select|section|div|main|article|aside */
  as?: SectionElement;

  /**
   * @type|class
   * @schema [
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
   *     "key":"Min Height",
   *     "prefix":"min-h",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"full","label":"Full"},
   *       {"key":"screen","label":"Screen"}
   *     ]
   *   },
   *   {
   *     "key":"Padding X",
   *     "prefix":"px",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"},
   *       {"key":"8","label":"Extra Large"},
   *       {"key":"12","label":"2XL"},
   *       {"key":"16","label":"3XL"}
   *     ]
   *   },
   *   {
   *     "key":"Padding Y",
   *     "prefix":"py",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"},
   *       {"key":"8","label":"Extra Large"},
   *       {"key":"12","label":"2XL"},
   *       {"key":"16","label":"3XL"},
   *       {"key":"20","label":"4XL"},
   *       {"key":"24","label":"5XL"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-900","label":"Dark"},
   *       {"key":"gray-700","label":"Gray"},
   *       {"key":"white","label":"White"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   },
   *   {
   *     "key":"Overflow",
   *     "prefix":"overflow",
   *     "type":"select",
   *     "options":[
   *       {"key":"visible","label":"Visible"},
   *       {"key":"hidden","label":"Hidden"},
   *       {"key":"auto","label":"Auto"},
   *       {"key":"scroll","label":"Scroll"}
   *     ]
   *   },
   *   {
   *     "key":"Position",
   *     "prefix":"",
   *     "type":"select",
   *     "options":[
   *       {"key":"static","label":"Static"},
   *       {"key":"relative","label":"Relative"},
   *       {"key":"absolute","label":"Absolute"},
   *       {"key":"fixed","label":"Fixed"},
   *       {"key":"sticky","label":"Sticky"}
   *     ]
   *   }
   * ]
   */
  className?: string;
   /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>; 
}

export default function Section({
  children,
  as = "section",
  className = "",
  customAttributes = {},
  ...props
}: SectionProps) {
  const Element = as;

  return (
    <Element
      {...props}
      {...customAttributes}
      className={["w-full", className].filter(Boolean).join(" ")}
    >
      {children}
    </Element>
  );
}