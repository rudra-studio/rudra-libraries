import React from "react";
import styles from "./styles.module.scss";

export interface MathExpressionProps {
  /** @translate @textarea */
  visualText: string;

  /** @textarea */
  latex?: string;

  /** @translate */
  accessibleLabel?: string;

  /** @select|inline|block */
  display?: "inline" | "block";

  /** @select|ink|chalk|accent */
  tone?: "ink" | "chalk" | "accent";

  /** @select|sm|md|lg|xl */
  size?: "sm" | "md" | "lg" | "xl";

  highlighted?: boolean;

  /** @type|class */
  className?: string;
}

export default function MathExpression({
  visualText = "x² − 5x + 6 = 0",
  latex = "",
  accessibleLabel,
  display = "block",
  tone = "ink",
  size = "lg",
  highlighted = false,
  className = "",
}: MathExpressionProps) {
  const label = accessibleLabel || visualText;
  const classes = [
    styles.root,
    styles[display],
    styles[tone],
    styles[size],
    highlighted ? styles.highlighted : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <span
      className={classes}
      role="math"
      aria-label={label}
      data-latex={latex || undefined}
    >
      <span aria-hidden="true">{visualText}</span>
      {latex ? (
        <math className={styles.semantic} aria-hidden="true">
          <semantics>
            <mtext>{visualText}</mtext>
            <annotation encoding="application/x-tex">{latex}</annotation>
          </semantics>
        </math>
      ) : null}
    </span>
  );
}
