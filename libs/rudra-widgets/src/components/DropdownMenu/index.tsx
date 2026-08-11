import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownMenuItem {
  id: string | number;
  label: string;
  disabled?: boolean;
  divider?: boolean;
  node?: React.ReactNode | ((context: any) => React.ReactNode);
}

export interface DropdownMenuProps {
  trigger?: React.ReactNode;

  /** @translate */
  triggerLabel?: string;

  /**
   * Dropdown items with optional individual nodes.
   * @type|complex
   * @schema {"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"label":{"type":"string"},"disabled":{"type":"boolean"},"divider":{"type":"boolean"},"node":{"type":"nodeFunction"}}}}
   */
  items?: DropdownMenuItem[];

  /**
   * Fallback template when an item does not have its own node.
   * @nodeFunction
   */
  templateContent?: (payload: {
    item: DropdownMenuItem;
    index: number;
  }) => React.ReactNode;

  closeOnSelect?: boolean;
  closeOnOutsideClick?: boolean;

  /** @select|left|right */
  align?: "left" | "right";

  /**
   * Root customization.
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
   *   }
   * ]
   */
  className?: string;

  /**
   * Trigger customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"blue-600","label":"Blue"}
   *     ]
   *   },
   *   {
   *     "key":"Padding X",
   *     "prefix":"px",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"},
   *       {"key":"6","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding Y",
   *     "prefix":"py",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"}
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
   *       {"key":"full","label":"Full"}
   *     ]
   *   }
   * ]
   */
  triggerClassName?: string;

  /**
   * Menu customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"40","label":"Small"},
   *       {"key":"48","label":"Medium"},
   *       {"key":"56","label":"Large"},
   *       {"key":"64","label":"Extra Large"},
   *       {"key":"72","label":"2XL"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"gray-900","label":"Gray 900"}
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
   *   },
   *   {
   *     "key":"Shadow",
   *     "prefix":"shadow",
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
  menuClassName?: string;

  /**
   * Menu item customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Padding X",
   *     "prefix":"px",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding Y",
   *     "prefix":"py",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"}
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
   *       {"key":"blue-600","label":"Blue"},
   *       {"key":"red-600","label":"Red"}
   *     ]
   *   }
   * ]
   */
  itemClassName?: string;

  /** @type|function */
  onSelect?: (item: DropdownMenuItem, index: number) => void;

  /** @type|function */
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  triggerLabel = "Menu",
  items = [],
  templateContent,
  closeOnSelect = true,
  closeOnOutsideClick = true,
  align = "left",
  className = "",
  triggerClassName = "",
  menuClassName = "",
  itemClassName = "",
  onSelect,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const setMenuOpen = (value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
  };

  useEffect(() => {
    if (!open || !closeOnOutsideClick) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, closeOnOutsideClick]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (
    item: DropdownMenuItem,
    index: number
  ) => {
    if (item.disabled || item.divider) return;

    onSelect?.(item, index);

    if (closeOnSelect) {
      setMenuOpen(false);
    }
  };

  const renderItem = (
    item: DropdownMenuItem,
    index: number
  ) => {
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

    return item.label;
  };

  return (
    <div
      ref={rootRef}
      className={[
        "relative inline-block",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setMenuOpen(!open)}
        className={[
          "inline-flex items-center justify-center gap-2",
          "rounded-md px-4 py-2",
          "bg-white text-sm font-medium text-slate-700",
          "border border-slate-200",
          "hover:bg-slate-50",
          triggerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {trigger || (
          <>
            <span>{triggerLabel}</span>

            <ChevronDown
              size={16}
              className={[
                "transition-transform duration-200",
                open ? "rotate-180" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={[
            "absolute top-full z-50 mt-2",
            "min-w-48 overflow-hidden",
            "rounded-lg border border-slate-200",
            "bg-white p-1 shadow-lg",
            align === "right"
              ? "right-0"
              : "left-0",
            menuClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={item.id}
                  role="separator"
                  className="my-1 border-t border-slate-200"
                />
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() =>
                  handleSelect(item, index)
                }
                className={[
                  "flex w-full items-center",
                  "rounded-md px-3 py-2",
                  "text-left text-sm text-slate-700",
                  "transition-colors",
                  "hover:bg-slate-100",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  itemClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {renderItem(item, index)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;