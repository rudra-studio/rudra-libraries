import React from "react";
import styles from "./styles.module.scss";

export type ParticleDriftThemeMode = "light" | "dark";
export type ParticleGlyphTheme = "hearts" | "sparkles" | "confetti" | "petals";
export type ParticleDensity = "low" | "medium" | "high";

export interface ParticleDriftStageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ParticleDriftThemeMode;

  /**
   * Particle glyph set.
   *
   * @select|hearts|sparkles|confetti|petals
   */
  particleTheme?: ParticleGlyphTheme;

  /**
   * Particle count density.
   *
   * @select|low|medium|high
   */
  density?: ParticleDensity;

  /**
   * Foreground stage heading.
   *
   * @translate
   */
  heading?: string;

  /**
   * Foreground stage caption.
   *
   * @translate
   */
  caption?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const GLYPHS: Record<ParticleGlyphTheme, string[]> = {
  hearts: ["💖", "💕", "💗", "💘"],
  sparkles: ["✨", "⭐", "💫", "🌟"],
  confetti: ["🎉", "🎊", "🎈", "✨"],
  petals: ["🌸", "🌹", "🌺", "🌷"],
};

const COUNTS: Record<ParticleDensity, number> = {
  low: 6,
  medium: 12,
  high: 18,
};

export default function ParticleDriftStage({
  themeMode = "light",
  particleTheme = "sparkles",
  density = "medium",
  heading = "Ambient Motion Stage",
  caption = "Floating particles with reduced-motion accessibility.",
  className = "",
  ...props
}: ParticleDriftStageProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const symbols = GLYPHS[particleTheme] || GLYPHS.sparkles;
  const count = COUNTS[density] || 12;

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.stage, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.layer} aria-hidden="true">
        {Array.from({ length: count }, (_, idx) => (
          <span
            key={idx}
            className={styles.glyph}
            style={{
              left: `${(idx * 29 + 7) % 92}%`,
              animationDelay: `${(idx % 6) * 0.55}s`,
              animationDuration: `${3.8 + (idx % 4) * 0.8}s`,
            }}
          >
            {symbols[idx % symbols.length]}
          </span>
        ))}
      </div>

      <div className={styles.foreground}>
        {heading && <h3 className={styles.heading}>{heading}</h3>}
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    </div>
  );
}
