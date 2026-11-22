import React from "react";
import styles from "./styles.module.scss";

export type MediaFrameThemeMode = "light" | "dark";
export type MediaFrameKind = "image" | "video";
export type MediaFrameAspect = "16/9" | "4/3" | "1/1" | "auto";
export type MediaFrameFit = "cover" | "contain";

export interface MediaFrameProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: MediaFrameThemeMode;

  /**
   * Media source URL.
   */
  src?: string;

  /**
   * Accessible alternative text for the media.
   *
   * @translate
   */
  alt?: string;

  /**
   * Optional caption below the media frame.
   *
   * @translate
   */
  caption?: string;

  /**
   * Display the caption text.
   *
   * @schema {"type":"boolean"}
   */
  showCaption?: boolean;

  /**
   * Media element kind.
   *
   * @select|image|video
   */
  kind?: MediaFrameKind;

  /**
   * Aspect ratio preset.
   *
   * @select|16/9|4/3|1/1|auto
   */
  aspectRatio?: MediaFrameAspect;

  /**
   * Object-fit mode for media content.
   *
   * @select|cover|contain
   */
  objectFit?: MediaFrameFit;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const ASPECT_MAP: Record<MediaFrameAspect, string> = {
  "16/9": "16 / 9",
  "4/3": "4 / 3",
  "1/1": "1 / 1",
  auto: "auto",
};

export default function MediaFrame({
  themeMode = "light",
  src = "",
  alt = "Media preview",
  caption = "Featured media preview",
  showCaption = true,
  kind = "image",
  aspectRatio = "16/9",
  objectFit = "cover",
  className = "",
  ...props
}: MediaFrameProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const ratioValue = ASPECT_MAP[aspectRatio] || "16 / 9";

  return (
    <figure
      {...props}
      data-theme={themeMode}
      className={[styles.figure, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={styles.stage}
        style={ratioValue !== "auto" ? { aspectRatio: ratioValue } : undefined}
      >
        {src ? (
          kind === "video" ? (
            <video
              src={src}
              controls
              className={styles.media}
              style={{ objectFit }}
            />
          ) : (
            <img
              src={src}
              alt={alt}
              className={styles.media}
              style={{ objectFit }}
            />
          )
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.badge}>{kind.toUpperCase()}</span>
            <span>{alt || "Media Frame"}</span>
            <small>{aspectRatio}</small>
          </div>
        )}
      </div>

      {showCaption && caption && (
        <figcaption className={styles.caption}>{caption}</figcaption>
      )}
    </figure>
  );
}
