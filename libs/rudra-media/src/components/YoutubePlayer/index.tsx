import React, {
  useMemo,
} from "react";

export interface YouTubePlayerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * YouTube URL or video ID.
   *
   * Supported examples:
   *
   * https://www.youtube.com/watch?v=VIDEO_ID
   * https://youtu.be/VIDEO_ID
   * https://www.youtube.com/shorts/VIDEO_ID
   * https://www.youtube.com/embed/VIDEO_ID
   * VIDEO_ID
   */
  src?: string;

  /** @translate */
  title?: string;

  controls?: boolean;

  autoPlay?: boolean;

  muted?: boolean;

  loop?: boolean;

  playsInline?: boolean;

  allowFullScreen?: boolean;

  startTime?: number;

  endTime?: number;

  showCaptions?: boolean;

  /**
   * Preferred caption language.
   * Example: en, ta, hi
   */
  captionLanguage?: string;

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
   *       {"key":"96","label":"Small"}
   *     ]
   *   },
   *   {
   *     "key":"Aspect Ratio",
   *     "prefix":"aspect",
   *     "type":"select",
   *     "options":[
   *       {"key":"video","label":"16:9"},
   *       {"key":"square","label":"Square"}
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
   *       {"key":"2xl","label":"2XL"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Iframe customization.
   *
   * @type|class
   */
  iframeClassName?: string;

  /** @type|function */
  onLoad?: () => void;

  /** @type|function */
  onError?: (
    error: Error
  ) => void;
}

function extractYouTubeVideoId(
  value?: string
): string | null {
  if (!value) {
    return null;
  }

  const input =
    value.trim();

  if (!input) {
    return null;
  }

  /*
   * Allow direct video IDs.
   */
  if (
    /^[a-zA-Z0-9_-]{11}$/.test(
      input
    )
  ) {
    return input;
  }

  try {
    const url =
      new URL(input);

    const hostname =
      url.hostname
        .replace(
          /^www\./,
          ""
        )
        .toLowerCase();

    /*
     * youtu.be/VIDEO_ID
     */
    if (
      hostname ===
      "youtu.be"
    ) {
      const id =
        url.pathname
          .split("/")
          .filter(Boolean)[0];

      return id || null;
    }

    if (
      hostname ===
        "youtube.com" ||
      hostname ===
        "m.youtube.com" ||
      hostname ===
        "music.youtube.com"
    ) {
      /*
       * youtube.com/watch?v=VIDEO_ID
       */
      const watchId =
        url.searchParams.get(
          "v"
        );

      if (watchId) {
        return watchId;
      }

      const segments =
        url.pathname
          .split("/")
          .filter(Boolean);

      /*
       * youtube.com/embed/VIDEO_ID
       * youtube.com/shorts/VIDEO_ID
       * youtube.com/live/VIDEO_ID
       */
      if (
        [
          "embed",
          "shorts",
          "live",
        ].includes(
          segments[0]
        )
      ) {
        return (
          segments[1] ||
          null
        );
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function YouTubePlayer({
  src = "",

  title =
    "YouTube video",

  controls = true,

  autoPlay = false,

  muted = false,

  loop = false,

  playsInline = true,

  allowFullScreen = true,

  startTime = 0,

  endTime,

  showCaptions = false,

  captionLanguage,

  className = "",

  iframeClassName = "",

  onLoad,

  onError,

  ...props
}: YouTubePlayerProps) {
  const videoId =
    useMemo(
      () =>
        extractYouTubeVideoId(
          src
        ),
      [src]
    );

  const embedUrl =
    useMemo(() => {
      if (!videoId) {
        return null;
      }

      const url =
        new URL(
          `https://www.youtube.com/embed/${videoId}`
        );

      url.searchParams.set(
        "controls",
        controls
          ? "1"
          : "0"
      );

      url.searchParams.set(
        "autoplay",
        autoPlay
          ? "1"
          : "0"
      );

      url.searchParams.set(
        "mute",
        muted
          ? "1"
          : "0"
      );

      url.searchParams.set(
        "playsinline",
        playsInline
          ? "1"
          : "0"
      );

      if (
        startTime > 0
      ) {
        url.searchParams.set(
          "start",
          String(
            Math.floor(
              startTime
            )
          )
        );
      }

      if (
        typeof endTime ===
          "number" &&
        endTime > 0
      ) {
        url.searchParams.set(
          "end",
          String(
            Math.floor(
              endTime
            )
          )
        );
      }

      if (loop) {
        url.searchParams.set(
          "loop",
          "1"
        );

        /*
         * Required by YouTube
         * for looping one video.
         */
        url.searchParams.set(
          "playlist",
          videoId
        );
      }

      if (
        showCaptions
      ) {
        url.searchParams.set(
          "cc_load_policy",
          "1"
        );
      }

      if (
        captionLanguage
      ) {
        url.searchParams.set(
          "cc_lang_pref",
          captionLanguage
        );
      }

      return url.toString();
    }, [
      videoId,
      controls,
      autoPlay,
      muted,
      loop,
      playsInline,
      startTime,
      endTime,
      showCaptions,
      captionLanguage,
    ]);

  if (
    !src
  ) {
    return (
      <div
        {...props}
        className={[
          "flex aspect-video w-full",
          "items-center justify-center",
          "rounded-lg",
          "border border-dashed border-gray-300",
          "bg-gray-50",
          "text-sm text-gray-400",

          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        YouTube Player
      </div>
    );
  }

  if (
    !videoId ||
    !embedUrl
  ) {
    const error =
      new Error(
        "Invalid YouTube URL or video ID."
      );

    return (
      <div
        {...props}
        className={[
          "flex aspect-video w-full",
          "items-center justify-center",
          "rounded-lg",
          "border border-red-200",
          "bg-red-50",
          "p-4",
          "text-center",
          "text-sm text-red-500",

          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => {
          onError?.(
            error
          );
        }}
      >
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div
      {...props}
      className={[
        "relative",
        "aspect-video",
        "w-full",
        "overflow-hidden",
        "bg-black",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allow={[
          "accelerometer",
          "autoplay",
          "clipboard-write",
          "encrypted-media",
          "gyroscope",
          "picture-in-picture",
          "web-share",
        ].join("; ")}
        allowFullScreen={
          allowFullScreen
        }
        onLoad={
          onLoad
        }
        className={[
          "absolute inset-0",
          "h-full w-full",
          "border-0",

          iframeClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
}