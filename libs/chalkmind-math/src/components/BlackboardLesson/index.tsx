import React, { useEffect, useId, useState } from "react";
import styles from "./styles.module.scss";

export interface BlackboardMatrix {
  rows: Array<Array<string | number>>;
  separatorBeforeColumn?: number;
  label?: string;
  columnLabels?: string[];
}

export interface BlackboardGraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  accent?: boolean;
}

export interface BlackboardGraphEdge {
  from: string;
  to: string;
  label?: string;
  directed?: boolean;
}

export type BlackboardContentBlock =
  | { type: "heading"; text: string; level?: 3 | 4 }
  | { type: "text"; text: string; emphasis?: boolean }
  | { type: "equation"; visualText: string; latex?: string; label?: string; accessibleLabel?: string }
  | { type: "matrix"; matrix: BlackboardMatrix }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "definition"; term: string; text: string }
  | { type: "theorem"; title?: string; statement: string }
  | { type: "proof"; title?: string; lines: string[] }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "graph"; caption?: string; nodes: BlackboardGraphNode[]; edges: BlackboardGraphEdge[] }
  | { type: "note"; text: string; tone?: "info" | "warning" | "success" };

export interface BlackboardLessonStep {
  id: string;
  title: string;
  expression?: string;
  matrix?: BlackboardMatrix;
  content?: BlackboardContentBlock[];
  working?: string[];
  narration?: string;
  explanation?: string;
  simpleExplanation?: string;
  visualExplanation?: string;
  why?: string;
  commonMistake?: string;
  teacherPrompt?: string;
  completed?: boolean;
}

export interface BlackboardLessonDocument {
  title: string;
  lessonKind: "worked-example" | "concept" | "theorem" | "proof" | "derivation" | "revision";
  problemLabel: string;
  problemStatement: string;
  learningGoal: string;
  steps: BlackboardLessonStep[];
}

export type BlackboardLessonEditOperation =
  | { id: string; actor: "ai" | "teacher"; type: "update-lesson"; patch: Partial<Omit<BlackboardLessonDocument, "steps">> }
  | { id: string; actor: "ai" | "teacher"; type: "replace-steps"; steps: BlackboardLessonStep[] }
  | { id: string; actor: "ai" | "teacher"; type: "add-step"; step: BlackboardLessonStep; index?: number }
  | { id: string; actor: "ai" | "teacher"; type: "update-step"; stepId: string; patch: Partial<Omit<BlackboardLessonStep, "id">> }
  | { id: string; actor: "ai" | "teacher"; type: "remove-step"; stepId: string }
  | { id: string; actor: "ai" | "teacher"; type: "move-step"; stepId: string; toIndex: number };

export interface BlackboardLessonOptions {
  showHeader?: boolean;
  showProgress?: boolean;
  showProblem?: boolean;
  showLearningGoal?: boolean;
  showStepNumbers?: boolean;
  allowStepSelection?: boolean;
  showTeacherButton?: boolean;
  showCaptions?: boolean;
  showControls?: boolean;
  showPlaybackControl?: boolean;
  showRepeatControl?: boolean;
  showSpeed?: boolean;
  showNextControl?: boolean;
  showPopup?: boolean;
}

export interface BlackboardLessonLabels {
  boardPrefix?: string;
  goalPrefix?: string;
  teacherButton?: string;
  teacherBadge?: string;
  play?: string;
  pause?: string;
  repeat?: string;
  next?: string;
  speedPrefix?: string;
  empty?: string;
  popupEyebrow?: string;
  closePopup?: string;
  defaultExplanationTitle?: string;
  whyTitle?: string;
  mistakeTitle?: string;
  teacherPromptTitle?: string;
  simpleTitle?: string;
  visualTitle?: string;
  visualFallback?: string;
  checkFallback?: string;
  backToExplanation?: string;
}

export interface BlackboardExplanationAction {
  id: string;
  label: string;
  mode: "simple" | "visual" | "check";
}

export interface BlackboardLessonTheme {
  background?: string;
  text?: string;
  accent?: string;
  muted?: string;
  border?: string;
  popupBackground?: string;
  popupText?: string;
  danger?: string;
}

export interface BlackboardLessonProps {
  /** @translate */
  title?: string;

  /** @select|worked-example|concept|theorem|proof|derivation|revision */
  lessonKind?: "worked-example" | "concept" | "theorem" | "proof" | "derivation" | "revision";

  /** @translate */
  problemLabel?: string;

  /** @translate @textarea */
  problemStatement?: string;

  /** @translate */
  learningGoal?: string;

  /** @type|json */
  steps: BlackboardLessonStep[];

  /**
   * Ordered, idempotent edits from either an AI or a teacher. Duplicate
   * operation IDs are applied once.
   * @type|json
   */
  editOperations?: BlackboardLessonEditOperation[];

  /** @type|json */
  boardOptions?: BlackboardLessonOptions;

  /** @type|json */
  labels?: BlackboardLessonLabels;

  /** @type|json */
  explanationActions?: BlackboardExplanationAction[];

  /** @type|json */
  theme?: BlackboardLessonTheme;

  /** @widget|slider */
  activeStep?: number;

  /** @type|boolean */
  playing?: boolean;

  /** @type|boolean */
  reducedMotion?: boolean;

  /** @type|boolean */
  captionsEnabled?: boolean;

  /** @type|boolean */
  showStepPopup?: boolean;

  /** @type|boolean */
  popupInitiallyOpen?: boolean;

  /** @type|boolean */
  autoAdvance?: boolean;

  /** @widget|slider */
  stepDurationMs?: number;

  /** @select|Slow|Normal|Fast */
  speedLabel?: string;

  /** @type|function|return:void|args:payload */
  onStepSelect?: (payload: { stepId: string; index: number }) => void;

  /** @type|function|return:void|args:payload */
  onExplain?: (payload: { stepId: string; option: string }) => void;

  /** @type|function|return:void|args:payload */
  onNext?: (payload: { nextIndex: number }) => void;

  /** @type|function|return:void|args:payload */
  onPlaybackChange?: (payload: { playing: boolean }) => void;

  /** @type|function|return:void|args:payload */
  onRepeat?: (payload: { stepId: string; index: number }) => void;

  /** @type|class */
  className?: string;
}

const blackboardLessonDefaultOptions: Required<BlackboardLessonOptions> = {
  showHeader: true,
  showProgress: true,
  showProblem: true,
  showLearningGoal: true,
  showStepNumbers: true,
  allowStepSelection: true,
  showTeacherButton: true,
  showCaptions: true,
  showControls: true,
  showPlaybackControl: true,
  showRepeatControl: true,
  showSpeed: true,
  showNextControl: true,
  showPopup: true,
};

const blackboardLessonDefaultLabels: Required<BlackboardLessonLabels> = {
  boardPrefix: "Mathematics board",
  goalPrefix: "Goal:",
  teacherButton: "What is the teacher doing here?",
  teacherBadge: "Teacher",
  play: "Play lesson",
  pause: "Pause lesson",
  repeat: "Repeat this step",
  next: "Write next step",
  speedPrefix: "Speed:",
  empty: "Add lesson steps to begin writing on the board.",
  popupEyebrow: "Teacher explanation",
  closePopup: "Close step explanation",
  defaultExplanationTitle: "What are we doing?",
  whyTitle: "Why is this valid?",
  mistakeTitle: "Common mistake",
  teacherPromptTitle: "Teacher asks",
  simpleTitle: "In simpler words",
  visualTitle: "Follow it visually",
  visualFallback: "Read each chalk line from top to bottom and watch which values change.",
  checkFallback: "Can you explain what changed in this step?",
  backToExplanation: "Back to full explanation",
};

const blackboardLessonDefaultExplanationActions: BlackboardExplanationAction[] = [
  { id: "simpler", label: "Explain in simpler words", mode: "simple" },
  { id: "visual", label: "Show a visual example", mode: "visual" },
  { id: "check", label: "Ask me a check question", mode: "check" },
];

export function applyBlackboardLessonOperations(
  baseLesson: BlackboardLessonDocument,
  operations: BlackboardLessonEditOperation[] = [],
): BlackboardLessonDocument {
  let lesson = { ...baseLesson, steps: [...baseLesson.steps] };
  const appliedIds = new Set<string>();

  operations.forEach((operation) => {
    if (!operation?.id || appliedIds.has(operation.id)) return;
    appliedIds.add(operation.id);

    if (operation.type === "update-lesson") {
      lesson = { ...lesson, ...operation.patch, steps: lesson.steps };
      return;
    }
    if (operation.type === "replace-steps") {
      lesson = { ...lesson, steps: [...operation.steps] };
      return;
    }
    if (operation.type === "add-step") {
      if (lesson.steps.some((step) => step.id === operation.step.id)) return;
      const index = Math.min(Math.max(operation.index ?? lesson.steps.length, 0), lesson.steps.length);
      const nextSteps = [...lesson.steps];
      nextSteps.splice(index, 0, operation.step);
      lesson = { ...lesson, steps: nextSteps };
      return;
    }
    if (operation.type === "update-step") {
      lesson = {
        ...lesson,
        steps: lesson.steps.map((step) =>
          step.id === operation.stepId ? { ...step, ...operation.patch, id: step.id } : step,
        ),
      };
      return;
    }
    if (operation.type === "remove-step") {
      lesson = { ...lesson, steps: lesson.steps.filter((step) => step.id !== operation.stepId) };
      return;
    }

    const fromIndex = lesson.steps.findIndex((step) => step.id === operation.stepId);
    if (fromIndex < 0) return;
    const nextSteps = [...lesson.steps];
    const [movedStep] = nextSteps.splice(fromIndex, 1);
    const toIndex = Math.min(Math.max(operation.toIndex, 0), nextSteps.length);
    nextSteps.splice(toIndex, 0, movedStep);
    lesson = { ...lesson, steps: nextSteps };
  });

  return lesson;
}

function MatrixDisplay({
  matrix,
  compact = false,
}: {
  matrix: BlackboardMatrix;
  compact?: boolean;
}) {
  const columnCount = Math.max(1, ...matrix.rows.map((row) => row.length));

  return (
    <div className={[styles.matrixPresentation, compact ? styles.matrixCompact : ""].filter(Boolean).join(" ")}>
      {matrix.label ? <span className={styles.matrixLabel}>{matrix.label}</span> : null}
      <div className={styles.matrix}>
        {matrix.columnLabels?.length ? (
          <div
            className={styles.matrixColumnLabels}
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(2.25rem, auto))` }}
            aria-hidden="true"
          >
            {matrix.columnLabels.map((label, index) => (
              <span
                key={index}
                className={matrix.separatorBeforeColumn === index ? styles.augmentedCell : ""}
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}
        <div
          className={styles.matrixGrid}
          style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(2.25rem, auto))` }}
          role="table"
          aria-label={matrix.label || "Matrix"}
        >
          {matrix.rows.flatMap((row, rowIndex) =>
            Array.from({ length: columnCount }, (_, columnIndex) => (
              <span
                key={`${rowIndex}-${columnIndex}`}
                role="cell"
                className={matrix.separatorBeforeColumn === columnIndex ? styles.augmentedCell : ""}
              >
                {row[columnIndex] ?? ""}
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
}

function ContentBlockView({
  block,
  reducedMotion,
  animate,
}: {
  block: BlackboardContentBlock;
  reducedMotion: boolean;
  animate: boolean;
}) {
  const markerId = useId();

  if (block.type === "heading") {
    return block.level === 4
      ? <h4 className={styles.contentHeading}>{block.text}</h4>
      : <h3 className={styles.contentHeading}>{block.text}</h3>;
  }

  if (block.type === "text") {
    return <p className={[styles.contentText, block.emphasis ? styles.contentEmphasis : ""].filter(Boolean).join(" ")}>{block.text}</p>;
  }

  if (block.type === "equation") {
    return (
      <div
        className={[styles.equationBlock, reducedMotion || !animate ? "" : styles.writingBlock].filter(Boolean).join(" ")}
        data-latex={block.latex}
        aria-label={block.accessibleLabel || block.label || block.visualText}
      >
        {block.label ? <span className={styles.equationLabel}>{block.label}</span> : null}
        <span className={styles.equationVisual}>{block.visualText}</span>
      </div>
    );
  }

  if (block.type === "matrix") return <MatrixDisplay matrix={block.matrix} />;

  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return (
      <List className={styles.contentList}>
        {block.items.map((item, index) => <li key={index}>{item}</li>)}
      </List>
    );
  }

  if (block.type === "definition") {
    return (
      <div className={styles.definitionBlock}>
        <strong>Definition · {block.term}</strong>
        <p>{block.text}</p>
      </div>
    );
  }

  if (block.type === "theorem") {
    return (
      <div className={styles.theoremBlock}>
        <strong>{block.title || "Theorem"}</strong>
        <p>{block.statement}</p>
      </div>
    );
  }

  if (block.type === "proof") {
    return (
      <div className={styles.proofBlock}>
        <strong>{block.title || "Proof"}</strong>
        <ol>
          {block.lines.map((line, index) => <li key={index}>{line}</li>)}
        </ol>
      </div>
    );
  }

  if (block.type === "table") {
    return (
      <div className={styles.tableScroll}>
        <table className={styles.theoryTable}>
          {block.caption ? <caption>{block.caption}</caption> : null}
          <thead>
            <tr>{block.headers.map((header, index) => <th key={index} scope="col">{header}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "graph") {
    const nodeById = new Map(block.nodes.map((node) => [node.id, node]));
    return (
      <figure className={styles.graphBlock}>
        <svg viewBox="0 0 640 260" role="img" aria-label={block.caption || "Mathematical graph or state diagram"}>
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {block.edges.map((edge, index) => {
            const from = nodeById.get(edge.from);
            const to = nodeById.get(edge.to);
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const markerEnd = edge.directed ? `url(#${markerId})` : undefined;

            if (from.id === to.id) {
              const loopPath = `M ${from.x - 17} ${from.y - 20} C ${from.x - 70} ${from.y - 88}, ${from.x + 70} ${from.y - 88}, ${from.x + 17} ${from.y - 20}`;
              return (
                <g key={index}>
                  <path className={styles.graphEdge} d={loopPath} markerEnd={markerEnd} />
                  {edge.label ? <text x={from.x} y={from.y - 78} className={styles.edgeLabel}>{edge.label}</text> : null}
                </g>
              );
            }

            return (
              <g key={index}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} markerEnd={markerEnd} />
                {edge.label ? <text x={midX} y={midY - 9} className={styles.edgeLabel}>{edge.label}</text> : null}
              </g>
            );
          })}
          {block.nodes.map((node) => (
            <g key={node.id} className={node.accent ? styles.graphNodeAccent : undefined}>
              <circle cx={node.x} cy={node.y} r="27" />
              <text x={node.x} y={node.y} dy=".35em">{node.label}</text>
            </g>
          ))}
        </svg>
        {block.caption ? <figcaption>{block.caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <div className={[styles.noteBlock, styles[`note_${block.tone || "info"}`]].filter(Boolean).join(" ")}>
      {block.text}
    </div>
  );
}

function parseLegacyAugmentedMatrix(expression?: string): BlackboardMatrix | null {
  if (!expression) return null;
  const groups = Array.from(expression.matchAll(/\[([^\]]+)\]/g));
  if (groups.length < 2) return null;

  let separatorBeforeColumn: number | undefined;
  const rows: Array<Array<string | number>> = [];

  for (const group of groups) {
    const tokens = group[1].trim().split(/\s+/).filter(Boolean);
    const dividerIndex = tokens.indexOf("|");
    if (dividerIndex < 1 || dividerIndex >= tokens.length - 1) return null;

    if (separatorBeforeColumn === undefined) separatorBeforeColumn = dividerIndex;
    if (separatorBeforeColumn !== dividerIndex) return null;

    rows.push(tokens.filter((token) => token !== "|"));
  }

  const labelPrefix = expression.slice(0, groups[0].index ?? 0).trim();

  return {
    rows,
    separatorBeforeColumn,
    label: labelPrefix || "Augmented matrix",
  };
}

export default function BlackboardLesson({
  title = "Live mathematics classroom",
  lessonKind = "worked-example",
  problemLabel = "Problem to solve",
  problemStatement = "Solve the system using Gaussian elimination:\n2x + y = 7\n−x + y = 1\nFind the solution vector [x, y]ᵀ.",
  learningGoal = "Convert the equations into an augmented matrix, eliminate one variable, back-substitute, and verify the solution.",
  steps: initialSteps = [],
  editOperations = [],
  boardOptions,
  labels,
  explanationActions = blackboardLessonDefaultExplanationActions,
  theme,
  activeStep: initialActiveStep = 0,
  playing: initialPlaying = false,
  reducedMotion = false,
  captionsEnabled = true,
  showStepPopup = true,
  popupInitiallyOpen = true,
  autoAdvance = true,
  stepDurationMs = 6500,
  speedLabel = "Normal",
  onStepSelect,
  onExplain,
  onNext,
  onPlaybackChange,
  onRepeat,
  className = "",
}: BlackboardLessonProps) {
  const popupTitleId = useId();
  const lesson = applyBlackboardLessonOperations(
    { title, lessonKind, problemLabel, problemStatement, learningGoal, steps: initialSteps },
    editOperations,
  );
  const steps = lesson.steps;
  const resolvedOptions = { ...blackboardLessonDefaultOptions, ...boardOptions };
  const resolvedLabels = { ...blackboardLessonDefaultLabels, ...labels };
  const popupEnabled = showStepPopup && resolvedOptions.showPopup;
  const themeStyle = {
    "--board-background": theme?.background,
    "--board-text": theme?.text,
    "--board-accent": theme?.accent,
    "--board-muted": theme?.muted,
    "--board-border": theme?.border,
    "--board-popup-background": theme?.popupBackground,
    "--board-popup-text": theme?.popupText,
    "--board-danger": theme?.danger,
  } as React.CSSProperties;
  const lastIndex = Math.max(steps.length - 1, 0);
  const clampIndex = (value: number) => Math.min(Math.max(value, 0), lastIndex);
  const [currentStep, setCurrentStep] = useState(() => clampIndex(initialActiveStep));
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const [popupOpen, setPopupOpen] = useState(popupInitiallyOpen);
  const [replayKey, setReplayKey] = useState(0);
  const [explanationMode, setExplanationMode] = useState<"default" | "simple" | "visual" | "check">("default");
  const safeIndex = clampIndex(currentStep);
  const current = steps[safeIndex];
  const currentMatrix = current?.matrix || (current ? parseLegacyAugmentedMatrix(current.expression) : null);
  const visibleSteps = steps.slice(0, safeIndex + 1);

  useEffect(() => {
    setCurrentStep(clampIndex(initialActiveStep));
  }, [initialActiveStep, steps.length]);

  useEffect(() => {
    setIsPlaying(initialPlaying);
  }, [initialPlaying]);

  useEffect(() => {
    setExplanationMode("default");
    if (popupEnabled && current) setPopupOpen(true);
  }, [current?.id, popupEnabled]);

  useEffect(() => {
    if (!autoAdvance || !isPlaying || !current || safeIndex >= lastIndex) return;

    const speedMultiplier = speedLabel === "Slow" ? 1.35 : speedLabel === "Fast" ? 0.7 : 1;
    const delay = Math.max(1200, stepDurationMs * speedMultiplier);
    const nextIndex = safeIndex + 1;

    const timer = window.setTimeout(() => {
      setCurrentStep(nextIndex);
      setPopupOpen(popupEnabled);
      onNext?.({ nextIndex });
      if (nextIndex >= lastIndex) setIsPlaying(false);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [autoAdvance, current?.id, isPlaying, lastIndex, onNext, safeIndex, popupEnabled, speedLabel, stepDurationMs]);

  const selectStep = (step: BlackboardLessonStep, index: number) => {
    setCurrentStep(index);
    setPopupOpen(popupEnabled);
    onStepSelect?.({ stepId: step.id, index });
  };

  const requestExplanation = (action: BlackboardExplanationAction) => {
    if (!current) return;
    setExplanationMode(action.mode);
    onExplain?.({ stepId: current.id, option: action.id });
  };

  const togglePlayback = () => {
    const nextPlaying = !isPlaying;
    if (safeIndex >= lastIndex && nextPlaying) setCurrentStep(0);
    setIsPlaying(nextPlaying);
    setPopupOpen(popupEnabled);
    onPlaybackChange?.({ playing: nextPlaying });
  };

  const repeatCurrentStep = () => {
    if (!current) return;
    setReplayKey((value) => value + 1);
    setPopupOpen(popupEnabled);
    onRepeat?.({ stepId: current.id, index: safeIndex });
  };

  const writeNextStep = () => {
    if (!current || safeIndex >= lastIndex) return;
    const nextIndex = safeIndex + 1;
    setCurrentStep(nextIndex);
    setPopupOpen(popupEnabled);
    onNext?.({ nextIndex });
    if (nextIndex >= lastIndex) setIsPlaying(false);
  };

  return (
    <section
      className={[styles.board, reducedMotion ? styles.reduced : "", className].filter(Boolean).join(" ")}
      aria-label={lesson.title}
      style={themeStyle}
    >
      {resolvedOptions.showHeader ? (
        <header className={styles.header}>
          <div>
            <span className={styles.roomLabel}>{resolvedLabels.boardPrefix} · {lesson.lessonKind.replace("-", " ")}</span>
            <h2>{lesson.title}</h2>
          </div>
          {resolvedOptions.showProgress ? (
            <span className={styles.progress} aria-live="polite">
              Step {steps.length ? safeIndex + 1 : 0} of {steps.length}
            </span>
          ) : null}
        </header>
      ) : null}

      {resolvedOptions.showProblem ? (
        <div className={styles.problemCard} aria-label="Lesson problem">
          <span className={styles.problemLabel}>{lesson.problemLabel}</span>
          <p className={styles.problemStatement}>{lesson.problemStatement}</p>
          {resolvedOptions.showLearningGoal && lesson.learningGoal ? (
            <p className={styles.learningGoal}>
              <strong>{resolvedLabels.goalPrefix}</strong> {lesson.learningGoal}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={styles.lessonArea}>
        <ol className={styles.steps}>
          {visibleSteps.map((step, index) => {
            const active = index === safeIndex;
            const legacyMatrix = step.matrix ? null : parseLegacyAugmentedMatrix(step.expression);
            const displayMatrix = step.matrix || legacyMatrix;
            return (
              <li
                key={active ? `${step.id}-${replayKey}` : step.id}
                className={active ? styles.activeStep : styles.step}
              >
                <div className={styles.stepRow}>
                  <button
                    type="button"
                    className={styles.stepButton}
                    aria-current={active ? "step" : undefined}
                    aria-disabled={!resolvedOptions.allowStepSelection}
                    onClick={() => { if (resolvedOptions.allowStepSelection) selectStep(step, index); }}
                  >
                    {resolvedOptions.showStepNumbers ? <span className={styles.number}>{index + 1}</span> : null}
                    <span className={styles.stepTitle}>{step.title}</span>
                  </button>
                  <div className={styles.stepContent}>
                    {step.content?.length ? (
                      <div className={styles.contentBlocks}>
                        {step.content.map((block, blockIndex) => (
                          <ContentBlockView key={blockIndex} block={block} reducedMotion={reducedMotion} animate={active} />
                        ))}
                      </div>
                    ) : null}
                    {!legacyMatrix && step.expression ? <span className={styles.expression}>{step.expression}</span> : null}
                    {displayMatrix ? <MatrixDisplay matrix={displayMatrix} /> : null}
                    {step.working?.map((line, lineIndex) => (
                      <span
                        key={lineIndex}
                        className={active ? styles.writingLine : styles.workingLine}
                        style={{ animationDelay: reducedMotion ? "0ms" : `${lineIndex * 260}ms` }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>

                {active && resolvedOptions.showTeacherButton ? (
                  <button
                    type="button"
                    className={styles.teacherButton}
                    onClick={() => setPopupOpen(true)}
                  >
                    {resolvedLabels.teacherButton}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ol>

        {steps.length === 0 ? (
          <p className={styles.empty}>{resolvedLabels.empty}</p>
        ) : null}
      </div>

      {captionsEnabled && resolvedOptions.showCaptions && current?.narration ? (
        <div className={styles.captionBar} aria-live="polite">
          <span className={styles.teacherBadge}>{resolvedLabels.teacherBadge}</span>
          <p>{current.narration}</p>
        </div>
      ) : null}

      {resolvedOptions.showControls ? (
        <footer className={styles.controls}>
          {resolvedOptions.showPlaybackControl ? (
            <button type="button" onClick={togglePlayback}>
              {isPlaying ? resolvedLabels.pause : resolvedLabels.play}
            </button>
          ) : null}
          {resolvedOptions.showRepeatControl ? (
            <button type="button" disabled={!current} onClick={repeatCurrentStep}>
              {resolvedLabels.repeat}
            </button>
          ) : null}
          {resolvedOptions.showSpeed ? <span>{resolvedLabels.speedPrefix} {speedLabel}</span> : null}
          {resolvedOptions.showNextControl ? (
            <button
              type="button"
              disabled={!current || safeIndex >= steps.length - 1}
              onClick={writeNextStep}
            >
              {resolvedLabels.next}
            </button>
          ) : null}
        </footer>
      ) : null}

      {popupEnabled && popupOpen && current ? (
        <aside
          className={styles.popup}
          role="dialog"
          aria-modal="false"
          aria-labelledby={popupTitleId}
        >
          <div className={styles.popupHeader}>
            <div>
              <span>{resolvedLabels.popupEyebrow} · step {safeIndex + 1}</span>
              <h3 id={popupTitleId}>{current.title}</h3>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label={resolvedLabels.closePopup}
              onClick={() => setPopupOpen(false)}
            >
              ×
            </button>
          </div>

          {explanationMode === "simple" ? (
            <div className={styles.popupSection} aria-live="polite">
              <strong>{resolvedLabels.simpleTitle}</strong>
              <p>{current.simpleExplanation || current.narration || current.explanation}</p>
            </div>
          ) : explanationMode === "visual" ? (
            <div className={styles.popupSection} aria-live="polite">
              <strong>{resolvedLabels.visualTitle}</strong>
              <p>{current.visualExplanation || resolvedLabels.visualFallback}</p>
              {currentMatrix ? <MatrixDisplay matrix={currentMatrix} compact /> : null}
              {current.working?.length ? (
                <ol className={styles.popupWorking}>
                  {current.working.map((line, index) => <li key={index}>{line}</li>)}
                </ol>
              ) : null}
            </div>
          ) : explanationMode === "check" ? (
            <div className={styles.teacherPrompt} aria-live="polite">
              <strong>{resolvedLabels.teacherPromptTitle}</strong>
              <p>{current.teacherPrompt || resolvedLabels.checkFallback}</p>
            </div>
          ) : (
            <>
              <div className={styles.popupSection}>
                <strong>{resolvedLabels.defaultExplanationTitle}</strong>
                <p>{current.explanation || current.narration || "Work through this transformation carefully."}</p>
              </div>

              {current.why ? (
                <div className={styles.popupSection}>
                  <strong>{resolvedLabels.whyTitle}</strong>
                  <p>{current.why}</p>
                </div>
              ) : null}

              {current.commonMistake ? (
                <div className={styles.warning}>
                  <strong>{resolvedLabels.mistakeTitle}</strong>
                  <p>{current.commonMistake}</p>
                </div>
              ) : null}

              {current.teacherPrompt ? (
                <div className={styles.teacherPrompt}>
                  <strong>{resolvedLabels.teacherPromptTitle}</strong>
                  <p>{current.teacherPrompt}</p>
                </div>
              ) : null}
            </>
          )}

          <div className={styles.popupActions}>
            {explanationActions.map((action) => (
              <button
                key={action.id}
                type="button"
                aria-pressed={explanationMode === action.mode}
                onClick={() => requestExplanation(action)}
              >
                {action.label}
              </button>
            ))}
            {explanationMode !== "default" ? (
              <button type="button" onClick={() => setExplanationMode("default")}>
                {resolvedLabels.backToExplanation}
              </button>
            ) : null}
          </div>
        </aside>
      ) : null}
    </section>
  );
}