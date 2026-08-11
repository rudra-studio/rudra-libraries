import React from "react";

export interface LoadingOverlayProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  loading?: boolean;

  children?: React.ReactNode;

  /**
   * Custom loading content.
   * Can be Spinner, Skeleton, text, animation, etc.
   */
  loader?: React.ReactNode;

  /** @translate */
  label?: string;

  showLabel?: boolean;

  blockInteraction?: boolean;

  /**
   * Root customization.
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
   *       {"key":"full","label":"Full Height"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Overlay customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white/60","label":"White 60%"},
   *       {"key":"white/80","label":"White 80%"},
   *       {"key":"black/40","label":"Black 40%"},
   *       {"key":"black/60","label":"Black 60%"},
   *       {"key":"gray-900/60","label":"Dark 60%"},
   *       {"key":"transparent","label":"Transparent"}
   *     ]
   *   },
   *   {
   *     "key":"Backdrop Blur",
   *     "prefix":"backdrop-blur",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"}
   *     ]
   *   }
   * ]
   */
  overlayClassName?: string;

  /**
   * Loader container customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"},
   *       {"key":"4","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  loaderClassName?: string;

  /**
   * Label customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Text Size",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"xs","label":"Extra Small"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"base","label":"Medium"},
   *       {"key":"lg","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-500","label":"Gray"},
   *       {"key":"gray-700","label":"Dark Gray"},
   *       {"key":"white","label":"White"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   }
   * ]
   */
  labelClassName?: string;
}

export default function LoadingOverlay({
  loading = false,
  children,
  loader,
  label = "Loading...",
  showLabel = false,
  blockInteraction = true,
  className = "",
  overlayClassName = "",
  loaderClassName = "",
  labelClassName = "",
  ...props
}: LoadingOverlayProps) {
  return (
    <div
      {...props}
      aria-busy={loading}
      className={[
        "relative",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}

      {loading && (
        <div
          role="status"
          aria-live="polite"
          aria-label={label}
          className={[
            "absolute inset-0 z-50",
            "flex items-center justify-center",
            "bg-white/70 backdrop-blur-sm",
            blockInteraction
              ? "pointer-events-auto"
              : "pointer-events-none",
            overlayClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={[
              "flex flex-col",
              "items-center justify-center",
              "gap-2",
              loaderClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {loader || (
              <span
                aria-hidden="true"
                className={[
                  "size-7",
                  "animate-spin",
                  "rounded-full",
                  "border-2",
                  "border-gray-200",
                  "border-t-blue-600",
                ].join(" ")}
              />
            )}

            {showLabel && (
              <span
                className={[
                  "text-sm text-gray-600",
                  labelClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}