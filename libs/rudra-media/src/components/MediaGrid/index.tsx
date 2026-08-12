import React from "react";

export interface MediaGridProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Media data.
   *
   * @optional
   */
  items?: any[];

  /**
   * Media item template.
   *
   * Receives the current item
   * and index.
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

  /**
   * Grid customization.
   *
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
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"1"},
   *       {"key":"2","label":"2"},
   *       {"key":"3","label":"3"},
   *       {"key":"4","label":"4"},
   *       {"key":"5","label":"5"},
   *       {"key":"6","label":"6"},
   *       {"key":"8","label":"8"}
   *     ]
   *   },
   *   {
   *     "key":"Horizontal Gap",
   *     "prefix":"gap-x",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"1"},
   *       {"key":"2","label":"2"},
   *       {"key":"3","label":"3"},
   *       {"key":"4","label":"4"},
   *       {"key":"6","label":"6"},
   *       {"key":"8","label":"8"}
   *     ]
   *   },
   *   {
   *     "key":"Vertical Gap",
   *     "prefix":"gap-y",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"1"},
   *       {"key":"2","label":"2"},
   *       {"key":"3","label":"3"},
   *       {"key":"4","label":"4"},
   *       {"key":"6","label":"6"},
   *       {"key":"8","label":"8"}
   *     ]
   *   },
   *   {
   *     "key":"Items",
   *     "prefix":"items",
   *     "type":"select",
   *     "options":[
   *       {"key":"start","label":"Start"},
   *       {"key":"center","label":"Center"},
   *       {"key":"end","label":"End"},
   *       {"key":"stretch","label":"Stretch"}
   *     ]
   *   },
   *   {
   *     "key":"Padding",
   *     "prefix":"p",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"1"},
   *       {"key":"2","label":"2"},
   *       {"key":"3","label":"3"},
   *       {"key":"4","label":"4"},
   *       {"key":"6","label":"6"},
   *       {"key":"8","label":"8"}
   *     ]
   *   },
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full Width"}
   *     ]
   *   }
   * ]
   */
  className?: string;
}

export default function MediaGrid({
  items = [],
  children,
  className = "",
  ...props
}: MediaGridProps) {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  /*
   * Builder-safe empty state.
   *
   * This also invokes the node function
   * with an empty item so Rudra can still
   * render/edit the template before data
   * is connected.
   */
  if (
    safeItems.length === 0
  ) {
    return (
      <div
        {...props}
        className={[
          "grid w-full",
          "grid-cols-3",
          "gap-4",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "col-span-full",
            "flex min-h-32",
            "items-center",
            "justify-center",
            "rounded-lg",
            "border",
            "border-dashed",
            "border-gray-300",
            "bg-gray-50",
            "p-4",
          ].join(" ")}
        >
          {typeof children ===
            "function" ? (
            children({
              item: null,
              index: 0,
            })
          ) : children ? (
            children
          ) : (
            <span className="text-sm text-gray-400">
              Media Grid
              (No Data Bound)
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      {...props}
      className={[
        "grid w-full",
        "grid-cols-3",
        "gap-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {safeItems.map(
        (item, index) => (
          <React.Fragment
            key={
              item?.id ??
              item?.key ??
              index
            }
          >
            {typeof children ===
              "function"
              ? children({
                item,
                index,
              })
              : children}
          </React.Fragment>
        )
      )}
    </div>
  );
}