import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Mic,
  Paperclip,
  Send,
  Sticker,
  X,
} from "lucide-react";

export type MessageComposerSendPayload =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "gif";
      url: string;
      data?: any;
    }
  | {
      type: "sticker";
      url: string;
      data?: any;
    };

export interface MessageComposerPickerContext {
  close: () => void;

  sendGif: (
    url: string,
    data?: any
  ) => void;

  sendSticker: (
    url: string,
    data?: any
  ) => void;
}

export interface MessageComposerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" |
      "children" |
      "onChange"
  > {
  value?: string;

  defaultValue?: string;

  /** @translate */
  placeholder?: string;

  disabled?: boolean;

  maxLength?: number;

  autoFocus?: boolean;

  attachmentAccept?: string;

  multipleAttachments?: boolean;

  showAttachment?: boolean;

  showPicker?: boolean;

  showVoice?: boolean;

  closePickerOnSelect?: boolean;

  /**
   * GIF / Sticker picker.
   *
   * @nodeFunction
   */
  picker?:
    | React.ReactNode
    | ((
        context:
          MessageComposerPickerContext
      ) =>
        React.ReactNode);

  /**
   * Root customization.
   * @type|class
   */
  className?: string;

  /**
   * Composer bar customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"gray-50","label":"Gray 50"},
   *       {"key":"gray-100","label":"Gray 100"},
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
   *       {"key":"2xl","label":"2XL"},
   *       {"key":"full","label":"Full"}
   *     ]
   *   },
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"}
   *     ]
   *   }
   * ]
   */
  composerClassName?: string;

  /**
   * Input customization.
   * @type|class
   */
  inputClassName?: string;

  /**
   * Icon button customization.
   * @type|class
   */
  buttonClassName?: string;

  /**
   * Picker container customization.
   * @type|class
   */
  pickerClassName?: string;

  /** @type|function */
  onChange?: (
    value: string
  ) => void;

  /** @type|function */
  onSend?: (
    payload:
      MessageComposerSendPayload
  ) => void;

  /** @type|function */
  onAttachmentSelect?: (
    files: File[]
  ) => void;

  /** @type|function */
  onVoiceClick?: () => void;

  /** @type|function */
  onPickerOpenChange?: (
    open: boolean
  ) => void;
}

export default function MessageComposer({
  value,

  defaultValue = "",

  placeholder =
    "Type a message...",

  disabled = false,

  maxLength,

  autoFocus = false,

  attachmentAccept =
    "image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt",

  multipleAttachments =
    true,

  showAttachment = true,

  showPicker = true,

  showVoice = true,

  closePickerOnSelect =
    true,

  picker,

  className = "",

  composerClassName = "",

  inputClassName = "",

  buttonClassName = "",

  pickerClassName = "",

  onChange,

  onSend,

  onAttachmentSelect,

  onVoiceClick,

  onPickerOpenChange,

  ...props
}: MessageComposerProps) {
  const controlled =
    value !== undefined;

  const [
    internalValue,
    setInternalValue,
  ] =
    useState(
      defaultValue
    );

  const [
    pickerOpen,
    setPickerOpen,
  ] =
    useState(false);

  const rootRef =
    useRef<HTMLDivElement>(
      null
    );

  const textareaRef =
    useRef<HTMLTextAreaElement>(
      null
    );

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const currentValue =
    controlled
      ? value
      : internalValue;

  const hasText =
    currentValue
      .trim()
      .length > 0;

  const setText = (
    nextValue: string
  ) => {
    if (!controlled) {
      setInternalValue(
        nextValue
      );
    }

    onChange?.(
      nextValue
    );
  };

  const setPicker = (
    open: boolean
  ) => {
    setPickerOpen(
      open
    );

    onPickerOpenChange?.(
      open
    );
  };

  const closePicker =
    () => {
      setPicker(
        false
      );
    };

  const sendText =
    () => {
      const text =
        currentValue.trim();

      if (
        !text ||
        disabled
      ) {
        return;
      }

      onSend?.({
        type: "text",
        text,
      });

      setText("");

      closePicker();

      requestAnimationFrame(
        () => {
          textareaRef.current
            ?.focus();
        }
      );
    };

  const sendGif = (
    url: string,
    data?: any
  ) => {
    if (
      !url ||
      disabled
    ) {
      return;
    }

    onSend?.({
      type: "gif",
      url,
      data,
    });

    if (
      closePickerOnSelect
    ) {
      closePicker();
    }
  };

  const sendSticker = (
    url: string,
    data?: any
  ) => {
    if (
      !url ||
      disabled
    ) {
      return;
    }

    onSend?.({
      type:
        "sticker",
      url,
      data,
    });

    if (
      closePickerOnSelect
    ) {
      closePicker();
    }
  };

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key ===
        "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendText();
    }
  };

  const handleFiles = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      Array.from(
        event.target
          .files || []
      );

    if (
      files.length
    ) {
      onAttachmentSelect?.(
        files
      );
    }

    event.target.value =
      "";
  };

  /*
   * Close picker when clicking
   * outside the composer.
   */
  useEffect(() => {
    if (
      !pickerOpen
    ) {
      return;
    }

    const handlePointerDown =
      (
        event:
          PointerEvent
      ) => {
        const root =
          rootRef.current;

        if (
          !root
        ) {
          return;
        }

        if (
          !root.contains(
            event.target as Node
          )
        ) {
          closePicker();
        }
      };

    const doc =
      rootRef.current
        ?.ownerDocument;

    doc?.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      doc?.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [
    pickerOpen,
  ]);

  /*
   * Escape closes picker.
   */
  useEffect(() => {
    if (
      !pickerOpen
    ) {
      return;
    }

    const handleKeyDown =
      (
        event:
          KeyboardEvent
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          closePicker();
        }
      };

    const doc =
      rootRef.current
        ?.ownerDocument;

    doc?.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      doc?.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    pickerOpen,
  ]);

  const pickerContext:
    MessageComposerPickerContext =
    {
      close:
        closePicker,

      sendGif,

      sendSticker,
    };

  return (
    <div
      {...props}
      ref={
        rootRef
      }
      className={[
        "relative w-full",

        className,
      ]
        .filter(
          Boolean
        )
        .join(" ")}
    >
      {pickerOpen &&
        picker && (
          <div
            className={[
              "absolute bottom-full left-0",

              "z-50",

              "mb-2",

              "w-full",

              "min-w-0",

              pickerClassName,
            ]
              .filter(
                Boolean
              )
              .join(
                " "
              )}
          >
            <div className="relative w-full">
              <button
                type="button"
                aria-label="Close picker"
                onClick={
                  closePicker
                }
                className={[
                  "absolute right-2 top-2",

                  "z-10",

                  "flex size-7",

                  "items-center justify-center",

                  "rounded-full",

                  "bg-black/5",

                  "text-gray-500",

                  "hover:bg-black/10",
                ].join(
                  " "
                )}
              >
                <X
                  size={16}
                />
              </button>

              {typeof picker ===
              "function"
                ? picker(
                    pickerContext
                  )
                : picker}
            </div>
          </div>
        )}

      <div
        className={[
          "flex w-full",

          "items-end",

          "gap-1",

          "rounded-2xl",

          "border border-gray-200",

          "bg-white",

          "p-1.5",

          composerClassName,
        ]
          .filter(
            Boolean
          )
          .join(" ")}
      >
        {showPicker &&
          picker && (
            <button
              type="button"
              disabled={
                disabled
              }
              aria-label="GIFs and stickers"
              aria-expanded={
                pickerOpen
              }
              onClick={() => {
                setPicker(
                  !pickerOpen
                );
              }}
              className={[
                "flex size-9 shrink-0",

                "items-center justify-center",

                "rounded-full",

                "text-gray-500",

                "transition-colors",

                "hover:bg-gray-100",

                "hover:text-gray-900",

                "disabled:pointer-events-none",

                "disabled:opacity-50",

                pickerOpen
                  ? "bg-gray-100 text-blue-600"
                  : "",

                buttonClassName,
              ]
                .filter(
                  Boolean
                )
                .join(
                  " "
                )}
            >
              <Sticker
                size={20}
              />
            </button>
          )}

        {showAttachment && (
          <>
            <input
              ref={
                fileInputRef
              }
              type="file"
              hidden
              accept={
                attachmentAccept
              }
              multiple={
                multipleAttachments
              }
              onChange={
                handleFiles
              }
            />

            <button
              type="button"
              disabled={
                disabled
              }
              aria-label="Attach file"
              onClick={() => {
                fileInputRef.current
                  ?.click();
              }}
              className={[
                "flex size-9 shrink-0",

                "items-center justify-center",

                "rounded-full",

                "text-gray-500",

                "transition-colors",

                "hover:bg-gray-100",

                "hover:text-gray-900",

                "disabled:pointer-events-none",

                "disabled:opacity-50",

                buttonClassName,
              ]
                .filter(
                  Boolean
                )
                .join(
                  " "
                )}
            >
              <Paperclip
                size={20}
              />
            </button>
          </>
        )}

        <textarea
          ref={
            textareaRef
          }
          value={
            currentValue
          }
          placeholder={
            placeholder
          }
          disabled={
            disabled
          }
          maxLength={
            maxLength
          }
          autoFocus={
            autoFocus
          }
          rows={1}
          onChange={(
            event
          ) => {
            setText(
              event.target
                .value
            );
          }}
          onKeyDown={
            handleKeyDown
          }
          className={[
            "min-h-9",

            "max-h-32",

            "min-w-0",

            "flex-1",

            "resize-none",

            "overflow-y-auto",

            "bg-transparent",

            "px-2 py-2",

            "text-sm",

            "outline-none",

            "placeholder:text-gray-400",

            "disabled:cursor-not-allowed",

            "disabled:opacity-50",

            inputClassName,
          ]
            .filter(
              Boolean
            )
            .join(" ")}
        />

        {hasText ? (
          <button
            type="button"
            disabled={
              disabled
            }
            aria-label="Send message"
            onClick={
              sendText
            }
            className={[
              "flex size-9 shrink-0",

              "items-center justify-center",

              "rounded-full",

              "bg-blue-600",

              "text-white",

              "transition-colors",

              "hover:bg-blue-700",

              "disabled:pointer-events-none",

              "disabled:opacity-50",

              buttonClassName,
            ]
              .filter(
                Boolean
              )
              .join(
                " "
              )}
          >
            <Send
              size={18}
            />
          </button>
        ) : (
          showVoice && (
            <button
              type="button"
              disabled={
                disabled
              }
              aria-label="Voice message"
              onClick={
                onVoiceClick
              }
              className={[
                "flex size-9 shrink-0",

                "items-center justify-center",

                "rounded-full",

                "text-gray-500",

                "transition-colors",

                "hover:bg-gray-100",

                "hover:text-gray-900",

                "disabled:pointer-events-none",

                "disabled:opacity-50",

                buttonClassName,
              ]
                .filter(
                  Boolean
                )
                .join(
                  " "
                )}
            >
              <Mic
                size={20}
              />
            </button>
          )
        )}
      </div>
    </div>
  );
}