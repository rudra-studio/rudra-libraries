import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string | number;
  title: string;
  disabled?: boolean;
  node?: React.ReactNode | ((context: any) => React.ReactNode);
}

export interface AccordionProps {
  /**
   * Accordion items with optional individual node content.
   * @type|complex
   * @schema {"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"disabled":{"type":"boolean"},"node":{"type":"nodeFunction"}}}}
   */
  items?: AccordionItem[];

  /**
   * Global fallback template when an item does not have its own node.
   * @nodeFunction
   */
  templateContent?: (payload: {
    item: AccordionItem;
    index: number;
  }) => React.ReactNode;

  defaultOpenId?: string | number;
  allowMultiple?: boolean;
  collapsible?: boolean;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full Width"}
   *     ]
   *   },
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"gray-900","label":"Gray 900"}
   *     ]
   *   },
   *   {
   *     "key":"Border Color",
   *     "prefix":"border",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-200","label":"Gray 200"},
   *       {"key":"gray-300","label":"Gray 300"},
   *       {"key":"gray-700","label":"Gray 700"},
   *       {"key":"transparent","label":"Transparent"}
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
   *       {"key":"xl","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  itemClassName?: string;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Padding X",
   *     "prefix":"px",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding Y",
   *     "prefix":"py",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-600","label":"Gray 600"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"white","label":"White"},
   *       {"key":"blue-600","label":"Blue"}
   *     ]
   *   },
   *   {
   *     "key":"Font Weight",
   *     "prefix":"font",
   *     "type":"select",
   *     "options":[
   *       {"key":"normal","label":"Normal"},
   *       {"key":"medium","label":"Medium"},
   *       {"key":"semibold","label":"Semi Bold"},
   *       {"key":"bold","label":"Bold"}
   *     ]
   *   }
   * ]
   */
  triggerClassName?: string;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Padding",
   *     "prefix":"p",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"4","label":"Medium"},
   *       {"key":"6","label":"Large"}
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
   *       {"key":"gray-800","label":"Gray 800"}
   *     ]
   *   }
   * ]
   */
  contentClassName?: string;

  /** @type|function */
  onChange?: (openIds: Array<string | number>) => void;
}

export const Accordion: React.FC<AccordionProps> = ({
  items = [],
  templateContent,
  defaultOpenId,
  allowMultiple = false,
  collapsible = true,
  className = "",
  itemClassName = "",
  triggerClassName = "",
  contentClassName = "",
  onChange,
}) => {
  const [openIds, setOpenIds] = useState<Array<string | number>>(
    defaultOpenId !== undefined ? [defaultOpenId] : []
  );

  if (!items.length) return null;

  const handleToggle = (item: AccordionItem) => {
    if (item.disabled) return;

    const isOpen = openIds.includes(item.id);
    let nextOpenIds: Array<string | number>;

    if (allowMultiple) {
      if (isOpen) {
        if (!collapsible) return;
        nextOpenIds = openIds.filter((id) => id !== item.id);
      } else {
        nextOpenIds = [...openIds, item.id];
      }
    } else {
      if (isOpen) {
        if (!collapsible) return;
        nextOpenIds = [];
      } else {
        nextOpenIds = [item.id];
      }
    }

    setOpenIds(nextOpenIds);
    onChange?.(nextOpenIds);
  };

  const renderContent = (item: AccordionItem, index: number) => {
    if (typeof item.node === "function") {
      return item.node({
        item,
        index,
        _builderIndex: index,
      });
    }

    if (item.node) {
      return item.node;
    }

    if (templateContent) {
      return templateContent({
        item,
        index,
        _builderIndex: index,
      } as any);
    }

    return (
      <div className="p-4 text-center text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
        Drop Content for {item.title}
      </div>
    );
  };

  return (
    <div
      className={[
        "flex w-full flex-col gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={[
              "overflow-hidden border border-slate-200 rounded-lg bg-white",
              itemClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <button
              type="button"
              disabled={item.disabled}
              aria-expanded={isOpen}
              onClick={() => handleToggle(item)}
              className={[
                "flex w-full items-center justify-between gap-4 px-4 py-3",
                "text-left text-sm font-semibold text-slate-800",
                "transition-colors hover:bg-slate-50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                triggerClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="flex-1">{item.title}</span>

              <ChevronDown
                size={18}
                className={[
                  "shrink-0 transition-transform duration-200",
                  isOpen ? "rotate-180" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </button>

            {isOpen && (
              <div
                className={[
                  "border-t border-slate-200 p-4",
                  contentClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {renderContent(item, index)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;