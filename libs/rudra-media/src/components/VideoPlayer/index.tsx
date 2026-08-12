import React, {
  useEffect,
  useRef,
} from "react";

export interface VideoPlayerProps
  extends Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    "className" | "src" | "poster"
  > {
  src?: string;

  poster?: string;

  controls?: boolean;

  autoPlay?: boolean;

  muted?: boolean;

  loop?: boolean;

  playsInline?: boolean;

  preload?:
    | "none"
    | "metadata"
    | "auto";

  startTime?: number;

  /**
   * Root video customization.
   *
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full Width"}
   *     ]
   *   },
   *   {
   *     "key":"Height",
   *     "prefix":"h",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full Height"},
   *       {"key":"48","label":"Small"},
   *       {"key":"64","label":"Medium"},
   *       {"key":"80","label":"Large"},
   *       {"key":"96","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Object Fit",
   *     "prefix":"object",
   *     "type":"select",
   *     "options":[
   *       {"key":"contain","label":"Contain"},
   *       {"key":"cover","label":"Cover"},
   *       {"key":"fill","label":"Fill"},
   *       {"key":"none","label":"None"},
   *       {"key":"scale-down","label":"Scale Down"}
   *     ]
   *   },
   *   {
   *     "key":"Aspect Ratio",
   *     "prefix":"aspect",
   *     "type":"select",
   *     "options":[
   *       {"key":"video","label":"16:9"},
   *       {"key":"square","label":"Square"},
   *       {"key":"auto","label":"Auto"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"2xl","label":"2XL"},
   *       {"key":"full","label":"Full"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"black","label":"Black"},
   *       {"key":"gray-900","label":"Dark"},
   *       {"key":"transparent","label":"Transparent"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /** @type|function */
  onReady?: (
    video: HTMLVideoElement
  ) => void;

  /** @type|function */
  onTimeUpdateValue?: (
    currentTime: number
  ) => void;

  /** @type|function */
  onDurationChangeValue?: (
    duration: number
  ) => void;
}

export default function VideoPlayer({
  src = "",
  poster,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  preload = "metadata",
  startTime = 0,
  className = "",

  onReady,
  onTimeUpdateValue,
  onDurationChangeValue,

  onLoadedMetadata,
  onTimeUpdate,
  onDurationChange,

  ...props
}: VideoPlayerProps) {
  const videoRef =
    useRef<HTMLVideoElement>(
      null
    );

  const initializedRef =
    useRef(false);

  /*
   * Reset initialization whenever
   * the video source changes.
   */
  useEffect(() => {
    initializedRef.current =
      false;
  }, [src]);

  const handleLoadedMetadata = (
    event:
      React.SyntheticEvent<
        HTMLVideoElement
      >
  ) => {
    const video =
      event.currentTarget;

    if (
      !initializedRef.current
    ) {
      initializedRef.current =
        true;

      if (
        startTime > 0 &&
        Number.isFinite(
          video.duration
        )
      ) {
        video.currentTime =
          Math.min(
            startTime,
            video.duration
          );
      }

      onReady?.(
        video
      );
    }

    onLoadedMetadata?.(
      event
    );
  };

  const handleTimeUpdate = (
    event:
      React.SyntheticEvent<
        HTMLVideoElement
      >
  ) => {
    const video =
      event.currentTarget;

    onTimeUpdateValue?.(
      video.currentTime
    );

    onTimeUpdate?.(
      event
    );
  };

  const handleDurationChange = (
    event:
      React.SyntheticEvent<
        HTMLVideoElement
      >
  ) => {
    const video =
      event.currentTarget;

    onDurationChangeValue?.(
      video.duration
    );

    onDurationChange?.(
      event
    );
  };

  return (
    <video
      {...props}
      ref={videoRef}
      src={src || undefined}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={
        playsInline
      }
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
      className={[
        "block w-full",
        "bg-black",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}