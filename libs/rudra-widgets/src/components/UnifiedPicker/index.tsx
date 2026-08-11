import React, { useEffect, useState } from "react";
import {
  ImageIcon,
  Smile,
  Sticker,
} from "lucide-react";

export type UnifiedPickerType =
  | "emoji"
  | "sticker"
  | "gif";

export interface UnifiedPickerTab {
  id: UnifiedPickerType;
  label?: string;
  items?: any[];
  disabled?: boolean;
}

export interface UnifiedPickerSelectPayload {
  type: UnifiedPickerType;
  item: any;
  index: number;
}

export interface UnifiedPickerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className" | "onSelect"
  > {
  /**
   * Picker tabs and their data.
   * @type|complex
   * @schema {"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"label":{"type":"string"},"items":{"type":"array"},"disabled":{"type":"boolean"}}}}
   */
  tabs?: UnifiedPickerTab[];

  /** @select|emoji|sticker|gif */
  defaultTab?: UnifiedPickerType;

  /**
   * Function-based repeated item.
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((context: {
        item: any;
        index: number;
        type: UnifiedPickerType;
        select: () => void;
      }) => React.ReactNode);

  showSearch?: boolean;

  /** @translate */
  searchPlaceholder?: string;

  loading?: boolean;

  /**
   * Root customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"64","label":"Small"},
   *       {"key":"80","label":"Medium"},
   *       {"key":"96","label":"Large"},
   *       {"key":"full","label":"Full Width"}
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
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"2xl","label":"2XL"}
   *     ]
   *   },
   *   {
   *     "key":"Shadow",
   *     "prefix":"shadow",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Items container customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Grid Columns",
   *     "prefix":"grid-cols",
   *     "type":"select",
   *     "options":[
   *       {"key":"4","label":"4 Columns"},
   *       {"key":"5","label":"5 Columns"},
   *       {"key":"6","label":"6 Columns"},
   *       {"key":"8","label":"8 Columns"}
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
   *       {"key":"3","label":"Large"},
   *       {"key":"4","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding",
   *     "prefix":"p",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   }
   * ]
   */
  itemsClassName?: string;

  /**
   * Tab customization.
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
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   }
   * ]
   */
  tabClassName?: string;

  /**
   * Active tab customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"blue-600","label":"Blue"},
   *       {"key":"green-600","label":"Green"},
   *       {"key":"gray-900","label":"Dark"},
   *       {"key":"white","label":"White"}
   *     ]
   *   },
   *   {
   *     "key":"Border Color",
   *     "prefix":"border",
   *     "type":"select",
   *     "options":[
   *       {"key":"blue-600","label":"Blue"},
   *       {"key":"green-600","label":"Green"},
   *       {"key":"gray-900","label":"Dark"},
   *       {"key":"white","label":"White"}
   *     ]
   *   }
   * ]
   */
  activeTabClassName?: string;

  /** @type|function */
  onSelect?: (
    payload: UnifiedPickerSelectPayload
  ) => void;

  /** @type|function */
  onTabChange?: (
    type: UnifiedPickerType
  ) => void;

  /** @type|function */
  onSearch?: (
    query: string,
    type: UnifiedPickerType
  ) => void;
}

const DEFAULT_TABS: UnifiedPickerTab[] = [
  {
    id: "emoji",
    label: "Emoji",
    items: [],
  },
  {
    id: "sticker",
    label: "Stickers",
    items: [],
  },
  {
    id: "gif",
    label: "GIF",
    items: [],
  },
];

function getTabIcon(
  type: UnifiedPickerType
) {
  if (type === "emoji") {
    return <Smile size={16} />;
  }

  if (type === "sticker") {
    return <Sticker size={16} />;
  }

  return <ImageIcon size={16} />;
}

export default function UnifiedPicker({
  tabs = DEFAULT_TABS,
  defaultTab = "emoji",
  children,
  showSearch = false,
  searchPlaceholder = "Search...",
  loading = false,
  className = "",
  itemsClassName = "",
  tabClassName = "",
  activeTabClassName = "",
  onSelect,
  onTabChange,
  onSearch,
  ...props
}: UnifiedPickerProps) {
  const safeTabs =
    Array.isArray(tabs)
      ? tabs.filter(
          (tab) => !tab.disabled
        )
      : [];

  const initialTab =
    safeTabs.find(
      (tab) =>
        tab.id === defaultTab
    )?.id ||
    safeTabs[0]?.id ||
    "emoji";

  const [activeTab, setActiveTab] =
    useState<UnifiedPickerType>(
      initialTab
    );

  const [query, setQuery] =
    useState("");

  useEffect(() => {
    const exists =
      safeTabs.some(
        (tab) =>
          tab.id === activeTab
      );

    if (
      !exists &&
      safeTabs.length
    ) {
      setActiveTab(
        safeTabs[0].id
      );
    }
  }, [tabs, activeTab]);

  const activeTabData =
    safeTabs.find(
      (tab) =>
        tab.id === activeTab
    );

  const safeItems =
    Array.isArray(
      activeTabData?.items
    )
      ? activeTabData!.items!
      : [];

  const changeTab = (
    type: UnifiedPickerType
  ) => {
    setActiveTab(type);
    setQuery("");

    onTabChange?.(type);
  };

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.value;

    setQuery(value);

    onSearch?.(
      value,
      activeTab
    );
  };

  const selectItem = (
    item: any,
    index: number
  ) => {
    onSelect?.({
      type: activeTab,
      item,
      index,
    });
  };

  if (!safeTabs.length) {
    return (
      <div
        {...props}
        className={[
          "rounded-xl border-2 border-dashed border-purple-200",
          "bg-purple-50 p-8",
          "text-center text-sm text-purple-600",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        Unified Picker
        (No Data Bound)

        {typeof children ===
        "function" ? (
          <div className="mt-4">
            {children({
              item: null,
              index: 0,
              type: "emoji",
              select: () => {},
            })}
          </div>
        ) : (
          children
        )}
      </div>
    );
  }

  return (
    <div
      {...props}
      className={[
        "w-full overflow-hidden",
        "rounded-xl border border-gray-200",
        "bg-white shadow-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center border-b border-gray-200">
        {safeTabs.map(
          (tab) => {
            const active =
              tab.id ===
              activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={
                  active
                }
                onClick={() =>
                  changeTab(
                    tab.id
                  )
                }
                className={[
                  "flex flex-1",
                  "items-center",
                  "justify-center",
                  "gap-1.5",
                  "border-b-2",
                  "border-transparent",
                  "px-3 py-3",
                  "text-xs",
                  "font-medium",
                  "text-gray-500",
                  "transition-colors",
                  "hover:text-gray-900",
                  tabClassName,
                  active
                    ? "border-blue-600 text-blue-600"
                    : "",
                  active
                    ? activeTabClassName
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {getTabIcon(
                  tab.id
                )}

                <span>
                  {tab.label ||
                    tab.id}
                </span>
              </button>
            );
          }
        )}
      </div>

      {showSearch && (
        <div className="border-b border-gray-100 p-2">
          <input
            type="text"
            value={query}
            placeholder={
              searchPlaceholder
            }
            onChange={
              handleSearch
            }
            className={[
              "w-full",
              "rounded-lg",
              "border border-gray-200",
              "bg-gray-50",
              "px-3 py-2",
              "text-sm",
              "outline-none",
              "focus:border-blue-500",
            ].join(" ")}
          />
        </div>
      )}

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        ) : safeItems.length ===
          0 ? (
          <div className="flex min-h-40 items-center justify-center p-6 text-center text-sm text-gray-400">
            No {activeTabData?.label || activeTab} available
          </div>
        ) : (
          <div
            className={[
              "grid grid-cols-6 gap-2 p-3",
              itemsClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {safeItems.map(
              (
                item,
                index
              ) => (
                <React.Fragment
                  key={
                    item?.id ??
                    item?.url ??
                    index
                  }
                >
                  {typeof children ===
                  "function"
                    ? children({
                        item,
                        index,
                        type:
                          activeTab,
                        select:
                          () =>
                            selectItem(
                              item,
                              index
                            ),
                      })
                    : children ||
                      renderDefaultItem(
                        activeTab,
                        item,
                        () =>
                          selectItem(
                            item,
                            index
                          )
                      )}
                </React.Fragment>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function renderDefaultItem(
  type: UnifiedPickerType,
  item: any,
  onClick: () => void
) {
  if (type === "emoji") {
    const emoji =
      typeof item === "string"
        ? item
        : item?.emoji ||
          item?.value ||
          "😀";

    return (
      <button
        type="button"
        onClick={onClick}
        className="flex aspect-square items-center justify-center rounded-lg text-2xl hover:bg-gray-100"
      >
        {emoji}
      </button>
    );
  }

  const url =
    typeof item === "string"
      ? item
      : item?.url ||
        item?.src;

  if (!url) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="aspect-square overflow-hidden rounded-lg bg-gray-100"
    >
      <img
        src={url}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </button>
  );
}