import React from "react";
import styles from "./styles.module.scss";

export type MediaGalleryThemeMode = "light" | "dark";

export interface MediaGalleryItem {
  id: string;
  src?: string;
  alt?: string;
  caption?: string;
  type?: "image" | "video";
}

export interface MediaGalleryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: MediaGalleryThemeMode;

  /**
   * Media items to display in the gallery grid.
   */
  items?: MediaGalleryItem[];

  /**
   * Number of columns on desktop (1 to 6).
   */
  columns?: number;

  /**
   * Gap between gallery tiles in pixels.
   */
  gap?: number;

  /**
   * Show item captions below each tile.
   *
   * @schema {"type":"boolean"}
   */
  showCaptions?: boolean;

  /**
   * Callback invoked when a gallery tile is clicked.
   */
  onSelectItem?: (ctx: { item: MediaGalleryItem; index: number }) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_GALLERY_ITEMS: MediaGalleryItem[] = [
  { id: "m1", alt: "Studio Shot 1", caption: "Morning light study", type: "image" },
  { id: "m2", alt: "Studio Shot 2", caption: "Workspace detail", type: "image" },
  { id: "m3", alt: "Studio Shot 3", caption: "Reel preview", type: "video" },
];

export default function MediaGallery({
  themeMode = "light",
  items = DEFAULT_GALLERY_ITEMS,
  columns = 3,
  gap = 12,
  showCaptions = true,
  onSelectItem,
  className = "",
  ...props
}: MediaGalleryProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const safeCols = Math.max(1, Math.min(6, Math.floor(columns) || 3));
  const list =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_GALLERY_ITEMS;

  return (
    <div
      {...props}
      data-theme={themeMode}
      style={{
        ...props.style,
        gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))`,
        gap: `${Math.max(0, gap)}px`,
      }}
      className={[styles.grid, modeClass, "grid w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {list.map((item, idx) => {
        const label = item.alt || item.caption || `Media ${idx + 1}`;
        return (
          <button
            key={item.id || idx}
            type="button"
            onClick={() => onSelectItem?.({ item, index: idx })}
            className={styles.tile}
          >
            <div className={styles.thumbBox}>
              {item.src ? (
                <img src={item.src} alt={label} className={styles.thumbImg} />
              ) : (
                <div className={styles.thumbPlaceholder}>
                  <span className={styles.kindTag}>
                    {(item.type || "image").toUpperCase()}
                  </span>
                  <span>{label}</span>
                </div>
              )}
            </div>
            {showCaptions && item.caption && (
              <span className={styles.caption}>{item.caption}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
