import React from "react";
import styles from "./styles.module.scss";

export interface MathManipulatorProps {
  /** @translate */
  leftTerm: string;

  /** @translate */
  relation?: string;

  /** @translate */
  rightTerm: string;

  /** @translate */
  movedTerm?: string;

  /** @translate */
  resultingLeft?: string;

  /** @translate */
  resultingRight?: string;

  /** @select|before|moving|after */
  phase?: "before" | "moving" | "after";

  /** @select|move-across-equals|change-sign|group|cancel */
  operation?: "move-across-equals" | "change-sign" | "group" | "cancel";

  reducedMotion?: boolean;

  /** @translate @textarea */
  explanation?: string;

  /** @type|function|return:void|args:payload */
  onPhaseComplete?: (payload: { phase: string; operation: string }) => void;

  /** @type|class */
  className?: string;
}

export default function MathManipulator({
  leftTerm = "x² − 5x",
  relation = "=",
  rightTerm = "−6",
  movedTerm = "",
  resultingLeft,
  resultingRight,
  phase = "before",
  operation = "move-across-equals",
  reducedMotion = false,
  explanation = "",
  onPhaseComplete,
  className = "",
}: MathManipulatorProps) {
  const finalLeft = phase === "after" && resultingLeft ? resultingLeft : leftTerm;
  const finalRight = phase === "after" && resultingRight ? resultingRight : rightTerm;
  return (
    <figure className={[styles.root, reducedMotion ? styles.reduced : "", className].filter(Boolean).join(" ")} aria-label={explanation || "Animated equation transformation"}>
      <div className={styles.equation}>
        <span>{finalLeft}</span><b>{relation}</b><span>{finalRight}</span>
        {movedTerm ? <mark className={phase === "moving" ? styles.moving : styles.marker}>{movedTerm}</mark> : null}
      </div>
      <figcaption>{explanation}</figcaption>
      {phase === "moving" ? <button type="button" onClick={() => onPhaseComplete?.({ phase: "after", operation })}>Finish animation</button> : null}
    </figure>
  );
}
