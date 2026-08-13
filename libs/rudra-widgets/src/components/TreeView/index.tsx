import React, {
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";

export type TreeViewSelectionMode =
  | "none"
  | "single"
  | "multiple";

export interface TreeViewItem {
  /**
   * Unique item id.
   */
  id: string;

  /**
   * Display label.
   */
  label: string;

  /**
   * Nested items.
   */
  children?: TreeViewItem[];

  /**
   * Prevent interaction.
   */
  disabled?: boolean;

  /**
   * Optional custom application data.
   */
  data?: any;
}

export interface TreeViewRenderContext {
  /**
   * Null only for Rudra's empty
   * builder preview.
   */
  item: TreeViewItem | null;

  index: number;

  depth: number;

  expanded: boolean;

  selected: boolean;

  hasChildren: boolean;

  /**
   * Expand / collapse this item.
   */
  toggle: () => void;

  /**
   * Select this item.
   */
  select: () => void;
}

export interface TreeViewProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className" | "onSelect"
  > {
  /**
   * Tree data.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","label"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "label":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "children":{"type":"array"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: TreeViewItem[];

  /**
   * Custom item content.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: TreeViewRenderContext
      ) => React.ReactNode);

  /**
   * @select|none|single|multiple
   */
  selectionMode?: TreeViewSelectionMode;

  /**
   * Controlled selected ids.
   *
   * @type|json
   */
  selectedIds?: string[];

  /**
   * Initial uncontrolled selected ids.
   *
   * @type|json
   */
  defaultSelectedIds?: string[];

  /**
   * Controlled expanded ids.
   *
   * @type|json
   */
  expandedIds?: string[];

  /**
   * Initial uncontrolled expanded ids.
   *
   * @type|json
   */
  defaultExpandedIds?: string[];

  /**
   * Automatically expand all nodes
   * when first rendered.
   */
  defaultExpandAll?: boolean;

  /**
   * Clicking an item row also
   * expands/collapses it.
   *
   * The expander button always works
   * independently.
   */
  expandOnItemClick?: boolean;

  /**
   * Display built-in folder/file icons.
   */
  showDefaultIcons?: boolean;

  /**
   * Display nesting guide lines.
   */
  showLines?: boolean;

  /**
   * Left indentation for each level.
   */
  indent?: number;

  /**
   * Empty builder message.
   */
  emptyText?: string;

  /**
   * Root customization.
   *
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"full","label":"Full Width"},
   *       {"key":"fit","label":"Fit Content"},
   *       {"key":"auto","label":"Auto"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Individual tree row customization.
   *
   * @type|class
   */
  itemClassName?: string;

  /**
   * Item label customization.
   *
   * @type|class
   */
  labelClassName?: string;

  /**
   * Children container customization.
   *
   * @type|class
   */
  childrenClassName?: string;

  /**
   * Selected item customization.
   *
   * @type|class
   */
  selectedClassName?: string;

  /**
   * Dynamic HTML attributes.
   *
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string
  >;

  /**
   * Fired when a normal item row
   * is clicked.
   *
   * Expander clicks do not trigger it.
   *
   * @type|function
   */
  onItemClick?: (
    item: TreeViewItem,
    index: number,
    depth: number
  ) => void;

  /**
   * @type|function
   */
  onSelectionChange?: (
    selectedIds: string[],
    item: TreeViewItem
  ) => void;

  /**
   * @type|function
   */
  onExpandedChange?: (
    expandedIds: string[],
    item: TreeViewItem,
    expanded: boolean
  ) => void;
}

function collectExpandableIds(
  items: TreeViewItem[]
) {
  const ids: string[] = [];

  const walk = (
    list: TreeViewItem[]
  ) => {
    list.forEach((item) => {
      if (
        item.children &&
        item.children.length > 0
      ) {
        ids.push(item.id);

        walk(item.children);
      }
    });
  };

  walk(items);

  return ids;
}

export default function TreeView({
  items = [],

  children,

  selectionMode = "single",

  selectedIds,

  defaultSelectedIds = [],

  expandedIds,

  defaultExpandedIds = [],

  defaultExpandAll = false,

  expandOnItemClick = false,

  showDefaultIcons = true,

  showLines = true,

  indent = 22,

  emptyText = "Add tree items",

  className = "w-full",

  itemClassName = "",

  labelClassName = "",

  childrenClassName = "",

  selectedClassName = "",

  customAttributes = {},

  onItemClick,

  onSelectionChange,

  onExpandedChange,

  style,

  ...props
}: TreeViewProps) {
  const allExpandableIds =
    useMemo(
      () =>
        collectExpandableIds(
          items
        ),
      [items]
    );

  const [
    internalSelectedIds,
    setInternalSelectedIds,
  ] = useState<string[]>(
    defaultSelectedIds
  );

  const [
    internalExpandedIds,
    setInternalExpandedIds,
  ] = useState<string[]>(
    defaultExpandAll
      ? allExpandableIds
      : defaultExpandedIds
  );

  const selectedControlled =
    selectedIds !== undefined;

  const expandedControlled =
    expandedIds !== undefined;

  const resolvedSelectedIds =
    selectedControlled
      ? selectedIds
      : internalSelectedIds;

  const resolvedExpandedIds =
    expandedControlled
      ? expandedIds
      : internalExpandedIds;

  const selectedSet =
    useMemo(
      () =>
        new Set(
          resolvedSelectedIds
        ),
      [resolvedSelectedIds]
    );

  const expandedSet =
    useMemo(
      () =>
        new Set(
          resolvedExpandedIds
        ),
      [resolvedExpandedIds]
    );

  const toggleItem = (
    item: TreeViewItem
  ) => {
    if (
      item.disabled ||
      !item.children?.length
    ) {
      return;
    }

    const currentlyExpanded =
      expandedSet.has(
        item.id
      );

    const next =
      currentlyExpanded
        ? resolvedExpandedIds.filter(
            (id) =>
              id !== item.id
          )
        : [
            ...resolvedExpandedIds,
            item.id,
          ];

    if (!expandedControlled) {
      setInternalExpandedIds(
        next
      );
    }

    onExpandedChange?.(
      next,
      item,
      !currentlyExpanded
    );
  };

  const selectItem = (
    item: TreeViewItem
  ) => {
    if (
      item.disabled ||
      selectionMode ===
        "none"
    ) {
      return;
    }

    let next: string[];

    if (
      selectionMode ===
      "single"
    ) {
      next =
        selectedSet.has(
          item.id
        )
          ? []
          : [item.id];
    } else {
      next =
        selectedSet.has(
          item.id
        )
          ? resolvedSelectedIds.filter(
              (id) =>
                id !== item.id
            )
          : [
              ...resolvedSelectedIds,
              item.id,
            ];
    }

    if (!selectedControlled) {
      setInternalSelectedIds(
        next
      );
    }

    onSelectionChange?.(
      next,
      item
    );
  };

  const renderItems = (
    list: TreeViewItem[],
    depth: number
  ): React.ReactNode => {
    return list.map(
      (
        item,
        index
      ) => {
        const hasChildren =
          Boolean(
            item.children?.length
          );

        const expanded =
          hasChildren &&
          expandedSet.has(
            item.id
          );

        const selected =
          selectedSet.has(
            item.id
          );

        const context:
          TreeViewRenderContext = {
          item,
          index,
          depth,
          expanded,
          selected,
          hasChildren,

          toggle:
            () =>
              toggleItem(
                item
              ),

          select:
            () =>
              selectItem(
                item
              ),
        };

        return (
          <div
            key={
              item.id
            }
            role="treeitem"
            aria-expanded={
              hasChildren
                ? expanded
                : undefined
            }
            aria-selected={
              selectionMode !==
              "none"
                ? selected
                : undefined
            }
            aria-disabled={
              item.disabled
            }
            style={{
              position:
                "relative",

              width:
                "100%",

              boxSizing:
                "border-box",
            }}
          >
            <div
              className={`${itemClassName} ${
                selected
                  ? selectedClassName
                  : ""
              }`}
              tabIndex={
                item.disabled
                  ? -1
                  : 0
              }
              onClick={() => {
                if (
                  item.disabled
                ) {
                  return;
                }

                selectItem(
                  item
                );

                if (
                  expandOnItemClick &&
                  hasChildren
                ) {
                  toggleItem(
                    item
                  );
                }

                onItemClick?.(
                  item,
                  index,
                  depth
                );
              }}
              onKeyDown={(
                event
              ) => {
                if (
                  item.disabled
                ) {
                  return;
                }

                if (
                  event.key ===
                    "Enter" ||
                  event.key ===
                    " "
                ) {
                  event.preventDefault();

                  selectItem(
                    item
                  );

                  onItemClick?.(
                    item,
                    index,
                    depth
                  );

                  return;
                }

                if (
                  event.key ===
                    "ArrowRight" &&
                  hasChildren &&
                  !expanded
                ) {
                  event.preventDefault();

                  toggleItem(
                    item
                  );

                  return;
                }

                if (
                  event.key ===
                    "ArrowLeft" &&
                  hasChildren &&
                  expanded
                ) {
                  event.preventDefault();

                  toggleItem(
                    item
                  );
                }
              }}
              style={{
                position:
                  "relative",

                display:
                  "flex",

                alignItems:
                  "center",

                gap: 6,

                width:
                  "100%",

                minHeight:
                  34,

                paddingTop:
                  4,

                paddingRight:
                  8,

                paddingBottom:
                  4,

                paddingLeft:
                  6 +
                  depth *
                    Math.max(
                      0,
                      indent
                    ),

                borderRadius:
                  7,

                background:
                  selected
                    ? "#eff6ff"
                    : "transparent",

                color:
                  item.disabled
                    ? "#9ca3af"
                    : selected
                      ? "#1d4ed8"
                      : "#374151",

                cursor:
                  item.disabled
                    ? "not-allowed"
                    : "pointer",

                opacity:
                  item.disabled
                    ? 0.55
                    : 1,

                userSelect:
                  "none",

                outline:
                  "none",

                boxSizing:
                  "border-box",
              }}
            >
              {/*
               * Expand button.
               *
               * stopPropagation is
               * intentional:
               *
               * expanding children must
               * not fire onItemClick.
               */}
              <button
                type="button"
                aria-label={
                  expanded
                    ? "Collapse"
                    : "Expand"
                }
                disabled={
                  item.disabled ||
                  !hasChildren
                }
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  toggleItem(
                    item
                  );
                }}
                style={{
                  width: 22,
                  height: 22,

                  padding: 0,

                  display:
                    "inline-flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  flexShrink:
                    0,

                  border: 0,

                  background:
                    "transparent",

                  color:
                    "inherit",

                  cursor:
                    hasChildren &&
                    !item.disabled
                      ? "pointer"
                      : "default",

                  opacity:
                    hasChildren
                      ? 1
                      : 0,

                  pointerEvents:
                    hasChildren
                      ? "auto"
                      : "none",
                }}
              >
                {expanded ? (
                  <ChevronDown
                    size={16}
                  />
                ) : (
                  <ChevronRight
                    size={16}
                  />
                )}
              </button>

              {showDefaultIcons && (
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,

                    height: 18,

                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    flexShrink:
                      0,
                  }}
                >
                  {hasChildren ? (
                    expanded ? (
                      <FolderOpen
                        size={16}
                      />
                    ) : (
                      <Folder
                        size={16}
                      />
                    )
                  ) : (
                    <File
                      size={15}
                    />
                  )}
                </span>
              )}

              <div
                className={
                  labelClassName
                }
                style={{
                  minWidth: 0,

                  flex: 1,

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace:
                    "nowrap",

                  fontSize:
                    14,

                  lineHeight:
                    1.4,
                }}
              >
                {typeof children ===
                "function"
                  ? children(
                      context
                    )
                  : children ??
                    item.label}
              </div>
            </div>

            {hasChildren &&
              expanded && (
                <div
                  className={
                    childrenClassName
                  }
                  role="group"
                  style={{
                    position:
                      "relative",

                    width:
                      "100%",

                    boxSizing:
                      "border-box",
                  }}
                >
                  {showLines && (
                    <div
                      aria-hidden="true"
                      style={{
                        position:
                          "absolute",

                        top: 0,

                        bottom: 0,

                        left:
                          17 +
                          depth *
                            Math.max(
                              0,
                              indent
                            ),

                        width: 1,

                        background:
                          "#e5e7eb",

                        pointerEvents:
                          "none",
                      }}
                    />
                  )}

                  {renderItems(
                    item.children!,
                    depth + 1
                  )}
                </div>
              )}
          </div>
        );
      }
    );
  };

  /*
   * Builder-friendly empty preview.
   */
  if (
    items.length === 0
  ) {
    return (
      <div
        className={
          className
        }
        {...customAttributes}
        {...props}
        style={{
          width:
            "100%",

          padding:
            12,

          border:
            "1px dashed #d1d5db",

          borderRadius:
            8,

          color:
            "#9ca3af",

          fontSize:
            13,

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        {typeof children ===
        "function"
          ? children({
              item: null,
              index: 0,
              depth: 0,
              expanded:
                false,
              selected:
                false,
              hasChildren:
                false,
              toggle:
                () => {},
              select:
                () => {},
            })
          : emptyText}
      </div>
    );
  }

  return (
    <div
      role="tree"
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        width:
          "100%",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {renderItems(
        items,
        0
      )}
    </div>
  );
}