import React from "react";
import TextareaCodeEditor from "@uiw/react-textarea-code-editor";

export interface CodeEditorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;

  /**
   * @select|js|ts|html|css|json|go
   */
  language?:
    | "js"
    | "ts"
    | "html"
    | "css"
    | "json"
    | "go";

  /**
   * @select|dark|light
   */
  theme?:
    | "dark"
    | "light";

  readOnly?: boolean;

  height?: string;

  title?: string;

  onChange?: (
    value: string
  ) => void;
}

export default function CodeEditor({
  value =
    '// Write some code here...\nconsole.log("Hello, Rudra!");',

  language = "js",

  theme = "light",

  readOnly = false,

  height = "400px",

  title = "index.ts",

  className = "",

  onChange,

  style,

  ...props
}: CodeEditorProps) {
  const isDark =
    theme === "dark";

  return (
    <div
      className={`flex flex-col w-full rounded-lg overflow-hidden border ${
        isDark
          ? "border-zinc-800 bg-[#161b22]"
          : "border-zinc-200 bg-white"
      } ${className}`}
      style={{
        height,
        ...style,
      }}
      {...props}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b ${
          isDark
            ? "border-zinc-800 bg-zinc-900"
            : "border-zinc-200 bg-zinc-50"
        }`}
      >
        <div
          className={`text-xs font-mono font-medium ${
            isDark
              ? "text-zinc-300"
              : "text-zinc-600"
          }`}
        >
          {title}
        </div>

        <div
          className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded ${
            isDark
              ? "bg-zinc-800 text-zinc-400"
              : "bg-zinc-200 text-zinc-600"
          }`}
        >
          {language}
        </div>
      </div>

      {/* Editor */}
      <div
        className="flex-1 overflow-auto relative w-full"
        data-color-mode={
          theme
        }
      >
        <TextareaCodeEditor
          value={
            value
          }
          language={
            language
          }
          placeholder="Please enter code."
          readOnly={
            readOnly
          }
          onChange={(
            event
          ) => {
            if (
              readOnly
            ) {
              return;
            }

            onChange?.(
              event.target
                .value
            );
          }}
          padding={
            16
          }
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace",

            fontSize:
              14,

            lineHeight:
              1.6,

            backgroundColor:
              "transparent",

            minHeight:
              "100%",

            width:
              "100%",

            boxSizing:
              "border-box",
          }}
        />
      </div>
    </div>
  );
}