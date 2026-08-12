"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

export type RichTextEditorToolbarPreset =
  | "basic"
  | "standard"
  | "full";

export interface RichTextEditorSelection {
  text: string;
  collapsed: boolean;
}

export interface RichTextEditorChange {
  html: string;
  text: string;
}

export interface RichTextEditorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children" | "onChange"
  > {
  /**
   * Controlled HTML.
   */
  value?: string;

  /**
   * Initial uncontrolled HTML.
   */
  defaultValue?: string;

  placeholder?: string;

  /**
   * @select|basic|standard|full
   */
  toolbarPreset?: RichTextEditorToolbarPreset;

  showToolbar?: boolean;

  readOnly?: boolean;

  disabled?: boolean;

  minHeight?: number;

  /**
   * 0 means unlimited height.
   */
  maxHeight?: number;

  /**
   * Allow links.
   */
  enableLinks?: boolean;

  /**
   * Allow image URL insertion.
   */
  enableImages?: boolean;

  /**
   * Root customization.
   *
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"full","label":"Full Width"},
   *       {"key":"fit","label":"Fit Content"},
   *       {"key":"auto","label":"Auto"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"2xl","label":"2XL"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * @type|class
   */
  toolbarClassName?: string;

  /**
   * @type|class
   */
  toolbarButtonClassName?: string;

  /**
   * @type|class
   */
  editorClassName?: string;

  /**
   * Dynamic HTML attributes.
   *
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string
  >;

  /**
   * @type|function
   */
  onChange?: (
    value: RichTextEditorChange
  ) => void;

  /**
   * @type|function
   */
  onSelectionChange?: (
    value: RichTextEditorSelection
  ) => void;

  /**
   * @type|function
   */
  onEditorFocus?: () => void;

  /**
   * @type|function
   */
  onEditorBlur?: () => void;

  /**
   * @type|function
   */
  onCommand?: (
    command: string,
    value?: string
  ) => void;
}

interface ToolbarButtonProps {
  label: React.ReactNode;

  title: string;

  active?: boolean;

  disabled?: boolean;

  className?: string;

  onAction:
  () => void;
}

function ToolbarButton({
  label,
  title,
  active = false,
  disabled = false,
  className = "",
  onAction,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      className={className}
      onMouseDown={(
        event
      ) => {
        /*
         * Critical.
         *
         * Keep browser text selection
         * inside the editor while
         * clicking toolbar buttons.
         */
        event.preventDefault();
      }}
      onClick={(
        event
      ) => {
        event.preventDefault();

        onAction();
      }}
      style={{
        minWidth: 32,
        height: 32,

        padding:
          "0 8px",

        display:
          "inline-flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        border:
          active
            ? "1px solid #2563eb"
            : "1px solid transparent",

        borderRadius: 6,

        background:
          active
            ? "#dbeafe"
            : "transparent",

        color:
          active
            ? "#1d4ed8"
            : "#374151",

        fontSize: 13,

        fontWeight: 600,

        lineHeight: 1,

        cursor:
          disabled
            ? "not-allowed"
            : "pointer",

        opacity:
          disabled
            ? 0.45
            : 1,

        boxSizing:
          "border-box",

        transition:
          "background 120ms ease, color 120ms ease, border-color 120ms ease",
      }}
    >
      {label}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 1,
        height: 22,

        margin:
          "0 3px",

        flexShrink: 0,

        background:
          "#e5e7eb",
      }}
    />
  );
}

function normalizeBlockName(
  value: string
) {
  return value
    .replace(
      /[<>]/g,
      ""
    )
    .toLowerCase();
}

export default function RichTextEditor({
  value,

  defaultValue = "",

  placeholder =
  "Start writing...",

  toolbarPreset =
  "standard",

  showToolbar = true,

  readOnly = false,

  disabled = false,

  minHeight = 180,

  maxHeight = 0,

  enableLinks = true,

  enableImages = true,

  className = "w-full",

  toolbarClassName = "",

  toolbarButtonClassName = "",

  editorClassName = "",

  customAttributes = {},

  onChange,

  onSelectionChange,

  onEditorFocus,

  onEditorBlur,

  onCommand,

  style,

  ...props
}: RichTextEditorProps) {
  const editorRef =
    useRef<HTMLDivElement>(
      null
    );

  /*
   * Browser Selection objects can disappear
   * when toolbar controls receive focus.
   *
   * Clone the Range and retain it.
   */
  const savedRangeRef =
    useRef<Range | null>(
      null
    );

  const suppressChangeRef =
    useRef(false);

  const controlled =
    value !== undefined;

  const [
    internalValue,
    setInternalValue,
  ] = useState(
    controlled
      ? value ?? ""
      : defaultValue
  );

  const [
    focused,
    setFocused,
  ] = useState(false);

  const [
    active,
    setActive,
  ] = useState<
    Record<
      string,
      boolean
    >
  >({});

  const [
    currentBlock,
    setCurrentBlock,
  ] = useState(
    "p"
  );

  const currentHtml =
    controlled
      ? value ?? ""
      : internalValue;

  const editorDisabled =
    disabled ||
    readOnly;

  /*
   * Check whether a browser Selection
   * belongs to this editor.
   */
  const selectionBelongsToEditor =
    (
      selection:
        | Selection
        | null
    ) => {
      const editor =
        editorRef.current;

      if (
        !editor ||
        !selection ||
        selection.rangeCount ===
        0
      ) {
        return false;
      }

      const range =
        selection.getRangeAt(
          0
        );

      const container =
        range.commonAncestorContainer;

      const node =
        container.nodeType ===
          Node.TEXT_NODE
          ? container.parentNode
          : container;

      return !!(
        node &&
        editor.contains(
          node
        )
      );
    };

  /*
   * Save the current selection.
   */
  const saveSelection =
    () => {
      const document =
        editorRef.current
          ?.ownerDocument;

      if (!document) {
        return;
      }

      const selection =
        document.getSelection();

      if (
        !selectionBelongsToEditor(
          selection
        )
      ) {
        return;
      }

      const range =
        selection!.getRangeAt(
          0
        );

      savedRangeRef.current =
        range.cloneRange();

      onSelectionChange?.({
        text:
          selection?.toString() ??
          "",

        collapsed:
          range.collapsed,
      });
    };

  /*
   * Restore the selection before
   * running a formatting command.
   */
  const restoreSelection =
    () => {
      const editor =
        editorRef.current;

      if (!editor) {
        return false;
      }

      const document =
        editor.ownerDocument;

      const selection =
        document.getSelection();

      if (!selection) {
        return false;
      }

      const saved =
        savedRangeRef.current;

      if (saved) {
        try {
          selection.removeAllRanges();

          selection.addRange(
            saved
          );

          return true;
        } catch {
          savedRangeRef.current =
            null;
        }
      }

      /*
       * No saved range.
       *
       * Put caret at the end.
       */
      const range =
        document.createRange();

      range.selectNodeContents(
        editor
      );

      range.collapse(
        false
      );

      selection.removeAllRanges();

      selection.addRange(
        range
      );

      savedRangeRef.current =
        range.cloneRange();

      return true;
    };

  const updateActiveState =
    () => {
      const editor =
        editorRef.current;

      if (!editor) {
        return;
      }

      const document =
        editor.ownerDocument;

      try {
        setActive({
          "bold":
            document.queryCommandState(
              "bold"
            ),

          "italic":
            document.queryCommandState(
              "italic"
            ),

          "underline":
            document.queryCommandState(
              "underline"
            ),

          "strike":
            document.queryCommandState(
              "strikeThrough"
            ),

          "orderedList":
            document.queryCommandState(
              "insertOrderedList"
            ),

          "bulletList":
            document.queryCommandState(
              "insertUnorderedList"
            ),

          "justifyLeft":
            document.queryCommandState(
              "justifyLeft"
            ),

          "justifyCenter":
            document.queryCommandState(
              "justifyCenter"
            ),

          "justifyRight":
            document.queryCommandState(
              "justifyRight"
            ),

          "justifyFull":
            document.queryCommandState(
              "justifyFull"
            ),
        });

        const block =
          String(
            document.queryCommandValue(
              "formatBlock"
            ) || "p"
          );

        setCurrentBlock(
          normalizeBlockName(
            block
          )
        );
      } catch {
        /*
         * Embedded environments may
         * not support every query.
         */
      }
    };

  const emitChange =
    () => {
      if (
        suppressChangeRef.current
      ) {
        return;
      }

      const editor =
        editorRef.current;

      if (!editor) {
        return;
      }

      const html =
        editor.innerHTML;

      const text =
        editor.innerText;

      if (!controlled) {
        setInternalValue(
          html
        );
      }

      onChange?.({
        html,
        text,
      });

      saveSelection();

      updateActiveState();
    };

  /*
   * Central browser editing command.
   */
  const executeCommand =
    (
      command: string,
      commandValue?: string
    ) => {
      if (
        editorDisabled
      ) {
        return;
      }

      const editor =
        editorRef.current;

      if (!editor) {
        return;
      }

      const document =
        editor.ownerDocument;

      restoreSelection();

      try {
        /*
         * Keep CSS-based formatting instead
         * of old <font> tags where supported.
         */
        document.execCommand(
          "styleWithCSS",
          false,
          "true"
        );
      } catch {
        // ignore
      }

      try {
        document.execCommand(
          command,
          false,
          commandValue
        );
      } catch {
        return;
      }

      /*
       * Save resulting selection again.
       */
      saveSelection();

      updateActiveState();

      emitChange();

      onCommand?.(
        command,
        commandValue
      );

      editor.focus();
    };

  const formatBlock =
    (
      block: string
    ) => {
      if (
        block === "p"
      ) {
        executeCommand(
          "formatBlock",
          "p"
        );

        return;
      }

      executeCommand(
        "formatBlock",
        block
      );
    };

  const addLink =
    () => {
      if (
        editorDisabled ||
        !enableLinks
      ) {
        return;
      }

      restoreSelection();

      const editor =
        editorRef.current;

      if (!editor) {
        return;
      }

      const document =
        editor.ownerDocument;

      const selection =
        document.getSelection();

      const selectedText =
        selection?.toString() ??
        "";

      const url =
        window.prompt(
          "Enter URL"
        );

      if (!url) {
        return;
      }

      /*
       * Existing selected text.
       */
      if (
        selectedText
      ) {
        executeCommand(
          "createLink",
          url
        );

        return;
      }

      /*
       * Collapsed caret.
       *
       * Ask for text and insert an anchor
       * using the native Range API.
       */
      const text =
        window.prompt(
          "Enter link text",
          url
        );

      if (!text) {
        return;
      }

      const currentSelection =
        document.getSelection();

      if (
        !currentSelection ||
        currentSelection.rangeCount ===
        0
      ) {
        return;
      }

      const range =
        currentSelection.getRangeAt(
          0
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href =
        url;

      anchor.textContent =
        text;

      anchor.target =
        "_blank";

      anchor.rel =
        "noopener noreferrer";

      range.deleteContents();

      range.insertNode(
        anchor
      );

      range.setStartAfter(
        anchor
      );

      range.collapse(
        true
      );

      currentSelection.removeAllRanges();

      currentSelection.addRange(
        range
      );

      saveSelection();

      emitChange();

      onCommand?.(
        "createLink",
        url
      );
    };

  const insertImage =
    () => {
      if (
        editorDisabled ||
        !enableImages
      ) {
        return;
      }

      const url =
        window.prompt(
          "Enter image URL"
        );

      if (!url) {
        return;
      }

      executeCommand(
        "insertImage",
        url
      );
    };

  /*
   * Controlled value synchronization.
   *
   * Do not rewrite innerHTML if the
   * editor already contains that HTML.
   *
   * Otherwise selection would jump.
   */
  useEffect(() => {
    const editor =
      editorRef.current;

    if (
      !editor ||
      !controlled
    ) {
      return;
    }

    const next =
      value ?? "";

    if (
      editor.innerHTML ===
      next
    ) {
      return;
    }

    suppressChangeRef.current =
      true;

    editor.innerHTML =
      next;

    suppressChangeRef.current =
      false;
  }, [
    controlled,
    value,
  ]);

  /*
   * Initial uncontrolled content.
   */
  useEffect(() => {
    const editor =
      editorRef.current;

    if (!editor) {
      return;
    }

    if (
      !controlled &&
      editor.innerHTML ===
      ""
    ) {
      editor.innerHTML =
        defaultValue;
    }
  }, []);

  /*
   * Track native browser selection
   * changes.
   */
  useEffect(() => {
    const editor =
      editorRef.current;

    if (!editor) {
      return;
    }

    const document =
      editor.ownerDocument;

    const handleSelectionChange =
      () => {
        const selection =
          document.getSelection();

        if (
          !selectionBelongsToEditor(
            selection
          )
        ) {
          return;
        }

        saveSelection();

        updateActiveState();
      };

    document.addEventListener(
      "selectionchange",
      handleSelectionChange
    );

    return () => {
      document.removeEventListener(
        "selectionchange",
        handleSelectionChange
      );
    };
  }, []);

  const showBasic =
    toolbarPreset ===
    "basic";

  const showStandard =
    toolbarPreset ===
    "standard" ||
    toolbarPreset ===
    "full";

  const showFull =
    toolbarPreset ===
    "full";

  const isEmpty =
    !currentHtml ||
    currentHtml ===
    "<br>" ||
    currentHtml ===
    "<div><br></div>" ||
    currentHtml ===
    "<p><br></p>";

  return (
    <div
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        position:
          "relative",

        width:
          "100%",

        overflow:
          "visible",

        border:
          focused
            ? "1px solid #2563eb"
            : "1px solid #d1d5db",

        borderRadius:
          10,

        background:
          disabled
            ? "#f9fafb"
            : "#ffffff",

        boxSizing:
          "border-box",

        boxShadow:
          focused
            ? "0 0 0 3px rgba(37,99,235,0.10)"
            : "none",

        transition:
          "border-color 120ms ease, box-shadow 120ms ease",

        ...style,
      }}
    >
      {showToolbar &&
        !readOnly && (
          <div
            className={
              toolbarClassName
            }
            style={{
              display:
                "flex",

              alignItems:
                "center",

              flexWrap:
                "wrap",

              gap: 3,

              width:
                "100%",

              minHeight:
                46,

              padding:
                "6px 8px",

              borderBottom:
                "1px solid #e5e7eb",

              background:
                "#f9fafb",

              borderRadius:
                "10px 10px 0 0",

              boxSizing:
                "border-box",
            }}
          >
            {/*
             * Undo / Redo
             */}
            {!showBasic && (
              <>
                <ToolbarButton
                  title="Undo"
                  label="↶"
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "undo"
                    )
                  }
                />

                <ToolbarButton
                  title="Redo"
                  label="↷"
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "redo"
                    )
                  }
                />

                <ToolbarDivider />
              </>
            )}

            {/*
             * Heading.
             */}
            {showStandard && (
              <>
                <select
                  title="Heading"
                  aria-label="Heading"
                  disabled={
                    editorDisabled
                  }
                  value={
                    [
                      "p",
                      "h1",
                      "h2",
                      "h3",
                      "h4",
                    ].includes(
                      currentBlock
                    )
                      ? currentBlock
                      : "p"
                  }
                  onMouseDown={() => {
                    saveSelection();
                  }}
                  onChange={(
                    event
                  ) => {
                    formatBlock(
                      event.target
                        .value
                    );
                  }}
                  style={{
                    height:
                      32,

                    padding:
                      "0 8px",

                    border:
                      "1px solid #d1d5db",

                    borderRadius:
                      6,

                    background:
                      "#ffffff",

                    color:
                      "#374151",

                    fontSize:
                      12,

                    outline:
                      "none",

                    cursor:
                      editorDisabled
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  <option value="p">
                    Normal
                  </option>

                  <option value="h1">
                    Heading 1
                  </option>

                  <option value="h2">
                    Heading 2
                  </option>

                  <option value="h3">
                    Heading 3
                  </option>

                  <option value="h4">
                    Heading 4
                  </option>
                </select>

                <ToolbarDivider />
              </>
            )}

            {/*
             * Basic formatting.
             */}
            <ToolbarButton
              title="Bold"
              label={
                <strong>
                  B
                </strong>
              }
              active={
                active.bold
              }
              disabled={
                editorDisabled
              }
              className={
                toolbarButtonClassName
              }
              onAction={() =>
                executeCommand(
                  "bold"
                )
              }
            />

            <ToolbarButton
              title="Italic"
              label={
                <em>
                  I
                </em>
              }
              active={
                active.italic
              }
              disabled={
                editorDisabled
              }
              className={
                toolbarButtonClassName
              }
              onAction={() =>
                executeCommand(
                  "italic"
                )
              }
            />

            <ToolbarButton
              title="Underline"
              label={
                <u>
                  U
                </u>
              }
              active={
                active.underline
              }
              disabled={
                editorDisabled
              }
              className={
                toolbarButtonClassName
              }
              onAction={() =>
                executeCommand(
                  "underline"
                )
              }
            />

            {showStandard && (
              <ToolbarButton
                title="Strikethrough"
                label={
                  <span
                    style={{
                      textDecoration:
                        "line-through",
                    }}
                  >
                    S
                  </span>
                }
                active={
                  active.strike
                }
                disabled={
                  editorDisabled
                }
                className={
                  toolbarButtonClassName
                }
                onAction={() =>
                  executeCommand(
                    "strikeThrough"
                  )
                }
              />
            )}

            {showStandard && (
              <>
                <ToolbarDivider />

                {/*
                 * Lists.
                 */}
                <ToolbarButton
                  title="Bullet List"
                  label="• List"
                  active={
                    active.bulletList
                  }
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "insertUnorderedList"
                    )
                  }
                />

                <ToolbarButton
                  title="Numbered List"
                  label="1. List"
                  active={
                    active.orderedList
                  }
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "insertOrderedList"
                    )
                  }
                />

                <ToolbarDivider />

                <ToolbarButton
                  title="Blockquote"
                  label="❝"
                  active={
                    currentBlock ===
                    "blockquote"
                  }
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    formatBlock(
                      currentBlock ===
                        "blockquote"
                        ? "p"
                        : "blockquote"
                    )
                  }
                />

                <ToolbarButton
                  title="Code Block"
                  label="</>"
                  active={
                    currentBlock ===
                    "pre"
                  }
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    formatBlock(
                      currentBlock ===
                        "pre"
                        ? "p"
                        : "pre"
                    )
                  }
                />
              </>
            )}

            {showFull && (
              <>
                <ToolbarDivider />

                {/*
                 * Alignment.
                 */}
                <ToolbarButton
                  title="Align Left"
                  label="⇤"
                  active={
                    active.justifyLeft
                  }
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "justifyLeft"
                    )
                  }
                />

                <ToolbarButton
                  title="Align Center"
                  label="≡"
                  active={
                    active.justifyCenter
                  }
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "justifyCenter"
                    )
                  }
                />

                <ToolbarButton
                  title="Align Right"
                  label="⇥"
                  active={
                    active.justifyRight
                  }
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "justifyRight"
                    )
                  }
                />

                <ToolbarButton
                  title="Justify"
                  label="☰"
                  active={
                    active.justifyFull
                  }
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "justifyFull"
                    )
                  }
                />

                <ToolbarDivider />

                <ToolbarButton
                  title="Decrease Indent"
                  label="←"
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "outdent"
                    )
                  }
                />

                <ToolbarButton
                  title="Increase Indent"
                  label="→"
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "indent"
                    )
                  }
                />

                <ToolbarDivider />

                {/*
                 * Text color.
                 */}
                <label
                  title="Text Color"
                  style={{
                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    gap: 4,

                    height:
                      32,

                    padding:
                      "0 6px",

                    border:
                      "1px solid #d1d5db",

                    borderRadius:
                      6,

                    background:
                      "#ffffff",

                    fontSize:
                      11,

                    color:
                      "#4b5563",

                    cursor:
                      "pointer",
                  }}
                >
                  A

                  <input
                    type="color"
                    defaultValue="#111827"
                    disabled={
                      editorDisabled
                    }
                    onMouseDown={() => {
                      saveSelection();
                    }}
                    onChange={(
                      event
                    ) => {
                      executeCommand(
                        "foreColor",
                        event.target
                          .value
                      );
                    }}
                    style={{
                      width:
                        20,

                      height:
                        20,

                      padding:
                        0,

                      border:
                        0,

                      background:
                        "transparent",

                      cursor:
                        "pointer",
                    }}
                  />
                </label>

                <label
                  title="Highlight Color"
                  style={{
                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    gap: 4,

                    height:
                      32,

                    padding:
                      "0 6px",

                    border:
                      "1px solid #d1d5db",

                    borderRadius:
                      6,

                    background:
                      "#ffffff",

                    fontSize:
                      11,

                    color:
                      "#4b5563",

                    cursor:
                      "pointer",
                  }}
                >
                  Highlight

                  <input
                    type="color"
                    defaultValue="#fef08a"
                    disabled={
                      editorDisabled
                    }
                    onMouseDown={() => {
                      saveSelection();
                    }}
                    onChange={(
                      event
                    ) => {
                      executeCommand(
                        "backColor",
                        event.target
                          .value
                      );
                    }}
                    style={{
                      width:
                        20,

                      height:
                        20,

                      padding:
                        0,

                      border:
                        0,

                      background:
                        "transparent",

                      cursor:
                        "pointer",
                    }}
                  />
                </label>
              </>
            )}

            {enableLinks && (
              <>
                <ToolbarDivider />

                <ToolbarButton
                  title="Insert Link"
                  label="Link"
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={
                    addLink
                  }
                />

                <ToolbarButton
                  title="Remove Link"
                  label="Unlink"
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={() =>
                    executeCommand(
                      "unlink"
                    )
                  }
                />
              </>
            )}

            {showFull &&
              enableImages && (
                <ToolbarButton
                  title="Insert Image"
                  label="Image"
                  disabled={
                    editorDisabled
                  }
                  className={
                    toolbarButtonClassName
                  }
                  onAction={
                    insertImage
                  }
                />
              )}

            <ToolbarDivider />

            <ToolbarButton
              title="Clear Formatting"
              label="Clear"
              disabled={
                editorDisabled
              }
              className={
                toolbarButtonClassName
              }
              onAction={() => {
                executeCommand(
                  "removeFormat"
                );
              }}
            />
          </div>
        )}

      <div
        style={{
          position:
            "relative",

          width:
            "100%",
        }}
      >
        {isEmpty &&
          !focused && (
            <div
              style={{
                position:
                  "absolute",

                top: 14,

                left: 16,

                color:
                  "#9ca3af",

                fontSize:
                  14,

                lineHeight:
                  1.6,

                pointerEvents:
                  "none",

                userSelect:
                  "none",

                zIndex: 1,
              }}
            >
              {placeholder}
            </div>
          )}

        <div
          ref={
            editorRef
          }
          className={
            editorClassName
          }
          contentEditable={
            !editorDisabled
          }
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-readonly={
            readOnly
          }
          aria-disabled={
            disabled
          }
          tabIndex={
            disabled
              ? -1
              : 0
          }
          onInput={
            emitChange
          }
          onFocus={() => {
            setFocused(
              true
            );

            saveSelection();

            updateActiveState();

            onEditorFocus?.();
          }}
          onBlur={() => {
            setFocused(
              false
            );

            /*
             * Save the Range before
             * focus fully disappears.
             */
            saveSelection();

            onEditorBlur?.();
          }}
          onMouseUp={() => {
            saveSelection();

            updateActiveState();
          }}
          onKeyUp={() => {
            saveSelection();

            updateActiveState();
          }}
          onKeyDown={() => {
            /*
             * Selection will be saved
             * again after the key event.
             */
          }}
          style={{
            position:
              "relative",

            width:
              "100%",

            minHeight,

            maxHeight:
              maxHeight > 0
                ? maxHeight
                : undefined,

            overflowY:
              maxHeight > 0
                ? "auto"
                : "visible",

            padding:
              "14px 16px",

            outline:
              "none",

            color:
              disabled
                ? "#9ca3af"
                : "#111827",

            background:
              disabled
                ? "#f9fafb"
                : "#ffffff",

            fontSize:
              14,

            lineHeight:
              1.7,

            wordBreak:
              "break-word",

            overflowWrap:
              "anywhere",

            whiteSpace:
              "pre-wrap",

            cursor:
              disabled
                ? "not-allowed"
                : readOnly
                  ? "default"
                  : "text",

            boxSizing:
              "border-box",

            borderRadius:
              showToolbar
                ? "0 0 10px 10px"
                : 10,
          }}
        />
      </div>
    </div>
  );
}