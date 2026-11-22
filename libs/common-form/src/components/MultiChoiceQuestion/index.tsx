import React, { useState } from "react";
import styles from "./styles.module.scss";

export type MultiChoiceQuestionThemeMode = "light" | "dark";

export interface ChoiceOptionItem {
  id: string;
  label: string;
  isCorrect?: boolean;
}

export interface MultiChoiceQuestionProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: MultiChoiceQuestionThemeMode;

  /**
   * Question prompt text.
   *
   * @translate
   */
  question?: string;

  /**
   * Answer choices.
   */
  options?: ChoiceOptionItem[];

  /**
   * Allow selecting multiple choices.
   *
   * @schema {"type":"boolean"}
   */
  allowMultiple?: boolean;

  /**
   * Show the Check Answer button and feedback alert.
   *
   * @schema {"type":"boolean"}
   */
  showCheckButton?: boolean;

  /**
   * Explanation shown after checking answer.
   *
   * @translate
   */
  explanation?: string;

  /**
   * Emits selected choice IDs on change.
   */
  onAnswerChange?: (selectedIds: string[]) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_CHOICES: ChoiceOptionItem[] = [
  {
    id: "modular_ui",
    label: "Modular UI libraries + composable canvas blocks",
    isCorrect: true,
  },
  {
    id: "monolith",
    label: "Hardcoded single-file pages with no inputs",
    isCorrect: false,
  },
  {
    id: "no_state",
    label: "Static text without state or event handlers",
    isCorrect: false,
  },
];

export default function MultiChoiceQuestion({
  themeMode = "light",
  question = "Which approach keeps Rudra modules reusable and maintainable?",
  options = DEFAULT_CHOICES,
  allowMultiple = false,
  showCheckButton = true,
  explanation = "Modular components with typed inputs and callbacks remain easy to reuse and theme.",
  onAnswerChange,
  className = "",
  ...props
}: MultiChoiceQuestionProps) {
  const list =
    Array.isArray(options) && options.length > 0 ? options : DEFAULT_CHOICES;
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const toggleChoice = (id: string) => {
    setChecked(false);
    const next = allowMultiple
      ? selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
      : [id];
    setSelected(next);
    onAnswerChange?.(next);
  };

  const correctIds = list.filter((o) => o.isCorrect).map((o) => o.id);
  const isAllCorrect =
    correctIds.length > 0 &&
    selected.length === correctIds.length &&
    correctIds.every((id) => selected.includes(id));

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.question}>{question}</div>

      <div className={styles.options}>
        {list.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggleChoice(opt.id)}
              className={`${styles.optBtn} ${active ? styles.activeOpt : ""}`}
            >
              <span className={styles.marker}>
                {allowMultiple ? (active ? "☑" : "☐") : active ? "●" : "○"}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {showCheckButton && (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => setChecked(true)}
            className={styles.checkBtn}
          >
            Check Answer
          </button>
        </div>
      )}

      {checked && (
        <div
          role="status"
          aria-live="polite"
          className={`${styles.feedback} ${isAllCorrect ? styles.correctBox : styles.reviewBox}`}
        >
          <strong>{isAllCorrect ? "Correct: " : "Review: "}</strong>
          <span>{explanation}</span>
        </div>
      )}
    </div>
  );
}
