import React, { useState } from "react";
import styles from "./styles.module.scss";

export type SpatialCardThemeMode = "light" | "dark";

export interface SpatialCard3DProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: SpatialCardThemeMode;

  /**
   * Card heading text.
   *
   * @translate
   */
  heading?: string;

  /**
   * Card description text.
   *
   * @translate
   */
  description?: string;

  /**
   * Optional badge text.
   *
   * @translate
   */
  badgeText?: string;

  /**
   * Maximum pointer tilt angle in degrees.
   */
  maxTiltDeg?: number;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function SpatialCard3D({
  themeMode = "light",
  heading = "Interactive Spatial Card",
  description = "Move your pointer across the card for perspective tilt depth.",
  badgeText = "3D Tilt",
  maxTiltDeg = 10,
  className = "",
  ...props
}: SpatialCard3DProps) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const maxDeg = Math.max(2, Math.min(25, Number(maxTiltDeg) || 10));

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({
      rx: Number((-ny * maxDeg).toFixed(2)),
      ry: Number((nx * maxDeg).toFixed(2)),
    });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        ...props.style,
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.top}>
        {heading && <h3 className={styles.heading}>{heading}</h3>}
        {badgeText && <span className={styles.badge}>{badgeText}</span>}
      </div>
      {description && <p className={styles.desc}>{description}</p>}
    </div>
  );
}
