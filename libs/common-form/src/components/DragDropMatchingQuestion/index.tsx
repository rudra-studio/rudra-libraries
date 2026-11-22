import React, { useState } from "react";
import styles from "./styles.module.scss";

export type DragDropMatchingQuestionThemeMode = "light" | "dark";

export interface MatchingPairItem {
  id: string;
  prompt: string;
  answer: string;
}

export interface DragDropMatchingQuestionProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: DragDropMatchingQuestionThemeMode;

  /**
   * Activity heading text.
   *
   * @translate
   */
  heading?: string;

  /**
   * Instructions shown to the user.
   *
   * @translate
   */
  instruction?: string;

  /**
   * Prompt and matching answer pairs.
   */
  pairs?: MatchingPairItem[];

  /**
   * Emits updated matches map whenever a pair changes.
   */
  onMatchChange?: (matches: Record<string, string>) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_PAIRS: MatchingPairItem[] = [
  {
    id: "ui_layer",
    prompt: "Reusable Components & Themes",
    answer: "React & TypeScript",
  },
  {
    id: "canvas_layer",
    prompt: "Visual Orchestration & State",
    answer: "Rudra Modules",
  },
  {
    id: "data_layer",
    prompt: "Relational Storage & Containers",
    answer: "PostgreSQL & Docker",
  },
];

export default function DragDropMatchingQuestion({
  themeMode = "light",
  heading = "Match Concepts to Stack",
  instruction = "Drag an answer chip onto a prompt slot, or click an answer chip and then click a prompt row.",
  pairs = DEFAULT_PAIRS,
  onMatchChange,
  className = "",
  ...props
}: DragDropMatchingQuestionProps) {
  const list =
    Array.isArray(pairs) && pairs.length > 0 ? pairs : DEFAULT_PAIRS;
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedAnswer, setDraggedAnswer] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const answers = list.map((p) => p.answer);

  const assignAnswer = (promptId: string, ans: string) => {
    if (!ans) return;
    const next: Record<string, string> = {};
    Object.entries(matches).forEach(([k, v]) => {
      if (v !== ans) next[k] = v;
    });
    next[promptId] = ans;
    setMatches(next);
    setDraggedAnswer("");
    setSelectedAnswer("");
    onMatchChange?.(next);
  };

  const resetAll = () => {
    setMatches({});
    setDraggedAnswer("");
    setSelectedAnswer("");
    onMatchChange?.({});
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.topRow}>
        <div>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.instruction}>{instruction}</p>
        </div>
        <button type="button" onClick={resetAll} className={styles.resetBtn}>
          Reset Matches
        </button>
      </div>

      <div className={styles.chipBank}>
        {answers.map((ans, idx) => {
          const isPicked = selectedAnswer === ans;
          return (
            <button
              key={`${ans}-${idx}`}
              type="button"
              draggable
              onDragStart={() => setDraggedAnswer(ans)}
              onClick={() => setSelectedAnswer(isPicked ? "" : ans)}
              className={`${styles.chip} ${isPicked ? styles.pickedChip : ""}`}
            >
              {ans}
            </button>
          );
        })}
      </div>

      <div className={styles.slots}>
        {list.map((pair) => {
          const matchedAns = matches[pair.id] || "";
          return (
            <div
              key={pair.id}
              role="button"
              tabIndex={0}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => assignAnswer(pair.id, draggedAnswer)}
              onClick={() => {
                if (selectedAnswer) assignAnswer(pair.id, selectedAnswer);
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && selectedAnswer) {
                  e.preventDefault();
                  assignAnswer(pair.id, selectedAnswer);
                }
              }}
              className={`${styles.slotRow} ${matchedAns ? styles.matchedSlot : ""}`}
            >
              <span className={styles.prompt}>{pair.prompt}</span>
              <span className={styles.badge}>
                {matchedAns || "Drop or click to match"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
