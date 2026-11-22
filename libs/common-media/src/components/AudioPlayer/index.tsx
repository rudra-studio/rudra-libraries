import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type AudioPlayerThemeMode = "light" | "dark";

export interface AudioPlayerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: AudioPlayerThemeMode;

  /**
   * Audio source URL.
   */
  src?: string;

  /**
   * Track or audio title.
   *
   * @translate
   */
  title?: string;

  /**
   * Secondary track metadata or artist/note.
   *
   * @translate
   */
  subtitle?: string;

  /**
   * Loop audio playback.
   *
   * @schema {"type":"boolean"}
   */
  loop?: boolean;

  /**
   * Auto-play when ready.
   *
   * @schema {"type":"boolean"}
   */
  autoPlay?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function AudioPlayer({
  themeMode = "light",
  src = "",
  title = "Ambient Track",
  subtitle = "Audio stream preview",
  loop = false,
  autoPlay = false,
  className = "",
  ...props
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !src) {
      setPlaying((p) => !p);
      return;
    }
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.bar, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {src && (
        <audio
          ref={audioRef}
          src={src}
          loop={loop}
          autoPlay={autoPlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      )}

      <div className={styles.left}>
        <span
          aria-hidden="true"
          className={`${styles.eq} ${playing && !muted ? styles.eqActive : ""}`}
        >
          <span />
          <span />
          <span />
        </span>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>
            {src ? subtitle : `${subtitle} • No audio URL set`}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          aria-pressed={playing}
          onClick={togglePlay}
          className={styles.playBtn}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          aria-label={muted ? "Unmute audio" : "Mute audio"}
          aria-pressed={muted}
          onClick={() => setMuted((m) => !m)}
          className={styles.iconBtn}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
}
