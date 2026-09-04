import React from "react";
import styles from "./styles.module.scss";

export interface MathVisualWidgetProps {
  /** @select|right-triangle|circle|abacus|number-line */
  kind?: "right-triangle" | "circle" | "abacus" | "number-line";

  /** @widget|slider */
  primaryValue?: number;

  /** @widget|slider */
  secondaryValue?: number;

  /** @translate */
  labelA?: string;

  /** @translate */
  labelB?: string;

  /** @translate */
  labelC?: string;

  /** @color */
  accentColor?: string;

  interactive?: boolean;

  /** @type|function|return:void|args:payload */
  onValueChange?: (payload: { kind: string; primaryValue: number; secondaryValue: number }) => void;

  /** @type|class */
  className?: string;
}

export default function MathVisualWidget({
  kind = "right-triangle",
  primaryValue = 3,
  secondaryValue = 4,
  labelA = "a",
  labelB = "b",
  labelC = "c",
  accentColor = "#f27059",
  interactive = false,
  onValueChange,
  className = "",
}: MathVisualWidgetProps) {
  const change = (delta: number) => onValueChange?.({ kind, primaryValue: Math.max(0, primaryValue + delta), secondaryValue });
  return (
    <figure className={[styles.root, className].filter(Boolean).join(" ")} style={{ "--accent": accentColor } as React.CSSProperties}>
      <svg viewBox="0 0 320 220" role="img" aria-label={kind.replace("-", " ")}>
        {kind === "right-triangle" ? <>
          <path d="M55 180 L55 45 L270 180 Z" className={styles.shape} />
          <path d="M55 160 L75 160 L75 180" className={styles.guide} />
          <text x="32" y="116">{labelA}</text><text x="156" y="207">{labelB}</text><text x="170" y="102">{labelC}</text>
        </> : null}
        {kind === "circle" ? <>
          <circle cx="160" cy="108" r="78" className={styles.shape} />
          <line x1="160" y1="108" x2="238" y2="108" className={styles.guide} />
          <text x="190" y="98">{labelA || "r"}</text>
        </> : null}
        {kind === "number-line" ? <>
          <line x1="30" y1="110" x2="290" y2="110" className={styles.guide} />
          {[0,1,2,3,4,5,6].map((value) => <g key={value}><line x1={40 + value * 40} y1="100" x2={40 + value * 40} y2="120" className={styles.guide}/><text x={36 + value * 40} y="145">{value}</text></g>)}
          <circle cx={40 + Math.min(6, primaryValue) * 40} cy="110" r="10" className={styles.point} />
        </> : null}
        {kind === "abacus" ? <>
          {[0,1,2,3].map((row) => <g key={row}><line x1="35" y1={45 + row * 42} x2="285" y2={45 + row * 42} className={styles.guide}/>{[0,1,2,3,4,5,6,7].map((bead) => <circle key={bead} cx={55 + bead * 28} cy={45 + row * 42} r="11" className={bead < Math.min(primaryValue,8) ? styles.point : styles.bead}/>)}</g>)}
        </> : null}
      </svg>
      <figcaption>{kind === "abacus" ? "Move the beads to model the number." : kind === "right-triangle" ? "Explore the sides of a right-angled triangle." : kind === "circle" ? "Connect radius, diameter, and circumference." : "Move along the number line."}</figcaption>
      {interactive ? <div className={styles.controls}><button type="button" onClick={() => change(-1)}>−</button><output>{primaryValue}</output><button type="button" onClick={() => change(1)}>+</button></div> : null}
    </figure>
  );
}
