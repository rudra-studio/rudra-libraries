import React from "react";
import styles from "./styles.module.scss";

export type VideoPlayerThemeMode = "light" | "dark";
export type VideoPlayerAspect = "16/9" | "4/3" | "1/1";

export interface VideoPlayerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: VideoPlayerThemeMode;

  /**
   * Video source URL.
   */
  src?: string;

  /**
   * Optional poster image URL.
   */
  poster?: string;

  /**
   * Optional title shown in the player bar.
   *
   * @translate
   */
  title?: string;

  /**
   * Aspect ratio preset.
   *
   * @select|16/9|4/3|1/1
   */
  aspectRatio?: VideoPlayerAspect;

  /**
   * Show native video playback controls.
   *
   * @schema {"type":"boolean"}
   */
  controls?: boolean;

  /**
   * Auto-play video when loaded.
   *
   * @schema {"type":"boolean"}
   */
  autoPlay?: boolean;

  /**
   * Loop playback continuously.
   *
   * @schema {"type":"boolean"}
   */
  loop?: boolean;

  /**
   * Start video muted.
   *
   * @schema {"type":"boolean"}
   */
  muted?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const RATIO_MAP: Record<VideoPlayerAspect, string> = {
  "16/9": "16 / 9",
  "4/3": "4 / 3",
  "1/1": "1 / 1",
};

export default function VideoPlayer({
  themeMode = "light",
  src = "",
  poster = "",
  title = "Video Preview",
  aspectRatio = "16/9",
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  className = "",
  ...props
}: VideoPlayerProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title && (
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {loop && <span className={styles.badge}>LOOP</span>}
        </div>
      )}

      <div
        className={styles.frame}
        style={{ aspectRatio: RATIO_MAP[aspectRatio] || "16 / 9" }}
      >
        {src ? (
          <video
            src={src}
            poster={poster || undefined}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            className={styles.video}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.playIcon} aria-hidden="true">
              ▶
            </span>
            <span>{title || "Video Player"}</span>
            <small>Provide a video URL to play</small>
          </div>
        )}
      </div>
    </div>
  );
}
