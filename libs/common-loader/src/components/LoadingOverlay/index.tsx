import React from "react";
import styles from "./styles.module.scss";

export type LoadingOverlayThemeMode = "light" | "dark";

export interface LoadingOverlayProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  themeMode?: LoadingOverlayThemeMode;
  loading?: boolean;
  children?: React.ReactNode;
  loader?: React.ReactNode;
  label?: string;
  showLabel?: boolean;
  blockInteraction?: boolean;
  className?: string;
  overlayClassName?: string;
  loaderClassName?: string;
  labelClassName?: string;
}

export default function LoadingOverlay({
  themeMode = "light",
  loading = true,
  children,
  loader,
  label = "Loading...",
  showLabel = true,
  blockInteraction = true,
  className = "",
  overlayClassName = "",
  loaderClassName = "",
  labelClassName = "",
  ...props
}: LoadingOverlayProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  return (
    <div
      {...props}
      aria-busy={loading}
      data-theme={themeMode}
      className={[styles.root, modeClass, "relative", className]
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
            styles.overlay,
            "absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm",
            blockInteraction ? "pointer-events-auto" : "pointer-events-none",
            overlayClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={[
              "flex flex-col items-center justify-center gap-2",
              loaderClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {loader || (
              <span
                aria-hidden="true"
                className={[
                  styles.spinner,
                  "size-7 rounded-full border-2",
                ].join(" ")}
              />
            )}

            {showLabel && (
              <span
                className={[styles.label, "text-sm", labelClassName]
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
