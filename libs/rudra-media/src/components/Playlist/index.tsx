import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ListMusic,
  Pause,
  Play,
} from "lucide-react";

export interface PlaylistItem {
  id?: string | number;

  title?: string;

  subtitle?: string;

  src?: string;

  thumbnail?: string;

  duration?: string;

  disabled?: boolean;

  data?: any;
}

export interface PlaylistProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Playlist items.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "properties":{
   *       "id":{"type":"string"},
   *       "title":{"type":"string"},
   *       "subtitle":{"type":"string"},
   *       "src":{"type":"string"},
   *       "thumbnail":{"type":"string"},
   *       "duration":{"type":"string"},
   *       "disabled":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: PlaylistItem[];

  activeIndex?: number;

  defaultActiveIndex?: number;

  playOnSelect?: boolean;

  autoPlayNext?: boolean;

  loopPlaylist?: boolean;

  showIndex?: boolean;

  showThumbnail?: boolean;

  showDuration?: boolean;

  showNativePlayer?: boolean;

  /**
   * Custom playlist item.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: {
          item: PlaylistItem | null;
          index: number;
          active: boolean;
          playing: boolean;
          select: () => void;
          play: () => void;
          pause: () => void;
          toggle: () => void;
        }
      ) => React.ReactNode);

  /**
   * Root customization.
   *
   * @type|class
   */
  className?: string;

  /**
   * Native audio player customization.
   *
   * @type|class
   */
  playerClassName?: string;

  /**
   * Playlist list customization.
   *
   * @type|class
   */
  listClassName?: string;

  /**
   * Playlist item customization.
   *
   * @type|class
   */
  itemClassName?: string;

  /**
   * Active item customization.
   *
   * @type|class
   */
  activeItemClassName?: string;

  /**
   * Thumbnail customization.
   *
   * @type|class
   */
  thumbnailClassName?: string;

  /**
   * Title customization.
   *
   * @type|class
   */
  titleClassName?: string;

  /**
   * Subtitle customization.
   *
   * @type|class
   */
  subtitleClassName?: string;

  /** @type|function */
  onItemSelect?: (
    item: PlaylistItem,
    index: number
  ) => void;

  /** @type|function */
  onActiveIndexChange?: (
    index: number,
    item: PlaylistItem
  ) => void;

  /** @type|function */
  onPlayItem?: (
    item: PlaylistItem,
    index: number
  ) => void;

  /** @type|function */
  onPauseItem?: (
    item: PlaylistItem,
    index: number
  ) => void;

  /** @type|function */
  onEndedItem?: (
    item: PlaylistItem,
    index: number
  ) => void;

  /** @type|function */
  onPlaybackError?: (
    error: any,
    item: PlaylistItem,
    index: number
  ) => void;
}

export default function Playlist({
  items = [],

  activeIndex,

  defaultActiveIndex = 0,

  playOnSelect = true,

  autoPlayNext = true,

  loopPlaylist = false,

  showIndex = true,

  showThumbnail = true,

  showDuration = true,

  showNativePlayer = true,

  children,

  className = "",

  playerClassName = "",

  listClassName = "",

  itemClassName = "",

  activeItemClassName = "",

  thumbnailClassName = "",

  titleClassName = "",

  subtitleClassName = "",

  onItemSelect,

  onActiveIndexChange,

  onPlayItem,

  onPauseItem,

  onEndedItem,

  onPlaybackError,

  style,

  ...props
}: PlaylistProps) {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  const controlled =
    activeIndex !== undefined;

  const [
    internalIndex,
    setInternalIndex,
  ] =
    useState(
      defaultActiveIndex
    );

  const [
    playing,
    setPlaying,
  ] =
    useState(false);

  const [
    hoveredIndex,
    setHoveredIndex,
  ] =
    useState<number | null>(
      null
    );

  const audioRef =
    useRef<HTMLAudioElement>(
      null
    );

  const normalizeIndex = (
    index: number
  ) => {
    if (
      safeItems.length === 0
    ) {
      return 0;
    }

    return Math.min(
      Math.max(
        index,
        0
      ),
      safeItems.length - 1
    );
  };

  const currentIndex =
    normalizeIndex(
      controlled
        ? activeIndex
        : internalIndex
    );

  const currentItem =
    safeItems[
      currentIndex
    ];

  useEffect(() => {
    if (
      controlled ||
      safeItems.length === 0
    ) {
      return;
    }

    if (
      internalIndex >=
      safeItems.length
    ) {
      setInternalIndex(
        safeItems.length - 1
      );
    }
  }, [
    controlled,
    internalIndex,
    safeItems.length,
  ]);

  const updateActiveItem = (
    item: PlaylistItem,
    index: number
  ) => {
    if (
      item.disabled
    ) {
      return;
    }

    if (!controlled) {
      setInternalIndex(
        index
      );
    }

    onItemSelect?.(
      item,
      index
    );

    onActiveIndexChange?.(
      index,
      item
    );
  };

  const playItem =
    async (
      item: PlaylistItem,
      index: number
    ) => {
      if (
        !item.src ||
        item.disabled
      ) {
        return;
      }

      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      updateActiveItem(
        item,
        index
      );

      try {
        /*
         * Update the native audio
         * element immediately.
         *
         * This keeps play() inside
         * the user click event.
         */
        if (
          audio.getAttribute(
            "src"
          ) !== item.src
        ) {
          audio.src =
            item.src;

          audio.load();
        }

        await audio.play();

        setPlaying(true);
      } catch (error) {
        setPlaying(false);

        onPlaybackError?.(
          error,
          item,
          index
        );
      }
    };

  const pauseCurrent =
    () => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      audio.pause();

      setPlaying(false);
    };

  const toggleItem = (
    item: PlaylistItem,
    index: number
  ) => {
    const active =
      index ===
      currentIndex;

    if (
      active &&
      playing
    ) {
      pauseCurrent();
      return;
    }

    playItem(
      item,
      index
    );
  };

  const handleItemClick = (
    item: PlaylistItem,
    index: number
  ) => {
    if (
      item.disabled
    ) {
      return;
    }

    const active =
      index ===
      currentIndex;

    if (active) {
      toggleItem(
        item,
        index
      );

      return;
    }

    if (playOnSelect) {
      playItem(
        item,
        index
      );
    } else {
      updateActiveItem(
        item,
        index
      );
    }
  };

  const handleEnded =
    () => {
      if (!currentItem) {
        return;
      }

      setPlaying(false);

      onEndedItem?.(
        currentItem,
        currentIndex
      );

      if (
        !autoPlayNext
      ) {
        return;
      }

      let nextIndex =
        currentIndex + 1;

      if (
        nextIndex >=
        safeItems.length
      ) {
        if (
          !loopPlaylist
        ) {
          return;
        }

        nextIndex = 0;
      }

      const nextItem =
        safeItems[
          nextIndex
        ];

      if (!nextItem) {
        return;
      }

      playItem(
        nextItem,
        nextIndex
      );
    };

  /*
   * Builder-safe empty state.
   */
  if (
    safeItems.length === 0
  ) {
    return (
      <div
        {...props}
        className={
          className
        }
        style={{
          width: "100%",
          minHeight: 160,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          border:
            "1px dashed #d1d5db",

          borderRadius: 14,

          background:
            "#f9fafb",

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        {typeof children ===
        "function" ? (
          children({
            item: null,
            index: 0,
            active: true,
            playing: false,
            select: () => {},
            play: () => {},
            pause: () => {},
            toggle: () => {},
          })
        ) : children ? (
          children
        ) : (
          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              alignItems:
                "center",

              gap: 8,

              color:
                "#9ca3af",

              fontSize: 14,
            }}
          >
            <ListMusic
              size={28}
            />

            Playlist
            (No Data Bound)
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...props}
      className={
        className
      }
      style={{
        width: "100%",

        overflow:
          "hidden",

        border:
          "1px solid #e5e7eb",

        borderRadius:
          16,

        background:
          "#ffffff",

        boxSizing:
          "border-box",

        boxShadow:
          "0 4px 16px rgba(0,0,0,0.05)",

        ...style,
      }}
    >
      {/*
       * Native player
       */}
      <audio
        ref={
          audioRef
        }
        src={
          currentItem?.src ||
          undefined
        }
        controls={
          showNativePlayer
        }
        preload="metadata"
        className={
          playerClassName
        }
        onPlay={() => {
          setPlaying(
            true
          );

          if (
            currentItem
          ) {
            onPlayItem?.(
              currentItem,
              currentIndex
            );
          }
        }}
        onPause={() => {
          setPlaying(
            false
          );

          if (
            currentItem
          ) {
            onPauseItem?.(
              currentItem,
              currentIndex
            );
          }
        }}
        onEnded={
          handleEnded
        }
        onError={(
          event
        ) => {
          if (
            currentItem
          ) {
            onPlaybackError?.(
              event,
              currentItem,
              currentIndex
            );
          }
        }}
        style={{
          display:
            showNativePlayer
              ? "block"
              : "none",

          width:
            "100%",

          boxSizing:
            "border-box",
        }}
      />

      <div
        className={
          listClassName
        }
        style={{
          width:
            "100%",

          maxHeight:
            384,

          display:
            "flex",

          flexDirection:
            "column",

          overflowY:
            "auto",

          boxSizing:
            "border-box",
        }}
      >
        {safeItems.map(
          (
            item,
            index
          ) => {
            const active =
              index ===
              currentIndex;

            const itemPlaying =
              active &&
              playing;

            const hovering =
              hoveredIndex ===
              index;

            const select =
              () =>
                updateActiveItem(
                  item,
                  index
                );

            const play =
              () =>
                playItem(
                  item,
                  index
                );

            const pause =
              () => {
                if (active) {
                  pauseCurrent();
                }
              };

            const toggle =
              () =>
                toggleItem(
                  item,
                  index
                );

            if (
              typeof children ===
              "function"
            ) {
              return (
                <React.Fragment
                  key={
                    item?.id ??
                    index
                  }
                >
                  {children({
                    item,
                    index,
                    active,
                    playing:
                      itemPlaying,
                    select,
                    play,
                    pause,
                    toggle,
                  })}
                </React.Fragment>
              );
            }

            if (children) {
              return (
                <React.Fragment
                  key={
                    item?.id ??
                    index
                  }
                >
                  {children}
                </React.Fragment>
              );
            }

            return (
              <button
                key={
                  item?.id ??
                  index
                }
                type="button"
                disabled={
                  item.disabled
                }
                aria-current={
                  active
                    ? "true"
                    : undefined
                }
                className={[
                  itemClassName,

                  active
                    ? activeItemClassName
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  handleItemClick(
                    item,
                    index
                  );
                }}
                onMouseEnter={() => {
                  setHoveredIndex(
                    index
                  );
                }}
                onMouseLeave={() => {
                  setHoveredIndex(
                    null
                  );
                }}
                style={{
                  width:
                    "100%",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: 12,

                  flexShrink: 0,

                  padding:
                    "10px 14px",

                  margin: 0,

                  border: 0,

                  borderBottom:
                    index <
                    safeItems.length -
                      1
                      ? "1px solid #f0f0f0"
                      : "none",

                  background:
                    item.disabled
                      ? "#fafafa"
                      : active
                        ? "#eff6ff"
                        : hovering
                          ? "#f9fafb"
                          : "#ffffff",

                  textAlign:
                    "left",

                  cursor:
                    item.disabled
                      ? "not-allowed"
                      : "pointer",

                  opacity:
                    item.disabled
                      ? 0.45
                      : 1,

                  transition:
                    "background 160ms ease",

                  boxSizing:
                    "border-box",
                }}
              >
                {showIndex && (
                  <div
                    style={{
                      width:
                        32,

                      height:
                        32,

                      flexShrink:
                        0,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      borderRadius:
                        "50%",

                      background:
                        active
                          ? "#2563eb"
                          : "#f3f4f6",

                      color:
                        active
                          ? "#ffffff"
                          : "#6b7280",

                      fontSize:
                        12,

                      fontWeight:
                        600,
                    }}
                  >
                    {itemPlaying ? (
                      <Pause
                        size={14}
                        fill="currentColor"
                      />
                    ) : active ? (
                      <Play
                        size={14}
                        fill="currentColor"
                      />
                    ) : (
                      index + 1
                    )}
                  </div>
                )}

                {showThumbnail &&
                  item.thumbnail && (
                    <img
                      src={
                        item.thumbnail
                      }
                      alt=""
                      loading="lazy"
                      className={
                        thumbnailClassName
                      }
                      style={{
                        width:
                          56,

                        height:
                          56,

                        flexShrink:
                          0,

                        display:
                          "block",

                        borderRadius:
                          10,

                        objectFit:
                          "cover",

                        background:
                          "#f3f4f6",
                      }}
                    />
                  )}

                <div
                  style={{
                    minWidth:
                      0,

                    flex:
                      "1 1 auto",
                  }}
                >
                  <div
                    className={
                      titleClassName
                    }
                    style={{
                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",

                      color:
                        active
                          ? "#1d4ed8"
                          : "#111827",

                      fontSize:
                        14,

                      fontWeight:
                        600,

                      lineHeight:
                        1.4,
                    }}
                  >
                    {item.title ||
                      `Track ${
                        index + 1
                      }`}
                  </div>

                  {item.subtitle && (
                    <div
                      className={
                        subtitleClassName
                      }
                      style={{
                        marginTop:
                          3,

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",

                        whiteSpace:
                          "nowrap",

                        color:
                          "#6b7280",

                        fontSize:
                          12,

                        lineHeight:
                          1.4,
                      }}
                    >
                      {
                        item.subtitle
                      }
                    </div>
                  )}
                </div>

                {showDuration &&
                  item.duration && (
                    <div
                      style={{
                        flexShrink:
                          0,

                        color:
                          "#9ca3af",

                        fontSize:
                          12,

                        fontVariantNumeric:
                          "tabular-nums",
                      }}
                    >
                      {
                        item.duration
                      }
                    </div>
                  )}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}