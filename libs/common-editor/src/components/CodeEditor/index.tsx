import React, { useMemo, useState } from "react";
import styles from "./styles.module.scss";

export type CodeEditorLanguage =
  | "javascript"
  | "typescript"
  | "html"
  | "css"
  | "json"
  | "go";

export type CodeEditorThemeMode = "light" | "dark";

export interface CodeEditorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: CodeEditorThemeMode;

  /**
   * Initial code value (used when uncontrolled).
   */
  defaultValue?: string;

  /**
   * Controlled code value.
   */
  value?: string;

  /**
   * Syntax/language badge shown in the header.
   *
   * @select|javascript|typescript|html|css|json|go
   */
  language?: CodeEditorLanguage;

  /**
   * File or editor title in the header bar.
   *
   * @translate
   */
  title?: string;

  /**
   * Make the code surface read-only.
   *
   * @schema {"type":"boolean"}
   */
  readOnly?: boolean;

  /**
   * Editor container height in pixels.
   */
  height?: number;

  /**
   * Show line numbers beside the code editor.
   *
   * @schema {"type":"boolean"}
   */
  showLineNumbers?: boolean;

  /**
   * Emits updated code value on change.
   */
  onChange?: (value: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const LANGUAGE_BADGES: Record<CodeEditorLanguage, string> = {
  javascript: "JS",
  typescript: "TS",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  go: "GO",
};

const DEFAULT_CODE_SAMPLE = `export function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

export default function CodeEditor({
  themeMode = "light",
  defaultValue = DEFAULT_CODE_SAMPLE,
  value,
  language = "typescript",
  title = "snippet.ts",
  readOnly = false,
  height = 240,
  showLineNumbers = true,
  onChange,
  className = "",
  ...props
}: CodeEditorProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const currentCode = isControlled ? value : internalValue;

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const lineCount = useMemo(() => {
    return Math.max(1, currentCode.split("\n").length);
  }, [currentCode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    if (!isControlled) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal);
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.badge}>
          {LANGUAGE_BADGES[language] || language.toUpperCase()}
        </span>
      </div>

      <div className={styles.editorBody} style={{ height: `${Math.max(120, height)}px` }}>
        {showLineNumbers && (
          <div aria-hidden="true" className={styles.gutter}>
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className={styles.lineNumber}>
                {i + 1}
              </span>
            ))}
          </div>
        )}

        <textarea
          value={currentCode}
          readOnly={readOnly}
          aria-label={title || "Code editor"}
          spellCheck={false}
          onChange={handleChange}
          className={styles.textarea}
        />
      </div>
    </div>
  );
}
