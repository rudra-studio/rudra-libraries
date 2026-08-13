import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Command,
  Search,
  X,
} from "lucide-react";

export interface CommandPaletteItem {
  id: string;

  label: string;

  description?: string;

  group?: string;

  /**
   * Additional searchable words.
   */
  keywords?: string[];

  /**
   * Visual shortcut label.
   *
   * Example:
   * "⌘ P"
   */
  shortcut?: string;

  disabled?: boolean;

  data?: any;
}

export interface CommandPaletteRenderContext {
  item:
    | CommandPaletteItem
    | null;

  index: number;

  active: boolean;

  query: string;

  select: () => void;
}

export interface CommandPaletteProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Available commands.
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
   *       "description":{"type":"string"},
   *       "group":{"type":"string"},
   *       "keywords":{
   *         "type":"array",
   *         "items":{"type":"string"}
   *       },
   *       "shortcut":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: CommandPaletteItem[];

  /**
   * Custom command item renderer.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: CommandPaletteRenderContext
      ) => React.ReactNode);

  /**
   * Controlled open state.
   */
  open?: boolean;

  /**
   * Initial open state.
   */
  defaultOpen?: boolean;

  /**
   * Controlled search query.
   */
  query?: string;

  /**
   * Initial search query.
   */
  defaultQuery?: string;

  /**
   * Enable Ctrl/Cmd + K.
   */
  enableKeyboardShortcut?: boolean;

  /**
   * Close when a command is selected.
   */
  closeOnSelect?: boolean;

  /**
   * Close when overlay is clicked.
   */
  closeOnOverlayClick?: boolean;

  /**
   * Show command shortcut text.
   */
  showShortcuts?: boolean;

  /**
   * Show group headings.
   */
  showGroups?: boolean;

  /**
   * Search placeholder.
   */
  placeholder?: string;

  /**
   * No results message.
   */
  emptyText?: string;

  /**
   * Dialog title used for
   * accessibility.
   */
  title?: string;

  /**
   * Maximum results area height.
   */
  maxHeight?: number;

  /**
   * Dialog width.
   */
  width?: number;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  overlayClassName?: string;

  /**
   * @type|class
   */
  panelClassName?: string;

  /**
   * @type|class
   */
  inputClassName?: string;

  /**
   * @type|class
   */
  itemClassName?: string;

  /**
   * @type|class
   */
  activeItemClassName?: string;

  /**
   * @type|class
   */
  groupClassName?: string;

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
   * @type|function
   */
  onOpenChange?: (
    open: boolean
  ) => void;

  /**
   * @type|function
   */
  onQueryChange?: (
    query: string
  ) => void;

  /**
   * @type|function
   */
  onItemSelect?: (
    item: CommandPaletteItem,
    index: number
  ) => void;
}

interface IndexedItem {
  item: CommandPaletteItem;

  originalIndex: number;
}

export default function CommandPalette({
  items = [],

  children,

  open,

  defaultOpen = false,

  query,

  defaultQuery = "",

  enableKeyboardShortcut = true,

  closeOnSelect = true,

  closeOnOverlayClick = true,

  showShortcuts = true,

  showGroups = true,

  placeholder =
    "Search commands...",

  emptyText =
    "No commands found",

  title =
    "Command Palette",

  maxHeight = 380,

  width = 560,

  className = "",

  overlayClassName = "",

  panelClassName = "",

  inputClassName = "",

  itemClassName = "",

  activeItemClassName = "",

  groupClassName = "",

  customAttributes = {},

  onOpenChange,

  onQueryChange,

  onItemSelect,

  style,

  ...props
}: CommandPaletteProps) {
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const listRef =
    useRef<HTMLDivElement>(
      null
    );

  const [
    internalOpen,
    setInternalOpen,
  ] = useState(
    defaultOpen
  );

  const [
    internalQuery,
    setInternalQuery,
  ] = useState(
    defaultQuery
  );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const openControlled =
    open !== undefined;

  const queryControlled =
    query !== undefined;

  const resolvedOpen =
    openControlled
      ? open
      : internalOpen;

  const resolvedQuery =
    queryControlled
      ? query
      : internalQuery;

  const setOpen = (
    next: boolean
  ) => {
    if (!openControlled) {
      setInternalOpen(
        next
      );
    }

    onOpenChange?.(
      next
    );
  };

  const setQuery = (
    next: string
  ) => {
    if (!queryControlled) {
      setInternalQuery(
        next
      );
    }

    onQueryChange?.(
      next
    );
  };

  /*
   * Local search.
   */
  const filteredItems =
    useMemo<
      IndexedItem[]
    >(() => {
      const normalizedQuery =
        resolvedQuery
          .trim()
          .toLowerCase();

      return items
        .map(
          (
            item,
            originalIndex
          ) => ({
            item,
            originalIndex,
          })
        )
        .filter(
          ({
            item,
          }) => {
            if (
              !normalizedQuery
            ) {
              return true;
            }

            const searchable =
              [
                item.label,

                item.description ??
                  "",

                item.group ??
                  "",

                ...(
                  item.keywords ??
                  []
                ),
              ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(
              normalizedQuery
            );
          }
        );
    }, [
      items,
      resolvedQuery,
    ]);

  /*
   * Group filtered commands while
   * retaining their flat keyboard
   * navigation index.
   */
  const groups =
    useMemo(
      () => {
        const result =
          new Map<
            string,
            IndexedItem[]
          >();

        filteredItems.forEach(
          (
            entry
          ) => {
            const group =
              showGroups
                ? entry.item
                    .group ??
                  ""
                : "";

            const existing =
              result.get(
                group
              );

            if (existing) {
              existing.push(
                entry
              );
            } else {
              result.set(
                group,
                [entry]
              );
            }
          }
        );

        return [
          ...result.entries(),
        ];
      },
      [
        filteredItems,
        showGroups,
      ]
    );

  /*
   * Reset active item when search
   * results change.
   */
  useEffect(() => {
    const firstEnabled =
      filteredItems.findIndex(
        ({
          item,
        }) =>
          !item.disabled
      );

    setActiveIndex(
      firstEnabled >= 0
        ? firstEnabled
        : 0
    );
  }, [
    resolvedQuery,
    items,
  ]);

  /*
   * Focus search field whenever
   * palette opens.
   */
  useEffect(() => {
    if (!resolvedOpen) {
      return;
    }

    const frame =
      requestAnimationFrame(
        () => {
          inputRef.current
            ?.focus();
        }
      );

    return () => {
      cancelAnimationFrame(
        frame
      );
    };
  }, [
    resolvedOpen,
  ]);

  /*
   * Global Cmd/Ctrl + K shortcut.
   */
  useEffect(() => {
    if (
      !enableKeyboardShortcut
    ) {
      return;
    }

    const handleKeyDown =
      (
        event: KeyboardEvent
      ) => {
        if (
          (
            event.metaKey ||
            event.ctrlKey
          ) &&
          event.key.toLowerCase() ===
            "k"
        ) {
          event.preventDefault();

          setOpen(
            !resolvedOpen
          );

          return;
        }

        if (
          event.key ===
            "Escape" &&
          resolvedOpen
        ) {
          event.preventDefault();

          setOpen(
            false
          );
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    enableKeyboardShortcut,
    resolvedOpen,
  ]);

  const findNextEnabled =
    (
      start: number,
      direction:
        | 1
        | -1
    ) => {
      if (
        filteredItems.length ===
        0
      ) {
        return -1;
      }

      let index =
        start;

      for (
        let count = 0;
        count <
        filteredItems.length;
        count++
      ) {
        index +=
          direction;

        if (
          index <
          0
        ) {
          index =
            filteredItems.length -
            1;
        }

        if (
          index >=
          filteredItems.length
        ) {
          index =
            0;
        }

        if (
          !filteredItems[
            index
          ].item.disabled
        ) {
          return index;
        }
      }

      return -1;
    };

  const selectItem = (
    entry:
      IndexedItem
  ) => {
    if (
      entry.item.disabled
    ) {
      return;
    }

    onItemSelect?.(
      entry.item,
      entry.originalIndex
    );

    if (
      closeOnSelect
    ) {
      setOpen(
        false
      );
    }
  };

  const handleInputKeyDown =
    (
      event:
        React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (
        event.key ===
        "ArrowDown"
      ) {
        event.preventDefault();

        const next =
          findNextEnabled(
            activeIndex,
            1
          );

        if (
          next >= 0
        ) {
          setActiveIndex(
            next
          );
        }

        return;
      }

      if (
        event.key ===
        "ArrowUp"
      ) {
        event.preventDefault();

        const next =
          findNextEnabled(
            activeIndex,
            -1
          );

        if (
          next >= 0
        ) {
          setActiveIndex(
            next
          );
        }

        return;
      }

      if (
        event.key ===
        "Enter"
      ) {
        event.preventDefault();

        const entry =
          filteredItems[
            activeIndex
          ];

        if (entry) {
          selectItem(
            entry
          );
        }

        return;
      }

      if (
        event.key ===
        "Escape"
      ) {
        event.preventDefault();

        setOpen(
          false
        );
      }
    };

  /*
   * Builder preview when closed and
   * no external controller exists.
   */
  if (!resolvedOpen) {
    return (
      <div
        className={
          className
        }
        {...customAttributes}
        {...props}
        style={{
          display:
            "inline-flex",

          alignItems:
            "center",

          gap: 8,

          padding:
            "8px 10px",

          border:
            "1px dashed #d1d5db",

          borderRadius:
            8,

          color:
            "#6b7280",

          fontSize:
            12,

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        <Command
          size={15}
        />

        Command Palette

        {enableKeyboardShortcut && (
          <span
            style={{
              marginLeft:
                4,

              padding:
                "2px 5px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                4,

              background:
                "#f9fafb",

              color:
                "#6b7280",

              fontSize:
                10,

              fontFamily:
                "monospace",
            }}
          >
            Ctrl/⌘ K
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        overlayClassName
      }
      role="presentation"
      onMouseDown={(
        event
      ) => {
        if (
          !closeOnOverlayClick ||
          event.target !==
            event.currentTarget
        ) {
          return;
        }

        setOpen(
          false
        );
      }}
      style={{
        position:
          "fixed",

        inset: 0,

        display:
          "flex",

        alignItems:
          "flex-start",

        justifyContent:
          "center",

        padding:
          "12vh 16px 24px",

        background:
          "rgba(15,23,42,0.38)",

        backdropFilter:
          "blur(2px)",

        WebkitBackdropFilter:
          "blur(2px)",

        zIndex:
          9999,

        boxSizing:
          "border-box",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          title
        }
        className={`${className} ${panelClassName}`}
        {...customAttributes}
        {...props}
        style={{
          position:
            "relative",

          width:
            "100%",

          maxWidth:
            width,

          overflow:
            "hidden",

          border:
            "1px solid #e5e7eb",

          borderRadius:
            14,

          background:
            "#ffffff",

          boxShadow:
            "0 24px 70px rgba(15,23,42,0.24)",

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        {/* Search */}
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: 10,

            height:
              52,

            padding:
              "0 14px",

            borderBottom:
              "1px solid #e5e7eb",

            boxSizing:
              "border-box",
          }}
        >
          <Search
            size={18}
            color="#9ca3af"
          />

          <input
            ref={
              inputRef
            }
            value={
              resolvedQuery
            }
            placeholder={
              placeholder
            }
            onChange={(
              event
            ) =>
              setQuery(
                event.target
                  .value
              )
            }
            onKeyDown={
              handleInputKeyDown
            }
            autoComplete="off"
            spellCheck={
              false
            }
            className={
              inputClassName
            }
            style={{
              width:
                "100%",

              flex: 1,

              border: 0,

              outline:
                "none",

              background:
                "transparent",

              color:
                "#111827",

              fontSize:
                14,

              lineHeight:
                1.4,
            }}
          />

          <button
            type="button"
            title="Close"
            aria-label="Close"
            onClick={() =>
              setOpen(
                false
              )
            }
            style={{
              width: 30,
              height: 30,

              display:
                "inline-flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexShrink:
                0,

              padding: 0,

              border: 0,

              borderRadius:
                6,

              background:
                "transparent",

              color:
                "#9ca3af",

              cursor:
                "pointer",
            }}
          >
            <X
              size={16}
            />
          </button>
        </div>

        {/* Results */}
        <div
          ref={
            listRef
          }
          role="listbox"
          style={{
            maxHeight,

            overflowY:
              "auto",

            padding:
              6,

            boxSizing:
              "border-box",
          }}
        >
          {filteredItems.length ===
          0 ? (
            <div
              style={{
                padding:
                  "32px 16px",

                textAlign:
                  "center",

                color:
                  "#9ca3af",

                fontSize:
                  13,
              }}
            >
              {typeof children ===
              "function"
                ? children({
                    item: null,
                    index: 0,
                    active:
                      false,
                    query:
                      resolvedQuery,
                    select:
                      () => {},
                  })
                : emptyText}
            </div>
          ) : (
            groups.map(
              ([
                groupName,
                entries,
              ]) => (
                <div
                  key={
                    groupName ||
                    "__default"
                  }
                  style={{
                    marginBottom:
                      4,
                  }}
                >
                  {showGroups &&
                    groupName && (
                      <div
                        className={
                          groupClassName
                        }
                        style={{
                          padding:
                            "8px 10px 5px",

                          color:
                            "#9ca3af",

                          fontSize:
                            10,

                          fontWeight:
                            700,

                          letterSpacing:
                            "0.07em",

                          textTransform:
                            "uppercase",
                        }}
                      >
                        {
                          groupName
                        }
                      </div>
                    )}

                  {entries.map(
                    (
                      entry
                    ) => {
                      const flatIndex =
                        filteredItems.indexOf(
                          entry
                        );

                      const active =
                        flatIndex ===
                        activeIndex;

                      const disabled =
                        Boolean(
                          entry.item
                            .disabled
                        );

                      const context:
                        CommandPaletteRenderContext =
                        {
                          item:
                            entry.item,

                          index:
                            entry.originalIndex,

                          active,

                          query:
                            resolvedQuery,

                          select:
                            () =>
                              selectItem(
                                entry
                              ),
                        };

                      return (
                        <button
                          key={
                            entry
                              .item
                              .id
                          }
                          type="button"
                          role="option"
                          aria-selected={
                            active
                          }
                          disabled={
                            disabled
                          }
                          className={`${itemClassName} ${
                            active
                              ? activeItemClassName
                              : ""
                          }`}
                          onMouseEnter={() => {
                            if (
                              !disabled
                            ) {
                              setActiveIndex(
                                flatIndex
                              );
                            }
                          }}
                          onClick={() =>
                            selectItem(
                              entry
                            )
                          }
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "space-between",

                            gap: 14,

                            width:
                              "100%",

                            minHeight:
                              46,

                            padding:
                              "8px 10px",

                            border: 0,

                            borderRadius:
                              8,

                            background:
                              active
                                ? "#f3f4f6"
                                : "transparent",

                            color:
                              disabled
                                ? "#9ca3af"
                                : "#111827",

                            textAlign:
                              "left",

                            cursor:
                              disabled
                                ? "not-allowed"
                                : "pointer",

                            opacity:
                              disabled
                                ? 0.5
                                : 1,

                            boxSizing:
                              "border-box",
                          }}
                        >
                          {typeof children ===
                          "function" ? (
                            <div
                              style={{
                                flex: 1,
                                minWidth:
                                  0,
                              }}
                            >
                              {children(
                                context
                              )}
                            </div>
                          ) : children ? (
                            children
                          ) : (
                            <div
                              style={{
                                minWidth:
                                  0,

                                flex: 1,
                              }}
                            >
                              <div
                                style={{
                                  color:
                                    "inherit",

                                  fontSize:
                                    13,

                                  fontWeight:
                                    500,

                                  lineHeight:
                                    1.4,

                                  overflow:
                                    "hidden",

                                  textOverflow:
                                    "ellipsis",

                                  whiteSpace:
                                    "nowrap",
                                }}
                              >
                                {
                                  entry
                                    .item
                                    .label
                                }
                              </div>

                              {entry.item
                                .description && (
                                <div
                                  style={{
                                    marginTop:
                                      2,

                                    color:
                                      "#9ca3af",

                                    fontSize:
                                      11,

                                    lineHeight:
                                      1.4,

                                    overflow:
                                      "hidden",

                                    textOverflow:
                                      "ellipsis",

                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >
                                  {
                                    entry
                                      .item
                                      .description
                                  }
                                </div>
                              )}
                            </div>
                          )}

                          {showShortcuts &&
                            entry.item
                              .shortcut && (
                              <span
                                style={{
                                  flexShrink:
                                    0,

                                  padding:
                                    "3px 6px",

                                  border:
                                    "1px solid #e5e7eb",

                                  borderRadius:
                                    5,

                                  background:
                                    "#ffffff",

                                  color:
                                    "#6b7280",

                                  fontSize:
                                    10,

                                  fontFamily:
                                    "ui-monospace, monospace",

                                  lineHeight:
                                    1,
                                }}
                              >
                                {
                                  entry
                                    .item
                                    .shortcut
                                }
                              </span>
                            )}
                        </button>
                      );
                    }
                  )}
                </div>
              )
            )
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: 12,

            minHeight:
              34,

            padding:
              "5px 12px",

            borderTop:
              "1px solid #e5e7eb",

            background:
              "#f9fafb",

            color:
              "#9ca3af",

            fontSize:
              10,

            boxSizing:
              "border-box",
          }}
        >
          <span>
            ↑ ↓ Navigate
          </span>

          <span>
            ↵ Select
          </span>

          <span>
            Esc Close
          </span>
        </div>
      </div>
    </div>
  );
}