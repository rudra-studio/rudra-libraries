import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type RichTextEditorThemeMode = "light" | "dark";
export type RichTextEditorToolbarPreset = "basic" | "standard" | "full";

export interface RichTextEditorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "className"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: RichTextEditorThemeMode;

  /**
   * Initial HTML content (used when uncontrolled).
   */
  defaultValue?: string;

  /**
   * Controlled HTML content.
   */
  value?: string;

  /**
   * Placeholder shown when editor is empty.
   *
   * @translate
   */
  placeholder?: string;

  /**
   * Toolbar action preset.
   *
   * @select|basic|standard|full
   */
  toolbarPreset?: RichTextEditorToolbarPreset;

  /**
   * Show or hide the formatting toolbar.
   *
   * @schema {"type":"boolean"}
   */
  showToolbar?: boolean;

  /**
   * Make editor content read-only.
   *
   * @schema {"type":"boolean"}
   */
  readOnly?: boolean;

  /**
   * Disable editor interaction.
   *
   * @schema {"type":"boolean"}
   */
  disabled?: boolean;

  /**
   * Minimum editable area height in pixels.
   */
  minHeight?: number;

  /**
   * Maximum editable area height in pixels.
   */
  maxHeight?: number;

  /**
   * Emits HTML content whenever changed.
   */
  onChange?: (html: string) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_RICH_HTML =
  "<p>Start writing rich formatted notes, docs, or descriptions here.</p>";

export default function RichTextEditor({
  themeMode = "light",
  defaultValue = DEFAULT_RICH_HTML,
  value,
  placeholder = "Write something...",
  toolbarPreset = "standard",
  showToolbar = true,
  readOnly = false,
  disabled = false,
  minHeight = 160,
  maxHeight = 360,
  onChange,
  className = "",
  ...props
}: RichTextEditorProps) {
  const isControlled = value !== undefined;
  const [internalHtml, setInternalHtml] = useState<string>(defaultValue);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const currentHtml = isControlled ? value : internalHtml;

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const isLocked = readOnly || disabled;

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== currentHtml) {
      editorRef.current.innerHTML = currentHtml;
    }
  }, [currentHtml]);

  const emitInput = () => {
    const html = editorRef.current?.innerHTML ?? "";
    if (!isControlled) {
      setInternalHtml(html);
    }
    onChange?.(html);
  };

  const execFormat = (command: string, arg?: string) => {
    if (isLocked) return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emitInput();
  };

  const handleInsertLink = () => {
    if (isLocked) return;
    const url = window.prompt("Enter URL", "https://");
    if (url) {
      execFormat("createLink", url);
    }
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      data-placeholder={placeholder}
      className={[
        styles.root,
        modeClass,
        disabled ? styles.disabled : "",
        "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showToolbar && (
        <div role="toolbar" aria-label="Formatting options" className={styles.toolbar}>
          <button
            type="button"
            disabled={isLocked}
            onClick={() => execFormat("bold")}
            className={styles.toolBtn}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            disabled={isLocked}
            onClick={() => execFormat("italic")}
            className={`${styles.toolBtn} italic`}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            disabled={isLocked}
            onClick={() => execFormat("underline")}
            className={`${styles.toolBtn} underline`}
            title="Underline"
          >
            U
          </button>

          {(toolbarPreset === "standard" || toolbarPreset === "full") && (
            <>
              <span className={styles.divider} />
              <button
                type="button"
                disabled={isLocked}
                onClick={() => execFormat("insertUnorderedList")}
                className={styles.toolBtn}
                title="Bullet list"
              >
                • List
              </button>
              <button
                type="button"
                disabled={isLocked}
                onClick={() => execFormat("insertOrderedList")}
                className={styles.toolBtn}
                title="Numbered list"
              >
                1. List
              </button>
            </>
          )}

          {toolbarPreset === "full" && (
            <>
              <span className={styles.divider} />
              <button
                type="button"
                disabled={isLocked}
                onClick={() => execFormat("formatBlock", "BLOCKQUOTE")}
                className={styles.toolBtn}
                title="Quote"
              >
                “Quote”
              </button>
              <button
                type="button"
                disabled={isLocked}
                onClick={handleInsertLink}
                className={styles.toolBtn}
                title="Insert link"
              >
                Link
              </button>
            </>
          )}
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable={!isLocked}
        role="textbox"
        aria-multiline="true"
        aria-readonly={readOnly}
        aria-disabled={disabled}
        onInput={emitInput}
        style={{
          minHeight: `${Math.max(100, minHeight)}px`,
          maxHeight: `${Math.max(140, maxHeight)}px`,
        }}
        className={styles.content}
      />
    </div>
  );
}
