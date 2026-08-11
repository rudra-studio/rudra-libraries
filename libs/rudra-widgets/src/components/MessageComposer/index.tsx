import React, { useEffect, useRef, useState } from "react";
import {
  ImageIcon,
  Mic,
  Paperclip,
  Send,
  Smile,
  Square,
  Sticker,
  X,
} from "lucide-react";

export type ComposerPickerTab =
  | "emoji"
  | "sticker"
  | "gif";

export type MessagePayload =
  | {
    type: "text";
    text: string;
  }
  | {
    type: "sticker";
    url: string;
    data?: any;
  }
  | {
    type: "gif";
    url: string;
    data?: any;
  }
  | {
    type: "files";
    files: File[];
  }
  | {
    type: "audio";
    blob: Blob;
  };

export interface EmojiPickerContext {
  value: string;
  close: () => void;
  insertEmoji: (emoji: string) => void;
}

export interface StickerPickerContext {
  close: () => void;
  sendSticker: (url: string, data?: any) => void;
}

export interface GifPickerContext {
  close: () => void;
  sendGif: (url: string, data?: any) => void;
}

export interface MessageComposerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className" | "onChange" | "onSubmit"
  > {
  value?: string;
  defaultValue?: string;

  /** @translate */
  placeholder?: string;

  disabled?: boolean;
  autoFocus?: boolean;
  autoResize?: boolean;

  minRows?: number;
  maxRows?: number;

  sendOnEnter?: boolean;

  showPicker?: boolean;
  showEmoji?: boolean;
  showSticker?: boolean;
  showGif?: boolean;
  showAttachment?: boolean;
  showMicrophone?: boolean;

  attachmentAccept?: string;
  multipleAttachments?: boolean;

  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  sendButton?: React.ReactNode;

  /**
   * Custom emoji picker.
   * @nodeFunction
   */
  emojiPicker?:
  | React.ReactNode
  | ((context: EmojiPickerContext) => React.ReactNode);

  /**
   * Custom sticker picker.
   * @nodeFunction
   */
  stickerPicker?:
  | React.ReactNode
  | ((context: StickerPickerContext) => React.ReactNode);

  /**
   * Custom GIF picker.
   * @nodeFunction
   */
  gifPicker?:
  | React.ReactNode
  | ((context: GifPickerContext) => React.ReactNode);

  /**
   * Root customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full Width"}
   *     ]
   *   },
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding",
   *     "prefix":"p",
   *     "type":"select",
   *     "options":[
   *       {"key":"0","label":"None"},
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"gray-900","label":"Gray 900"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Input customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"gray-900","label":"Gray 900"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-700","label":"Gray 700"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"white","label":"White"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   },
   *   {
   *     "key":"Padding X",
   *     "prefix":"px",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding Y",
   *     "prefix":"py",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"}
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
   *       {"key":"2xl","label":"2XL"},
   *       {"key":"full","label":"Full"}
   *     ]
   *   }
   * ]
   */
  inputClassName?: string;

  /**
   * Toolbar icon customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"transparent","label":"Transparent"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-200","label":"Gray 200"},
   *       {"key":"gray-800","label":"Gray 800"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-500","label":"Gray 500"},
   *       {"key":"gray-700","label":"Gray 700"},
   *       {"key":"blue-600","label":"Blue"},
   *       {"key":"white","label":"White"}
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
   *       {"key":"full","label":"Circle"}
   *     ]
   *   }
   * ]
   */
  toolbarButtonClassName?: string;

  /**
   * Picker customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"gray-900","label":"Gray 900"}
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
   *   },
   *   {
   *     "key":"Shadow",
   *     "prefix":"shadow",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  pickerClassName?: string;

  /**
   * Send button customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"blue-600","label":"Blue"},
   *       {"key":"green-600","label":"Green"},
   *       {"key":"gray-800","label":"Gray"},
   *       {"key":"black","label":"Black"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"black","label":"Black"},
   *       {"key":"blue-600","label":"Blue"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"full","label":"Circle"}
   *     ]
   *   }
   * ]
   */
  sendButtonClassName?: string;

  /** @type|function */
  onChange?: (value: string) => void;

  /** @type|function */
  onSubmit?: (message: string) => void;

  /** @type|function */
  onSend?: (payload: MessagePayload) => void;

  /** @type|function */
  onError?: (error: any) => void;
}

const DEFAULT_EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "🥰",
  "😘",
  "😎",
  "🤔",
  "😢",
  "😭",
  "😡",
  "👍",
  "👎",
  "👏",
  "🙏",
  "❤️",
  "🔥",
  "🎉",
  "💯",
  "✅",
];

export default function MessageComposer({
  value,
  defaultValue = "",
  placeholder = "Type a message...",
  disabled = false,
  autoFocus = false,
  autoResize = true,
  minRows = 1,
  maxRows = 6,
  sendOnEnter = true,

  showPicker = true,
  showEmoji = true,
  showSticker = true,
  showGif = true,
  showAttachment = true,
  showMicrophone = true,

  attachmentAccept = "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt",
  multipleAttachments = true,

  startContent,
  endContent,
  sendButton,

  emojiPicker,
  stickerPicker,
  gifPicker,

  className = "",
  inputClassName = "",
  toolbarButtonClassName = "",
  pickerClassName = "",
  sendButtonClassName = "",

  onChange,
  onSubmit,
  onSend,
  onError,
  ...props
}: MessageComposerProps) {
  const controlled = value !== undefined;

  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<ComposerPickerTab>("emoji");

  const [recording, setRecording] =
    useState(false);

  const composerRef =
    useRef<HTMLDivElement>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const mediaStreamRef =
    useRef<MediaStream | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  const message = controlled
    ? value
    : internalValue;

  const availableTabs =
    [
      showEmoji ? "emoji" : null,
      showSticker ? "sticker" : null,
      showGif ? "gif" : null,
    ].filter(Boolean) as ComposerPickerTab[];

  const setMessage = (
    nextValue: string
  ) => {
    if (!controlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  useEffect(() => {
    if (
      !availableTabs.includes(activeTab) &&
      availableTabs.length
    ) {
      setActiveTab(availableTabs[0]);
    }
  }, [
    showEmoji,
    showSticker,
    showGif,
    activeTab,
  ]);

  const updateHeight = () => {
    if (
      !autoResize ||
      !textareaRef.current
    ) {
      return;
    }

    const textarea =
      textareaRef.current;

    textarea.style.height = "auto";

    const styles =
      window.getComputedStyle(textarea);

    const lineHeight =
      parseFloat(styles.lineHeight) || 20;

    const paddingTop =
      parseFloat(styles.paddingTop) || 0;

    const paddingBottom =
      parseFloat(styles.paddingBottom) || 0;

    const minHeight =
      lineHeight * minRows +
      paddingTop +
      paddingBottom;

    const maxHeight =
      lineHeight * maxRows +
      paddingTop +
      paddingBottom;

    const height = Math.min(
      Math.max(
        textarea.scrollHeight,
        minHeight
      ),
      maxHeight
    );

    textarea.style.height =
      `${height}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight
        ? "auto"
        : "hidden";
  };

  useEffect(() => {
    updateHeight();
  }, [
    message,
    autoResize,
    minRows,
    maxRows,
  ]);

  useEffect(() => {
    if (!pickerOpen) return;

    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        composerRef.current &&
        !composerRef.current.contains(
          event.target as Node
        )
      ) {
        setPickerOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setPickerOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [pickerOpen]);

  useEffect(() => {
    return () => {
      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !== "inactive"
      ) {
        recorder.stop();
      }

      mediaStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );
    };
  }, []);

  const togglePicker = () => {
    if (
      disabled ||
      !showPicker ||
      !availableTabs.length
    ) {
      return;
    }

    setPickerOpen((current) => !current);
  };

  const insertEmoji = (
    emoji: string
  ) => {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      setMessage(`${message}${emoji}`);
      return;
    }

    const start =
      textarea.selectionStart ??
      message.length;

    const end =
      textarea.selectionEnd ??
      message.length;

    const nextValue =
      message.slice(0, start) +
      emoji +
      message.slice(end);

    setMessage(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();

      const cursor =
        start + emoji.length;

      textarea.setSelectionRange(
        cursor,
        cursor
      );
    });
  };

  const sendSticker = (
    url: string,
    data?: any
  ) => {
    if (
      disabled ||
      !url
    ) {
      return;
    }

    onSend?.({
      type: "sticker",
      url,
      data,
    });

    setPickerOpen(false);
  };

  const sendGif = (
    url: string,
    data?: any
  ) => {
    if (
      disabled ||
      !url
    ) {
      return;
    }

    onSend?.({
      type: "gif",
      url,
      data,
    });

    setPickerOpen(false);
  };

  const submitText = () => {
    const text =
      message.trim();

    if (
      disabled ||
      !text
    ) {
      return;
    }

    onSubmit?.(text);

    onSend?.({
      type: "text",
      text,
    });

    if (!controlled) {
      setInternalValue("");
    }

    setPickerOpen(false);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(
      event.target.value
    );
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      sendOnEnter &&
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      submitText();
    }
  };

  const openFilePicker = () => {
    if (disabled) return;

    fileInputRef.current?.click();
  };

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      Array.from(
        event.target.files || []
      );

    if (files.length) {
      onSend?.({
        type: "files",
        files,
      });
    }

    event.target.value = "";
  };

  const startRecording =
    async () => {
      if (
        disabled ||
        recording
      ) {
        return;
      }

      try {
        if (
          typeof navigator === "undefined" ||
          !navigator.mediaDevices
            ?.getUserMedia ||
          typeof MediaRecorder ===
          "undefined"
        ) {
          throw new Error(
            "Audio recording is not supported."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            }
          );

        mediaStreamRef.current =
          stream;

        const recorder =
          new MediaRecorder(stream);

        mediaRecorderRef.current =
          recorder;

        audioChunksRef.current = [];

        recorder.ondataavailable = (
          event
        ) => {
          if (event.data.size) {
            audioChunksRef.current.push(
              event.data
            );
          }
        };

        recorder.onstop = () => {
          const blob =
            new Blob(
              audioChunksRef.current,
              {
                type:
                  recorder.mimeType ||
                  "audio/webm",
              }
            );

          if (blob.size) {
            onSend?.({
              type: "audio",
              blob,
            });
          }

          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          mediaStreamRef.current =
            null;

          mediaRecorderRef.current =
            null;

          audioChunksRef.current = [];

          setRecording(false);
        };

        recorder.start();

        setRecording(true);
        setPickerOpen(false);
      } catch (error) {
        onError?.(error);
      }
    };

  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state !== "inactive"
    ) {
      recorder.stop();
    }
  };

  const renderEmojiPicker = () => {
    const context: EmojiPickerContext = {
      value: message,
      close: () =>
        setPickerOpen(false),
      insertEmoji,
    };

    if (
      typeof emojiPicker === "function"
    ) {
      return emojiPicker(context);
    }

    if (emojiPicker) {
      return emojiPicker;
    }

    return (
      <div className="grid grid-cols-8 gap-1 p-3">
        {DEFAULT_EMOJIS.map(
          (emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() =>
                insertEmoji(emoji)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-gray-100"
            >
              {emoji}
            </button>
          )
        )}
      </div>
    );
  };

  const renderStickerPicker = () => {
    const context: StickerPickerContext = {
      close: () =>
        setPickerOpen(false),
      sendSticker,
    };

    if (
      typeof stickerPicker === "function"
    ) {
      return stickerPicker(context);
    }

    if (stickerPicker) {
      return stickerPicker;
    }

    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-2 p-6 text-center">
        <Sticker
          size={30}
          className="text-gray-400"
        />

        <span className="text-sm font-medium text-gray-600">
          Sticker Picker
        </span>

        <span className="text-xs text-gray-400">
          Bind your sticker picker node here.
        </span>
      </div>
    );
  };

  const renderGifPicker = () => {
    const context: GifPickerContext = {
      close: () =>
        setPickerOpen(false),
      sendGif,
    };

    if (
      typeof gifPicker === "function"
    ) {
      return gifPicker(context);
    }

    if (gifPicker) {
      return gifPicker;
    }

    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-2 p-6 text-center">
        <ImageIcon
          size={30}
          className="text-gray-400"
        />

        <span className="text-sm font-medium text-gray-600">
          GIF Picker
        </span>

        <span className="text-xs text-gray-400">
          Bind your GIF search node here.
        </span>
      </div>
    );
  };

  const renderPickerContent = () => {
    if (activeTab === "emoji") {
      return renderEmojiPicker();
    }

    if (activeTab === "sticker") {
      return renderStickerPicker();
    }

    return renderGifPicker();
  };

  const toolbarClassName = [
    "flex h-9 w-9 shrink-0",
    "items-center justify-center",
    "rounded-full",
    "text-gray-500",
    "transition-colors",
    "hover:bg-gray-100",
    "hover:text-gray-800",
    "disabled:cursor-not-allowed",
    "disabled:opacity-40",
    toolbarButtonClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={composerRef}
      {...props}
      className={[
        "relative w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {pickerOpen &&
        availableTabs.length > 0 && (
          <div
            className={[
              "absolute bottom-full left-0 z-50 mb-2",
              "w-full max-w-sm",
              "overflow-hidden",
              "rounded-xl border border-gray-200",
              "bg-white shadow-xl",
              pickerClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="flex items-center border-b border-gray-200">
              <div className="flex min-w-0 flex-1">
                {showEmoji && (
                  <button
                    type="button"
                    aria-pressed={
                      activeTab === "emoji"
                    }
                    onClick={() =>
                      setActiveTab("emoji")
                    }
                    className={[
                      "flex flex-1 items-center justify-center gap-1.5",
                      "border-b-2 px-3 py-3",
                      "text-xs font-medium",
                      activeTab === "emoji"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-800",
                    ].join(" ")}
                  >
                    <Smile size={16} />
                    Emoji
                  </button>
                )}

                {showSticker && (
                  <button
                    type="button"
                    aria-pressed={
                      activeTab === "sticker"
                    }
                    onClick={() =>
                      setActiveTab("sticker")
                    }
                    className={[
                      "flex flex-1 items-center justify-center gap-1.5",
                      "border-b-2 px-3 py-3",
                      "text-xs font-medium",
                      activeTab === "sticker"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-800",
                    ].join(" ")}
                  >
                    <Sticker size={16} />
                    Stickers
                  </button>
                )}

                {showGif && (
                  <button
                    type="button"
                    aria-pressed={
                      activeTab === "gif"
                    }
                    onClick={() =>
                      setActiveTab("gif")
                    }
                    className={[
                      "flex flex-1 items-center justify-center gap-1.5",
                      "border-b-2 px-3 py-3",
                      "text-xs font-medium",
                      activeTab === "gif"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-800",
                    ].join(" ")}
                  >
                    <ImageIcon size={16} />
                    GIF
                  </button>
                )}
              </div>

              <button
                type="button"
                aria-label="Close picker"
                onClick={() =>
                  setPickerOpen(false)
                }
                className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {renderPickerContent()}
            </div>
          </div>
        )}

      <div className="flex w-full items-end gap-1.5">
        {startContent}

        {showPicker &&
          availableTabs.length > 0 && (
            <button
              type="button"
              aria-label="Emoji, stickers and GIFs"
              aria-expanded={pickerOpen}
              disabled={disabled}
              onClick={togglePicker}
              className={[
                toolbarClassName,
                pickerOpen
                  ? "bg-gray-100 text-blue-600"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Smile size={21} />
            </button>
          )}

        {showAttachment && (
          <>
            <button
              type="button"
              aria-label="Attach file"
              disabled={disabled}
              onClick={openFilePicker}
              className={toolbarClassName}
            >
              <Paperclip size={21} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept={attachmentAccept}
              multiple={multipleAttachments}
              onChange={handleFiles}
            />
          </>
        )}

        <textarea
          ref={textareaRef}
          value={message}
          rows={minRows}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={[
            "min-w-0 flex-1 resize-none",
            "rounded-2xl border border-gray-300",
            "bg-white px-4 py-2",
            "text-sm text-gray-900",
            "outline-none",
            "transition-colors",
            "focus:border-blue-500",
            "focus:ring-2",
            "focus:ring-blue-500/20",
            "disabled:cursor-not-allowed",
            "disabled:opacity-50",
            inputClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {endContent}

        {message.trim() ? (
          <button
            type="button"
            aria-label="Send message"
            disabled={disabled}
            onClick={submitText}
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-full",
              "bg-blue-600 text-white",
              "transition-colors",
              "hover:bg-blue-700",
              "disabled:cursor-not-allowed",
              "disabled:opacity-40",
              sendButtonClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {sendButton || (
              <Send
                size={18}
                strokeWidth={2}
              />
            )}
          </button>
        ) : showMicrophone ? (
          <button
            type="button"
            aria-label={
              recording
                ? "Stop recording"
                : "Record voice message"
            }
            disabled={disabled}
            onClick={
              recording
                ? stopRecording
                : startRecording
            }
            className={[
              toolbarClassName,
              recording
                ? "bg-red-50 text-red-600"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {recording ? (
              <Square
                size={17}
                fill="currentColor"
              />
            ) : (
              <Mic size={21} />
            )}
          </button>
        ) : (
          <button
            type="button"
            aria-label="Send message"
            disabled
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-full",
              "bg-blue-600 text-white",
              "opacity-40",
              sendButtonClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {sendButton || (
              <Send size={18} />
            )}
          </button>
        )}
      </div>

      {recording && (
        <div className="mt-2 flex items-center gap-2 px-1 text-xs font-medium text-red-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
          Recording voice message...
        </div>
      )}
    </div>
  );
}