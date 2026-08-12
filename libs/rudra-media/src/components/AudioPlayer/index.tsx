import React, {
  useEffect,
  useRef,
} from "react";

export interface AudioPlayerProps
  extends Omit<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    "className" | "src"
  > {
  src?: string;

  controls?: boolean;

  autoPlay?: boolean;

  muted?: boolean;

  loop?: boolean;

  preload?:
    | "none"
    | "metadata"
    | "auto";

  /**
   * Initial playback position
   * in seconds.
   */
  startTime?: number;

  /**
   * Audio player customization.
   *
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"full","label":"Full Width"},
   *       {"key":"64","label":"Small"},
   *       {"key":"80","label":"Medium"},
   *       {"key":"96","label":"Large"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Fires when audio metadata
   * is available.
   *
   * @type|function
   */
  onReady?: (
    audio: HTMLAudioElement
  ) => void;

  /**
   * Returns current playback
   * position in seconds.
   *
   * @type|function
   */
  onTimeUpdateValue?: (
    currentTime: number
  ) => void;

  /**
   * Returns audio duration
   * in seconds.
   *
   * @type|function
   */
  onDurationChangeValue?: (
    duration: number
  ) => void;

  /**
   * @type|function
   */
  onVolumeChangeValue?: (
    volume: number,
    muted: boolean
  ) => void;
}

export default function AudioPlayer({
  src = "",

  controls = true,

  autoPlay = false,

  muted = false,

  loop = false,

  preload = "metadata",

  startTime = 0,

  className = "",

  onReady,

  onTimeUpdateValue,

  onDurationChangeValue,

  onVolumeChangeValue,

  onLoadedMetadata,

  onTimeUpdate,

  onDurationChange,

  onVolumeChange,

  ...props
}: AudioPlayerProps) {
  const audioRef =
    useRef<HTMLAudioElement>(
      null
    );

  const initializedRef =
    useRef(false);

  /*
   * A new source should initialize
   * its start position again.
   */
  useEffect(() => {
    initializedRef.current =
      false;
  }, [src]);

  const handleLoadedMetadata = (
    event:
      React.SyntheticEvent<
        HTMLAudioElement
      >
  ) => {
    const audio =
      event.currentTarget;

    if (
      !initializedRef.current
    ) {
      initializedRef.current =
        true;

      if (
        startTime > 0 &&
        Number.isFinite(
          audio.duration
        )
      ) {
        audio.currentTime =
          Math.min(
            startTime,
            audio.duration
          );
      }

      onReady?.(
        audio
      );
    }

    onLoadedMetadata?.(
      event
    );
  };

  const handleTimeUpdate = (
    event:
      React.SyntheticEvent<
        HTMLAudioElement
      >
  ) => {
    const audio =
      event.currentTarget;

    onTimeUpdateValue?.(
      audio.currentTime
    );

    onTimeUpdate?.(
      event
    );
  };

  const handleDurationChange = (
    event:
      React.SyntheticEvent<
        HTMLAudioElement
      >
  ) => {
    const audio =
      event.currentTarget;

    onDurationChangeValue?.(
      audio.duration
    );

    onDurationChange?.(
      event
    );
  };

  const handleVolumeChange = (
    event:
      React.SyntheticEvent<
        HTMLAudioElement
      >
  ) => {
    const audio =
      event.currentTarget;

    onVolumeChangeValue?.(
      audio.volume,
      audio.muted
    );

    onVolumeChange?.(
      event
    );
  };

  if (!src) {
    return (
      <div
        className={[
          "flex min-h-14 w-full",
          "items-center justify-center",
          "rounded-lg",
          "border border-dashed border-gray-300",
          "bg-gray-50",
          "px-4",
          "text-sm text-gray-400",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        Audio Player
      </div>
    );
  }

  return (
    <audio
      {...props}
      ref={audioRef}
      src={src}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      preload={preload}
      onLoadedMetadata={
        handleLoadedMetadata
      }
      onTimeUpdate={
        handleTimeUpdate
      }
      onDurationChange={
        handleDurationChange
      }
      onVolumeChange={
        handleVolumeChange
      }
      className={[
        "block w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}