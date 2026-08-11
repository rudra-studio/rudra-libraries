import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ImageIcon,
  Search,
  Smile,
  Sticker,
} from "lucide-react";
import * as EmojiMartReact from "@emoji-mart/react";
import emojiDataModule from "@emoji-mart/data";

const Picker =
  (EmojiMartReact as any).default?.default ??
  (EmojiMartReact as any).default ??
  (EmojiMartReact as any).Picker;

const emojiData =
  (emojiDataModule as any)?.default ??
  emojiDataModule;

export type ExpressionType =
  | "emoji"
  | "gif"
  | "sticker";

export type ExpressionTheme =
  | "light"
  | "dark"
  | "auto";

export interface ExpressionMediaItem {
  id: string;
  url: string;
  previewUrl?: string;
  title?: string;
  raw?: any;
}

export type ExpressionSelectPayload =
  | {
    type: "emoji";
    emoji: string;
    data?: any;
  }
  | {
    type: "gif" | "sticker";
    url: string;
    previewUrl?: string;
    item: ExpressionMediaItem;
    data?: any;
  };

export interface ExpressionPickerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "onSelect"
  > {
  klipyApiKey?: string;

  /** @select|emoji|gif|sticker */
  defaultTab?: ExpressionType;

  /** @select|light|dark|auto */
  theme?: ExpressionTheme;

  showEmoji?: boolean;
  showGif?: boolean;
  showSticker?: boolean;

  limit?: number;
  debounceMs?: number;

  /**
   * Override KLIPY GIF search endpoint when required.
   * {apiKey} will automatically be replaced.
   */
  gifSearchEndpoint?: string;

  /**
   * Override KLIPY GIF trending endpoint when required.
   * {apiKey} will automatically be replaced.
   */
  gifTrendingEndpoint?: string;

  /**
   * Override KLIPY Sticker search endpoint when required.
   * {apiKey} will automatically be replaced.
   */
  stickerSearchEndpoint?: string;

  /**
   * Override KLIPY Sticker trending endpoint when required.
   * {apiKey} will automatically be replaced.
   */
  stickerTrendingEndpoint?: string;

  showAttribution?: boolean;

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
   *   }
   * ]
   */
  className?: string;

  /**
   * GIF / Sticker grid customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Columns",
   *     "prefix":"grid-cols",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"2 Columns"},
   *       {"key":"3","label":"3 Columns"},
   *       {"key":"4","label":"4 Columns"},
   *       {"key":"5","label":"5 Columns"}
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
   *       {"key":"3","label":"Large"}
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
  gridClassName?: string;

  /**
   * Tab customization.
   * @type|class
   */
  tabClassName?: string;

  /**
   * Active tab customization.
   * @type|class
   */
  activeTabClassName?: string;

  /** @type|function */
  onSelect?: (
    payload: ExpressionSelectPayload
  ) => void;

  /** @type|function */
  onError?: (error: any) => void;
}

function getNested(
  object: any,
  path: string
) {
  return path
    .split(".")
    .reduce(
      (value, key) =>
        value?.[key],
      object
    );
}

function firstUrl(
  item: any,
  paths: string[]
) {
  for (const path of paths) {
    const value =
      getNested(item, path);

    if (
      typeof value === "string" &&
      value
    ) {
      return value;
    }
  }

  return undefined;
}

function normalizeMediaItem(
  item: any,
  index: number
): ExpressionMediaItem | null {
  const url = firstUrl(
    item,
    [
      "file.hd.gif.url",
      "file.gif.url",
      "file.md.gif.url",
      "file.sm.gif.url",
      "file.hd.webp.url",
      "file.md.webp.url",
      "file.sm.webp.url",

      "media_formats.gif.url",
      "media_formats.mediumgif.url",
      "media_formats.tinygif.url",
      "media_formats.webp.url",

      "images.original.url",
      "images.fixed_height.url",

      "url",
      "src",
    ]
  );

  if (!url) {
    return null;
  }

  const previewUrl =
    firstUrl(
      item,
      [
        "file.xs.webp.url",
        "file.xs.jpg.url",
        "file.sm.webp.url",
        "file.sm.jpg.url",
        "file.md.webp.url",

        "media_formats.tinygif.url",
        "media_formats.nanogif.url",
        "media_formats.preview.url",

        "images.fixed_width_small.url",
        "images.fixed_height_small.url",
      ]
    ) || url;

  return {
    id: String(
      item?.id ??
      item?.slug ??
      index
    ),
    url,
    previewUrl,
    title:
      item?.title ||
      item?.name ||
      "",
    raw: item,
  };
}

function extractItems(
  response: any
): any[] {
  if (
    Array.isArray(response?.results)
  ) {
    return response.results;
  }

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.data?.data
    )
  ) {
    return response.data.data;
  }

  return [];
}

function replaceApiKey(
  endpoint: string,
  apiKey: string
) {
  return endpoint.replace(
    "{apiKey}",
    encodeURIComponent(apiKey)
  );
}

export default function ExpressionPicker({
  klipyApiKey = "",
  defaultTab = "emoji",
  theme = "auto",

  showEmoji = true,
  showGif = true,
  showSticker = true,

  limit = 24,
  debounceMs = 350,

  gifSearchEndpoint,
  gifTrendingEndpoint,
  stickerSearchEndpoint,
  stickerTrendingEndpoint,

  showAttribution = true,

  className = "",
  gridClassName = "",
  tabClassName = "",
  activeTabClassName = "",

  onSelect,
  onError,
  ...props
}: ExpressionPickerProps) {
  const availableTabs =
    useMemo(() => {
      const tabs: ExpressionType[] =
        [];

      if (showEmoji) {
        tabs.push("emoji");
      }

      if (showGif) {
        tabs.push("gif");
      }

      if (showSticker) {
        tabs.push("sticker");
      }

      return tabs;
    }, [
      showEmoji,
      showGif,
      showSticker,
    ]);

  const initialTab =
    availableTabs.includes(
      defaultTab
    )
      ? defaultTab
      : availableTabs[0] ||
      "emoji";

  const [activeTab, setActiveTab] =
    useState<ExpressionType>(
      initialTab
    );

  const [query, setQuery] =
    useState("");

  const [items, setItems] =
    useState<
      ExpressionMediaItem[]
    >([]);

  const [loading, setLoading] =
    useState(false);

  const requestRef =
    useRef<AbortController | null>(
      null
    );

  const emojiContainerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !availableTabs.includes(
        activeTab
      ) &&
      availableTabs.length
    ) {
      setActiveTab(
        availableTabs[0]
      );
    }
  }, [
    availableTabs,
    activeTab,
  ]);

  /*
   * Emoji Mart renders an <em-emoji-picker>
   * custom element internally.
   *
   * Styling the React <Picker /> directly
   * doesn't always apply width to that host.
   *
   * So we find the actual custom element and
   * make it match the complete parent width.
   */
  useEffect(() => {
    if (activeTab !== "emoji") {
      return;
    }

    const container =
      emojiContainerRef.current;

    if (!container) {
      return;
    }

    let resizeObserver:
      | ResizeObserver
      | null = null;

    const applyPickerWidth = () => {
      const picker =
        container.querySelector(
          "em-emoji-picker"
        ) as HTMLElement | null;

      if (!picker) {
        return false;
      }

      picker.style.display = "block";
      picker.style.width = "100%";
      picker.style.maxWidth = "100%";
      picker.style.minWidth = "0";
      picker.style.boxSizing =
        "border-box";

      return true;
    };

    const startResizeObserver = () => {
      if (
        typeof ResizeObserver ===
        "undefined"
      ) {
        return;
      }

      resizeObserver?.disconnect();

      resizeObserver =
        new ResizeObserver(() => {
          applyPickerWidth();
        });

      resizeObserver.observe(
        container
      );
    };

    if (applyPickerWidth()) {
      startResizeObserver();

      return () => {
        resizeObserver?.disconnect();
      };
    }

    const mutationObserver =
      new MutationObserver(() => {
        if (applyPickerWidth()) {
          mutationObserver.disconnect();
          startResizeObserver();
        }
      });

    mutationObserver.observe(
      container,
      {
        childList: true,
        subtree: true,
      }
    );

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, [
    activeTab,
    theme,
  ]);

  const buildEndpoint = (
    type: "gif" | "sticker",
    mode: "search" | "trending"
  ) => {
    if (!klipyApiKey) {
      return null;
    }

    const resource =
      type === "gif"
        ? "gifs"
        : "stickers";

    let customEndpoint:
      | string
      | undefined;

    if (
      type === "gif" &&
      mode === "search"
    ) {
      customEndpoint =
        gifSearchEndpoint;
    }

    if (
      type === "gif" &&
      mode === "trending"
    ) {
      customEndpoint =
        gifTrendingEndpoint;
    }

    if (
      type === "sticker" &&
      mode === "search"
    ) {
      customEndpoint =
        stickerSearchEndpoint;
    }

    if (
      type === "sticker" &&
      mode === "trending"
    ) {
      customEndpoint =
        stickerTrendingEndpoint;
    }

    if (customEndpoint) {
      return replaceApiKey(
        customEndpoint,
        klipyApiKey
      );
    }

    return `https://api.klipy.com/api/v1/${encodeURIComponent(
      klipyApiKey
    )}/${resource}/${mode}`;
  };

  const loadMedia = async (
    type: "gif" | "sticker",
    searchQuery: string
  ) => {
    if (!klipyApiKey) {
      setItems([]);
      return;
    }

    requestRef.current?.abort();

    const controller =
      new AbortController();

    requestRef.current =
      controller;

    const trimmed =
      searchQuery.trim();

    const mode =
      trimmed.length > 0
        ? "search"
        : "trending";

    const endpoint =
      buildEndpoint(
        type,
        mode
      );

    if (!endpoint) {
      return;
    }

    try {
      setLoading(true);

      const url =
        new URL(endpoint);

      if (trimmed) {
        url.searchParams.set(
          "q",
          trimmed
        );
      }

      url.searchParams.set(
        "per_page",
        String(limit)
      );

      url.searchParams.set(
        "limit",
        String(limit)
      );

      const response =
        await fetch(
          url.toString(),
          {
            signal:
              controller.signal,
          }
        );

      if (!response.ok) {
        throw new Error(
          `KLIPY request failed (${response.status})`
        );
      }

      const json =
        await response.json();

      const normalized =
        extractItems(json)
          .map(
            normalizeMediaItem
          )
          .filter(
            (
              item
            ): item is ExpressionMediaItem =>
              Boolean(item)
          );

      setItems(normalized);
    } catch (error: any) {
      if (
        error?.name ===
        "AbortError"
      ) {
        return;
      }

      setItems([]);
      onError?.(error);
    } finally {
      if (
        !controller.signal.aborted
      ) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      activeTab === "emoji"
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        loadMedia(
          activeTab,
          query
        );
      }, debounceMs);

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    activeTab,
    query,
    klipyApiKey,
    limit,
    debounceMs,
  ]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  const handleEmojiSelect = (
    emoji: any
  ) => {
    if (!emoji?.native) {
      return;
    }

    onSelect?.({
      type: "emoji",
      emoji: emoji.native,
      data: emoji,
    });
  };

  const handleMediaSelect = (
    item: ExpressionMediaItem
  ) => {
    if (
      activeTab !== "gif" &&
      activeTab !== "sticker"
    ) {
      return;
    }

    onSelect?.({
      type: activeTab,
      url: item.url,
      previewUrl:
        item.previewUrl,
      item,
      data: item.raw,
    });
  };

  if (!availableTabs.length) {
    return null;
  }

  return (
    <div
      {...props}
      className={[
        "w-full min-w-0 overflow-hidden",
        "rounded-xl",
        "border border-gray-200",
        "bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex w-full border-b border-gray-200">
        {showEmoji && (
          <PickerTab
            active={
              activeTab ===
              "emoji"
            }
            label="Emoji"
            icon={
              <Smile size={16} />
            }
            className={
              tabClassName
            }
            activeClassName={
              activeTabClassName
            }
            onClick={() => {
              setActiveTab(
                "emoji"
              );
              setQuery("");
            }}
          />
        )}

        {showGif && (
          <PickerTab
            active={
              activeTab === "gif"
            }
            label="GIF"
            icon={
              <ImageIcon
                size={16}
              />
            }
            className={
              tabClassName
            }
            activeClassName={
              activeTabClassName
            }
            onClick={() => {
              setActiveTab("gif");
              setQuery("");
            }}
          />
        )}

        {showSticker && (
          <PickerTab
            active={
              activeTab ===
              "sticker"
            }
            label="Stickers"
            icon={
              <Sticker size={16} />
            }
            className={
              tabClassName
            }
            activeClassName={
              activeTabClassName
            }
            onClick={() => {
              setActiveTab(
                "sticker"
              );
              setQuery("");
            }}
          />
        )}
      </div>

      {activeTab ===
        "emoji" ? (
        <div
          ref={emojiContainerRef}
          className="w-full min-w-0 overflow-hidden"
        >
          <Picker
            data={emojiData}
            theme={theme}
            dynamicWidth
            previewPosition="none"
            onEmojiSelect={
              handleEmojiSelect
            }
          />
        </div>
      ) : (
        <>
          <div className="w-full border-b border-gray-100 p-2">
            <div className="relative w-full">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target
                      .value
                  )
                }
                placeholder="Search KLIPY"
                className={[
                  "w-full rounded-lg",
                  "border border-gray-200",
                  "bg-gray-50",
                  "py-2 pl-9 pr-3",
                  "text-sm",
                  "outline-none",
                  "focus:border-blue-500",
                ].join(" ")}
              />
            </div>
          </div>

          {!klipyApiKey ? (
            <div className="flex min-h-48 w-full items-center justify-center p-6 text-center">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  KLIPY API key
                  required
                </div>

                <div className="mt-1 text-xs text-gray-400">
                  Add your KLIPY
                  test API key to
                  load{" "}
                  {activeTab ===
                    "gif"
                    ? "GIFs"
                    : "stickers"}
                  .
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="flex min-h-48 w-full items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            </div>
          ) : items.length ===
            0 ? (
            <div className="flex min-h-48 w-full items-center justify-center p-6 text-sm text-gray-400">
              No results
            </div>
          ) : (
            <div
              className={[
                "grid w-full grid-cols-3",
                "gap-2 p-2",
                "max-h-80",
                "overflow-y-auto",
                "content-start",
                gridClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {items.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    title={
                      item.title
                    }
                    onClick={() =>
                      handleMediaSelect(
                        item
                      )
                    }
                    className={[
                      "relative",
                      "overflow-hidden",
                      "rounded-lg",
                      "bg-gray-100",
                      activeTab ===
                        "sticker"
                        ? "aspect-square"
                        : "aspect-[4/3]",
                    ]
                      .filter(
                        Boolean
                      )
                      .join(" ")}
                  >
                    <img
                      src={
                        item.previewUrl ||
                        item.url
                      }
                      alt={
                        item.title ||
                        ""
                      }
                      loading="lazy"
                      className={[
                        "h-full w-full",
                        activeTab ===
                          "sticker"
                          ? "object-contain"
                          : "object-cover",
                      ].join(" ")}
                    />
                  </button>
                )
              )}
            </div>
          )}

          {showAttribution && (
            <div className="w-full border-t border-gray-100 px-3 py-2 text-right text-[10px] text-gray-400">
              Powered by KLIPY
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface PickerTabProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

function PickerTab({
  label,
  icon,
  active = false,
  className = "",
  activeClassName = "",
  onClick,
}: PickerTabProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "flex min-w-0 flex-1",
        "items-center",
        "justify-center",
        "gap-1.5",
        "border-b-2",
        "px-3 py-3",
        "text-xs font-medium",
        "transition-colors",

        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-900",

        className,

        active
          ? activeClassName
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}