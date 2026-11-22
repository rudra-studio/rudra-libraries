import React from "react";
import styles from "./styles.module.scss";

export type StepperBarThemeMode = "light" | "dark";
export type StepperBarOrientation = "horizontal" | "vertical";
export type StepStatus = "complete" | "current" | "upcoming";

export interface StepperStepItem {
  id: string;
  title: string;
  description?: string;
  status?: StepStatus;
}

export interface StepperBarProps
  extends Omit<React.HTMLAttributes<HTMLOListElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: StepperBarThemeMode;

  /**
   * Stepper layout orientation.
   *
   * @select|horizontal|vertical
   */
  orientation?: StepperBarOrientation;

  /**
   * Ordered workflow steps.
   */
  steps?: StepperStepItem[];

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_STEPS: StepperStepItem[] = [
  { id: "s1", title: "Create Library", description: "Author UI components", status: "complete" },
  { id: "s2", title: "Build Module", description: "Compose canvas & state", status: "current" },
  { id: "s3", title: "Publish App", description: "Ship live release", status: "upcoming" },
];

export default function StepperBar({
  themeMode = "light",
  orientation = "horizontal",
  steps = DEFAULT_STEPS,
  className = "",
  ...props
}: StepperBarProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const orientClass =
    orientation === "vertical" ? styles.vertical : styles.horizontal;
  const list =
    Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <ol
      {...props}
      data-theme={themeMode}
      className={[styles.list, modeClass, orientClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {list.map((step, idx) => {
        const st = step.status || "upcoming";
        const stClass = styles[`st_${st}`] || styles.st_upcoming;
        return (
          <li
            key={step.id || idx}
            aria-current={st === "current" ? "step" : undefined}
            className={[styles.step, stClass].filter(Boolean).join(" ")}
          >
            <span className={styles.circle}>
              {st === "complete" ? "✓" : idx + 1}
            </span>
            <div className={styles.textCol}>
              <span className={styles.title}>{step.title}</span>
              {step.description && (
                <span className={styles.desc}>{step.description}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
