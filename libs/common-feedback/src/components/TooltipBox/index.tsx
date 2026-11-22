import React, { useId, useState } from "react";
import styles from "./styles.module.scss";

export type TooltipBoxThemeMode = "light" | "dark";
export type TooltipBoxPlacement = "top" | "bottom";

export interface TooltipBoxProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: TooltipBoxThemeMode;

  /**
   * Tooltip hint text revealed on hover or focus.
   *
   * @translate
   */
  tooltipText?: string;

  /**
   * Default trigger label when no children are passed.
   *
   * @translate
   */
  triggerText?: string;

  /**
   * Tooltip position relative to the trigger.
   *
   * @select|top|bottom
   */
  placement?: TooltipBoxPlacement;

  /**
   * Optional custom trigger element.
   */
  children?: React.ReactNode;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function TooltipBox({
  themeMode = "light",
  tooltipText = "Helpful context shown on hover or focus",
  triggerText = "Hover or focus me",
  placement = "top",
  children,
  className = "",
  ...props
}: TooltipBoxProps) {
  const tipId = useId();
  const [visible, setVisible] = useState(false);
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const posClass = placement === "bottom" ? styles.pos_bottom : styles.pos_top;

  return (
    <span
      {...props}
      data-theme={themeMode}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={[styles.wrap, modeClass, posClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        aria-describedby={visible ? tipId : undefined}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className={styles.trigger}
      >
        {children || triggerText}
      </button>

      {visible && tooltipText && (
        <span id={tipId} role="tooltip" className={styles.bubble}>
          {tooltipText}
        </span>
      )}
    </span>
  );
}
