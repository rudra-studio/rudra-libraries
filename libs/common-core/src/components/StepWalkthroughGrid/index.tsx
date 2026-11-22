import React from "react";
import styles from "./styles.module.scss";

export type StepWalkthroughGridThemeMode = "light" | "dark";

export interface StepItem {
  step: string;
  title: string;
  description: string;
}

export interface StepWalkthroughGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: StepWalkthroughGridThemeMode;

  /**
   * Section heading text.
   *
   * @translate
   */
  heading?: string;

  /**
   * Ordered walkthrough steps.
   */
  steps?: StepItem[];

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    step: "01",
    title: "Author Reusable Components",
    description:
      "Build clean, typed UI primitives with light and dark theme support inside a Library.",
  },
  {
    step: "02",
    title: "Compose Visual Modules",
    description:
      "Combine components, inputs, state, and logic into modular building blocks.",
  },
  {
    step: "03",
    title: "Assemble & Publish Apps",
    description:
      "Wire routes, data sources, and workflows to ship customizable applications.",
  },
];

export default function StepWalkthroughGrid({
  themeMode = "light",
  heading = "How It Works",
  steps = DEFAULT_STEPS,
  className = "",
  ...props
}: StepWalkthroughGridProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const list =
    Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section
      {...props}
      data-theme={themeMode}
      className={[styles.section, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div className={styles.row}>
        {list.map((item, idx) => (
          <div key={item.step || idx} className={styles.card}>
            <span className={styles.num}>{item.step}</span>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.desc}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
