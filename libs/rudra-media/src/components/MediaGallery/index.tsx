import React, {
  useState,
} from "react";

export type ImageGalleryLayout =
  | "grid"
  | "circles"
  | "collage";

export type ImageGalleryHoverEffect =
  | "none"
  | "zoom"
  | "lift"
  | "tilt";


export interface ImageGalleryProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Gallery images.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "properties":{
   *       "id":{"type":"string"},
   *       "src":{"type":"string"},
   *       "url":{"type":"string"},
   *       "image":{"type":"string"},
   *       "imageUrl":{"type":"string"},
   *       "title":{"type":"string"},
   *       "name":{"type":"string"},
   *       "alt":{"type":"string"},
   *       "size":{"type":"number"},
   *       "x":{"type":"number"},
   *       "y":{"type":"number"},
   *       "zIndex":{"type":"number"}
   *     }
   *   }
   * }
   */
  items?: any[];

  /** @select|grid|circles|collage */
  layout?: ImageGalleryLayout;

  /** @select|none|zoom|lift|tilt */
  hoverEffect?: ImageGalleryHoverEffect;

  /**
   * Custom gallery item.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: {
          item: any;
          index: number;
        }
      ) => React.ReactNode);

  showTitle?: boolean;

  circleCanvasHeight?: number;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   * @schema [
   *   {
   *     "key":"Columns",
   *     "prefix":"grid-cols",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"1 Column"},
   *       {"key":"2","label":"2 Columns"},
   *       {"key":"3","label":"3 Columns"},
   *       {"key":"4","label":"4 Columns"},
   *       {"key":"5","label":"5 Columns"},
   *       {"key":"6","label":"6 Columns"}
   *     ]
   *   },
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"1"},
   *       {"key":"2","label":"2"},
   *       {"key":"3","label":"3"},
   *       {"key":"4","label":"4"},
   *       {"key":"6","label":"6"},
   *       {"key":"8","label":"8"}
   *     ]
   *   }
   * ]
   */
  gridClassName?: string;

  /**
   * @type|class
   */
  circlesClassName?: string;

  /**
   * @type|class
   */
  itemClassName?: string;

  /**
   * @type|class
   */
  imageClassName?: string;

  /**
   * @type|class
   */
  titleClassName?: string;

  /** @type|function */
  onItemClick?: (
    item: any,
    index: number
  ) => void;

  /** @type|function */
  onItemHover?: (
    item: any,
    index: number
  ) => void;

  /** @type|function */
  onItemHoverEnd?: (
    item: any,
    index: number
  ) => void;
}

function getImageSource(
  item: any
): string {
  return (
    item?.src ??
    item?.url ??
    item?.image ??
    item?.imageUrl ??
    ""
  );
}

function getImageAlt(
  item: any
): string {
  return (
    item?.alt ??
    item?.title ??
    item?.name ??
    ""
  );
}

function getImageTitle(
  item: any
): string {
  return (
    item?.title ??
    item?.name ??
    ""
  );
}

interface GalleryImageProps {
  item: any;
  index: number;
  circle?: boolean;
  showTitle?: boolean;
  hoverEffect: ImageGalleryHoverEffect;
  imageClassName?: string;
  itemClassName?: string;
  titleClassName?: string;
  children?:
    | React.ReactNode
    | ((
        context: {
          item: any;
          index: number;
        }
      ) => React.ReactNode);

  onItemClick?: (
    item: any,
    index: number
  ) => void;

  onItemHover?: (
    item: any,
    index: number
  ) => void;

  onItemHoverEnd?: (
    item: any,
    index: number
  ) => void;
}

function GalleryImage({
  item,
  index,
  circle = false,
  showTitle = false,
  hoverEffect,
  imageClassName = "",
  itemClassName = "",
  titleClassName = "",
  children,
  onItemClick,
  onItemHover,
  onItemHoverEnd,
}: GalleryImageProps) {
  const [
    hovering,
    setHovering,
  ] = useState(false);

  const src =
    getImageSource(item);

  const title =
    getImageTitle(item);

  let hoverTransform =
    "scale(1)";

  if (hovering) {
    if (
      hoverEffect ===
      "zoom"
    ) {
      hoverTransform =
        "scale(1.1)";
    }

    if (
      hoverEffect ===
      "lift"
    ) {
      hoverTransform =
        "translateY(-10px) scale(1.08)";
    }

    if (
      hoverEffect ===
      "tilt"
    ) {
      hoverTransform =
        "rotate(5deg) scale(1.08)";
    }
  }

  return (
    <button
      type="button"
      className={
        itemClassName
      }
      onClick={() => {
        onItemClick?.(
          item,
          index
        );
      }}
      onMouseEnter={() => {
        setHovering(true);

        onItemHover?.(
          item,
          index
        );
      }}
      onMouseLeave={() => {
        setHovering(false);

        onItemHoverEnd?.(
          item,
          index
        );
      }}
      style={{
        position:
          "relative",

        display:
          "block",

        width:
          "100%",

        height:
          "100%",

        padding: 0,

        margin: 0,

        border:
          circle
            ? "5px solid white"
            : "none",

        borderRadius:
          circle
            ? "50%"
            : "16px",

        overflow:
          "hidden",

        background:
          "#e5e7eb",

        cursor:
          "pointer",

        transform:
          hoverTransform,

        transition:
          "transform 260ms ease, box-shadow 260ms ease",

        boxShadow:
          hovering
            ? "0 20px 40px rgba(0,0,0,0.25)"
            : circle
              ? "0 8px 24px rgba(0,0,0,0.16)"
              : "0 4px 12px rgba(0,0,0,0.12)",

        zIndex:
          hovering
            ? 100
            : 1,
      }}
    >
      {typeof children ===
      "function" ? (
        children({
          item,
          index,
        })
      ) : children ? (
        children
      ) : src ? (
        <img
          src={src}
          alt={
            getImageAlt(
              item
            )
          }
          loading="lazy"
          draggable={false}
          className={
            imageClassName
          }
          style={{
            display:
              "block",

            width:
              "100%",

            height:
              "100%",

            objectFit:
              "cover",

            borderRadius:
              circle
                ? "50%"
                : undefined,

            userSelect:
              "none",
          }}
        />
      ) : (
        <div
          style={{
            width:
              "100%",

            height:
              "100%",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            color:
              "#9ca3af",

            fontSize:
              12,
          }}
        >
          Image
        </div>
      )}

      {showTitle &&
        title && (
          <div
            className={
              titleClassName
            }
            style={{
              position:
                "absolute",

              left:
                circle
                  ? "50%"
                  : 0,

              right:
                circle
                  ? undefined
                  : 0,

              bottom:
                circle
                  ? 10
                  : 0,

              transform:
                circle
                  ? "translateX(-50%)"
                  : undefined,

              maxWidth:
                circle
                  ? "80%"
                  : undefined,

              padding:
                circle
                  ? "5px 10px"
                  : "28px 12px 10px",

              borderRadius:
                circle
                  ? 999
                  : 0,

              background:
                circle
                  ? "rgba(0,0,0,0.55)"
                  : "linear-gradient(transparent, rgba(0,0,0,0.8))",

              color:
                "white",

              fontSize:
                12,

              whiteSpace:
                "nowrap",

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              pointerEvents:
                "none",
            }}
          >
            {title}
          </div>
        )}
    </button>
  );
}

export default function ImageGallery({
  items = [],

  layout = "circles",

  hoverEffect = "lift",

  children,

  showTitle = false,

  circleCanvasHeight = 540,

  className = "",

  gridClassName = "",

  circlesClassName = "",

  itemClassName = "",

  imageClassName = "",

  titleClassName = "",

  onItemClick,

  onItemHover,

  onItemHoverEnd,

  ...props
}: ImageGalleryProps) {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

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
          minHeight:
            200,

          width:
            "100%",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          border:
            "1px dashed #d1d5db",

          borderRadius:
            12,
        }}
      >
        {typeof children ===
        "function"
          ? children({
              item: null,
              index: 0,
            })
          : children ??
            "Image Gallery"}
      </div>
    );
  }

  /*
   * CIRCLE / BUBBLE GALLERY
   */
  if (
    layout ===
    "circles"
  ) {
    return (
      <div
        {...props}
        className={[
          circlesClassName,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          position:
            "relative",

          width:
            "100%",

          height:
            circleCanvasHeight,

          minHeight:
            circleCanvasHeight,

          overflow:
            "visible",

          boxSizing:
            "border-box",
        }}
      >
        {safeItems.map(
          (
            item,
            index
          ) => {
            const fallback = [
              {
                "x": 50,
                "y": 50,
                "size": 220
              },
              {
                "x": 27,
                "y": 27,
                "size": 150
              },
              {
                "x": 71,
                "y": 24,
                "size": 130
              },
              {
                "x": 78,
                "y": 59,
                "size": 165
              },
              {
                "x": 28,
                "y": 71,
                "size": 135
              },
              {
                "x": 10,
                "y": 51,
                "size": 105
              },
              {
                "x": 55,
                "y": 15,
                "size": 100
              },
              {
                "x": 61,
                "y": 84,
                "size": 120
              }
            ];

            const config =
              fallback[
                index %
                  fallback.length
              ];

            const size =
              Number(
                item?.size
              ) ||
              config.size;

            const x =
              Number.isFinite(
                Number(
                  item?.x
                )
              )
                ? Number(
                    item.x
                  )
                : config.x;

            const y =
              Number.isFinite(
                Number(
                  item?.y
                )
              )
                ? Number(
                    item.y
                  )
                : config.y;

            const zIndex =
              Number.isFinite(
                Number(
                  item?.zIndex
                )
              )
                ? Number(
                    item.zIndex
                  )
                : index + 1;

            return (
              <div
                key={
                  item?.id ??
                  item?.key ??
                  index
                }
                style={{
                  position:
                    "absolute",

                  left:
                    `${x}%`,

                  top:
                    `${y}%`,

                  width:
                    size,

                  height:
                    size,

                  transform:
                    "translate(-50%, -50%)",

                  zIndex,

                  boxSizing:
                    "border-box",
                }}
              >
                <GalleryImage
                  item={
                    item
                  }
                  index={
                    index
                  }
                  circle
                  showTitle={
                    showTitle
                  }
                  hoverEffect={
                    hoverEffect
                  }
                  children={
                    children
                  }
                  imageClassName={
                    imageClassName
                  }
                  itemClassName={
                    itemClassName
                  }
                  titleClassName={
                    titleClassName
                  }
                  onItemClick={
                    onItemClick
                  }
                  onItemHover={
                    onItemHover
                  }
                  onItemHoverEnd={
                    onItemHoverEnd
                  }
                />
              </div>
            );
          }
        )}
      </div>
    );
  }

  /*
   * COLLAGE
   */
  if (
    layout ===
    "collage"
  ) {
    return (
      <div
        {...props}
        className={
          className
        }
        style={{
          width:
            "100%",

          display:
            "grid",

          gridTemplateColumns:
            "repeat(6, minmax(0, 1fr))",

          gridAutoRows:
            90,

          gap: 12,
        }}
      >
        {safeItems.map(
          (
            item,
            index
          ) => {
            const pattern =
              index % 6;

            const spans =
              pattern === 0
                ? {
                    column:
                      4,
                    row:
                      3,
                  }
                : pattern === 1
                  ? {
                      column:
                        2,
                      row:
                        2,
                    }
                  : pattern === 2
                    ? {
                        column:
                          2,
                        row:
                          2,
                      }
                    : pattern === 3
                      ? {
                          column:
                            3,
                          row:
                            3,
                        }
                      : pattern ===
                          4
                        ? {
                            column:
                              3,
                            row:
                              2,
                          }
                        : {
                            column:
                              2,
                            row:
                              2,
                          };

            return (
              <div
                key={
                  item?.id ??
                  index
                }
                style={{
                  gridColumn:
                    `span ${spans.column}`,

                  gridRow:
                    `span ${spans.row}`,

                  minWidth:
                    0,

                  minHeight:
                    0,
                }}
              >
                <GalleryImage
                  item={
                    item
                  }
                  index={
                    index
                  }
                  hoverEffect={
                    hoverEffect
                  }
                  showTitle={
                    showTitle
                  }
                  children={
                    children
                  }
                  imageClassName={
                    imageClassName
                  }
                  itemClassName={
                    itemClassName
                  }
                  titleClassName={
                    titleClassName
                  }
                  onItemClick={
                    onItemClick
                  }
                  onItemHover={
                    onItemHover
                  }
                  onItemHoverEnd={
                    onItemHoverEnd
                  }
                />
              </div>
            );
          }
        )}
      </div>
    );
  }

  /*
   * GRID
   */
  return (
    <div
      {...props}
      className={[
        gridClassName,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width:
          "100%",

        display:
          "grid",

        gridTemplateColumns:
          "repeat(3, minmax(0, 1fr))",

        gap: 16,
      }}
    >
      {safeItems.map(
        (
          item,
          index
        ) => (
          <div
            key={
              item?.id ??
              index
            }
            style={{
              aspectRatio:
                "1 / 1",

              minWidth:
                0,
            }}
          >
            <GalleryImage
              item={
                item
              }
              index={
                index
              }
              hoverEffect={
                hoverEffect
              }
              showTitle={
                showTitle
              }
              children={
                children
              }
              imageClassName={
                imageClassName
              }
              itemClassName={
                itemClassName
              }
              titleClassName={
                titleClassName
              }
              onItemClick={
                onItemClick
              }
              onItemHover={
                onItemHover
              }
              onItemHoverEnd={
                onItemHoverEnd
              }
            />
          </div>
        )
      )}
    </div>
  );
}