import React from "react";

export type MediaCardType =
  | "image"
  | "video"
  | "audio";

export interface MediaCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children" | "title"
  > {
  /** @select|image|video|audio */
  type?: MediaCardType;

  src?: string;

  poster?: string;

  alt?: string;

  /** @translate */
  title?: string;

  /** @translate @textarea */
  description?: string;

  /**
   * Optional content displayed
   * below title/description.
   */
  children?: React.ReactNode;

  /**
   * Completely replace the default
   * image/video/audio preview.
   */
  media?: React.ReactNode;

  /**
   * Optional content rendered over
   * the media preview.
   */
  overlay?: React.ReactNode;

  showMediaControls?: boolean;

  autoPlay?: boolean;

  muted?: boolean;

  loop?: boolean;

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
   *       {"key":"64","label":"Small"},
   *       {"key":"72","label":"Medium"},
   *       {"key":"80","label":"Large"},
   *       {"key":"96","label":"Extra Large"},
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
   *   },
   *   {
   *     "key":"Shadow",
   *     "prefix":"shadow",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Media container customization.
   *
   * @type|class
   * @schema [
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
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"black","label":"Black"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"transparent","label":"Transparent"}
   *     ]
   *   }
   * ]
   */
  mediaClassName?: string;

  /**
   * Default media element customization.
   *
   * @type|class
   * @schema [
   *   {
   *     "key":"Object Fit",
   *     "prefix":"object",
   *     "type":"select",
   *     "options":[
   *       {"key":"cover","label":"Cover"},
   *       {"key":"contain","label":"Contain"},
   *       {"key":"fill","label":"Fill"},
   *       {"key":"scale-down","label":"Scale Down"}
   *     ]
   *   }
   * ]
   */
  mediaElementClassName?: string;

  /**
   * Content customization.
   *
   * @type|class
   * @schema [
   *   {
   *     "key":"Padding",
   *     "prefix":"p",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"},
   *       {"key":"6","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  contentClassName?: string;

  /**
   * @type|class
   */
  titleClassName?: string;

  /**
   * @type|class
   */
  descriptionClassName?: string;

  /**
   * @type|class
   */
  overlayClassName?: string;

  /** @type|function */
  onMediaLoad?: () => void;

  /** @type|function */
  onMediaError?: (
    error: any
  ) => void;
}

export default function MediaCard({
  type = "image",

  src = "",

  poster,

  alt = "",

  title,

  description,

  children,

  media,

  overlay,

  showMediaControls = true,

  autoPlay = false,

  muted = false,

  loop = false,

  className = "",

  mediaClassName = "",

  mediaElementClassName = "",

  contentClassName = "",

  titleClassName = "",

  descriptionClassName = "",

  overlayClassName = "",

  onMediaLoad,

  onMediaError,

  ...props
}: MediaCardProps) {
  const renderDefaultMedia =
    () => {
      if (!src) {
        return (
          <div
            className={[
              "flex h-full w-full",
              "items-center justify-center",
              "text-sm text-gray-400",
            ].join(" ")}
          >
            Media
          </div>
        );
      }

      if (
        type === "video"
      ) {
        return (
          <video
            src={src}
            poster={poster}
            controls={
              showMediaControls
            }
            autoPlay={
              autoPlay
            }
            muted={
              muted
            }
            loop={
              loop
            }
            playsInline
            onLoadedData={() => {
              onMediaLoad?.();
            }}
            onError={(
              event
            ) => {
              onMediaError?.(
                event
              );
            }}
            className={[
              "h-full w-full",
              "object-cover",
              mediaElementClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          />
        );
      }

      if (
        type === "audio"
      ) {
        return (
          <div
            className={[
              "flex h-full w-full",
              "items-center justify-center",
              "p-4",
            ].join(" ")}
          >
            <audio
              src={src}
              controls={
                showMediaControls
              }
              autoPlay={
                autoPlay
              }
              muted={
                muted
              }
              loop={
                loop
              }
              onLoadedData={() => {
                onMediaLoad?.();
              }}
              onError={(
                event
              ) => {
                onMediaError?.(
                  event
                );
              }}
              className={[
                "w-full",
                mediaElementClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </div>
        );
      }

      return (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => {
            onMediaLoad?.();
          }}
          onError={(
            event
          ) => {
            onMediaError?.(
              event
            );
          }}
          className={[
            "h-full w-full",
            "object-cover",
            mediaElementClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      );
    };

  const hasContent =
    Boolean(
      title ||
        description ||
        children
    );

  return (
    <div
      {...props}
      className={[
        "w-full overflow-hidden",
        "rounded-xl",
        "border border-gray-200",
        "bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "relative",
          "aspect-video",
          "w-full",
          "overflow-hidden",
          "bg-gray-100",
          mediaClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {media ??
          renderDefaultMedia()}

        {overlay && (
          <div
            className={[
              "absolute inset-0",
              overlayClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {overlay}
          </div>
        )}
      </div>

      {hasContent && (
        <div
          className={[
            "p-4",
            contentClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title && (
            <div
              className={[
                "text-base",
                "font-semibold",
                "text-gray-900",
                titleClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {title}
            </div>
          )}

          {description && (
            <div
              className={[
                title
                  ? "mt-1"
                  : "",
                "text-sm",
                "text-gray-500",
                descriptionClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {description}
            </div>
          )}

          {children && (
            <div
              className={
                title ||
                description
                  ? "mt-3"
                  : ""
              }
            >
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
}