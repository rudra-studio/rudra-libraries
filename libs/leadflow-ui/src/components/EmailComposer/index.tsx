import React from 'react';
import {
  Mail,
  Paperclip,
  Send,
  X,
} from 'lucide-react';

export interface EmailComposerPayload {
  to: string;
  subject: string;
  body: string;
}

export interface EmailComposerProps {
  /**
   * Recipient email address.
   */
  to?: string;

  /**
   * Email subject.
   */
  subject?: string;

  /**
   * Email body.
   *
   * @textarea
   */
  body?: string;

  /**
   * Optional heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Optional supporting text.
   *
   * @translate
   */
  description?: string;

  /**
   * Recipient field label.
   *
   * @translate
   */
  toLabel?: string;

  /**
   * Subject field label.
   *
   * @translate
   */
  subjectLabel?: string;

  /**
   * Message field label.
   *
   * @translate
   */
  bodyLabel?: string;

  /**
   * Subject placeholder.
   *
   * @translate
   */
  subjectPlaceholder?: string;

  /**
   * Body placeholder.
   *
   * @translate
   */
  bodyPlaceholder?: string;

  /**
   * Send button label.
   *
   * @translate
   */
  sendLabel?: string;

  /**
   * Whether the recipient can be edited.
   */
  editableTo?: boolean;

  /**
   * Whether the header is displayed.
   */
  showHeader?: boolean;

  /**
   * Whether the attachment action is displayed.
   *
   * This only emits an action. File handling
   * remains outside this component.
   */
  showAttachmentAction?: boolean;

  /**
   * Whether the cancel action is displayed.
   */
  showCancelAction?: boolean;

  /**
   * Whether the composer is disabled.
   */
  disabled?: boolean;

  /**
   * Whether a send operation is in progress.
   */
  sending?: boolean;

  /**
   * Accessible label.
   */
  ariaLabel?: string;

  /**
   * Emits recipient changes.
   */
  onToChange?: (value: string) => void;

  /**
   * Emits subject changes.
   */
  onSubjectChange?: (value: string) => void;

  /**
   * Emits body changes.
   */
  onBodyChange?: (value: string) => void;

  /**
   * Emits the complete email payload.
   */
  onSend?: (
    payload: EmailComposerPayload,
  ) => void;

  /**
   * Requests the application's attachment flow.
   */
  onAttachmentClick?: () => void;

  /**
   * Requests composer cancellation/closure.
   */
  onCancel?: () => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const EmailComposer: React.FC<
  EmailComposerProps
> = ({
  to = '',
  subject = '',
  body = '',
  title = 'Send email',
  description = '',
  toLabel = 'To',
  subjectLabel = 'Subject',
  bodyLabel = 'Message',
  subjectPlaceholder = 'Enter subject...',
  bodyPlaceholder = 'Write your message...',
  sendLabel = 'Send email',
  editableTo = false,
  showHeader = true,
  showAttachmentAction = false,
  showCancelAction = true,
  disabled = false,
  sending = false,
  ariaLabel = 'Email composer',
  onToChange,
  onSubjectChange,
  onBodyChange,
  onSend,
  onAttachmentClick,
  onCancel,
  className = '',
}) => {
  const isDisabled =
    disabled || sending;

  const canSend =
    Boolean(to.trim()) &&
    Boolean(subject.trim()) &&
    Boolean(body.trim()) &&
    !isDisabled;

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canSend) {
      return;
    }

    onSend?.({
      to: to.trim(),
      subject: subject.trim(),
      body,
    });
  };

  return (
    <form
      aria-label={ariaLabel}
      onSubmit={handleSubmit}
      className={`
        min-w-0

        overflow-hidden

        rounded-2xl

        border
        border-slate-200

        bg-white

        shadow-sm
        shadow-slate-950/[0.025]

        dark:border-slate-800
        dark:bg-slate-950
        dark:shadow-black/10

        ${className}
      `}
    >
      {/* Header */}
      {showHeader && (
        <div
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-3

            border-b
            border-slate-200

            px-4
            py-3.5

            dark:border-slate-800

            sm:px-5
          "
        >
          <div className="min-w-0">
            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-indigo-50

                  text-indigo-600

                  dark:bg-indigo-500/10
                  dark:text-indigo-300
                "
              >
                <Mail
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <h3
                  className="
                    truncate

                    text-sm
                    font-semibold

                    text-slate-900

                    dark:text-slate-100
                  "
                >
                  {title}
                </h3>

                {description && (
                  <p
                    className="
                      mt-0.5
                      truncate

                      text-[11px]

                      text-slate-400

                      dark:text-slate-500
                    "
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {showCancelAction && (
            <button
              type="button"
              disabled={isDisabled}
              aria-label="Close email composer"
              onClick={onCancel}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-lg

                text-slate-400

                transition-colors

                hover:bg-slate-100
                hover:text-slate-700

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:text-slate-500
                dark:hover:bg-slate-900
                dark:hover:text-slate-200
              "
            >
              <X
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      )}

      {/* Fields */}
      <div
        className="
          divide-y
          divide-slate-100

          dark:divide-slate-900
        "
      >
        {/* Recipient */}
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3

            px-4
            py-3

            sm:px-5
          "
        >
          <label
            htmlFor="email-composer-to"
            className="
              w-14
              shrink-0

              text-xs
              font-medium

              text-slate-400

              dark:text-slate-500
            "
          >
            {toLabel}
          </label>

          {editableTo ? (
            <input
              id="email-composer-to"
              type="email"
              value={to}
              disabled={isDisabled}
              autoComplete="email"
              onChange={(event) =>
                onToChange?.(
                  event.target.value,
                )
              }
              className="
                min-w-0
                flex-1

                border-0
                bg-transparent

                p-0

                text-sm

                text-slate-800

                outline-none

                placeholder:text-slate-400

                focus:ring-0

                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:text-slate-200
                dark:placeholder:text-slate-600
              "
              placeholder="recipient@example.com"
            />
          ) : (
            <div
              className="
                min-w-0
                flex-1
              "
            >
              <span
                className="
                  inline-flex
                  max-w-full
                  items-center

                  rounded-lg

                  bg-slate-100

                  px-2.5
                  py-1

                  text-xs
                  font-medium

                  text-slate-600

                  dark:bg-slate-900
                  dark:text-slate-300
                "
              >
                <span className="truncate">
                  {to || 'No recipient'}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Subject */}
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3

            px-4
            py-3

            sm:px-5
          "
        >
          <label
            htmlFor="email-composer-subject"
            className="
              w-14
              shrink-0

              text-xs
              font-medium

              text-slate-400

              dark:text-slate-500
            "
          >
            {subjectLabel}
          </label>

          <input
            id="email-composer-subject"
            type="text"
            value={subject}
            disabled={isDisabled}
            placeholder={subjectPlaceholder}
            onChange={(event) =>
              onSubjectChange?.(
                event.target.value,
              )
            }
            className="
              min-w-0
              flex-1

              border-0
              bg-transparent

              p-0

              text-sm
              font-medium

              text-slate-800

              outline-none

              placeholder:font-normal
              placeholder:text-slate-400

              focus:ring-0

              disabled:cursor-not-allowed
              disabled:opacity-60

              dark:text-slate-200
              dark:placeholder:text-slate-600
            "
          />
        </div>
      </div>

      {/* Message */}
      <div
        className="
          border-t
          border-slate-100

          px-4
          py-4

          dark:border-slate-900

          sm:px-5
        "
      >
        <label
          htmlFor="email-composer-body"
          className="
            mb-2
            block

            text-[10px]
            font-semibold
            uppercase
            tracking-[0.07em]

            text-slate-400

            dark:text-slate-500
          "
        >
          {bodyLabel}
        </label>

        <textarea
          id="email-composer-body"
          value={body}
          disabled={isDisabled}
          placeholder={bodyPlaceholder}
          rows={8}
          onChange={(event) =>
            onBodyChange?.(
              event.target.value,
            )
          }
          className="
            block
            min-h-[180px]
            w-full
            resize-y

            border-0

            bg-transparent

            p-0

            text-sm
            leading-6

            text-slate-700

            outline-none

            placeholder:text-slate-400

            focus:ring-0

            disabled:cursor-not-allowed
            disabled:opacity-60

            dark:text-slate-300
            dark:placeholder:text-slate-600
          "
        />
      </div>

      {/* Footer */}
      <div
        className="
          flex
          min-w-0
          flex-wrap
          items-center
          justify-between
          gap-3

          border-t
          border-slate-200

          bg-slate-50/60

          px-4
          py-3

          dark:border-slate-800
          dark:bg-slate-900/30

          sm:px-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-1
          "
        >
          {showAttachmentAction && (
            <button
              type="button"
              disabled={isDisabled}
              aria-label="Add attachment"
              onClick={
                onAttachmentClick
              }
              className="
                inline-flex
                h-9
                items-center
                gap-1.5

                rounded-lg

                px-2.5

                text-xs
                font-medium

                text-slate-500

                transition-colors

                hover:bg-slate-100
                hover:text-slate-800

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:text-slate-400
                dark:hover:bg-slate-800
                dark:hover:text-slate-200
              "
            >
              <Paperclip
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              Attach
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className="
            inline-flex
            h-9
            shrink-0
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-indigo-600

            px-4

            text-xs
            font-semibold

            text-white

            shadow-sm
            shadow-indigo-600/20

            transition-[background-color,transform,box-shadow]

            hover:bg-indigo-700

            active:scale-[0.98]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            focus-visible:ring-offset-2

            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:shadow-none

            dark:bg-indigo-500
            dark:hover:bg-indigo-400
            dark:focus-visible:ring-indigo-400
            dark:focus-visible:ring-offset-slate-950
          "
        >
          {sending ? (
            <>
              <span
                aria-hidden="true"
                className="
                  h-3.5
                  w-3.5

                  animate-spin

                  rounded-full

                  border-2
                  border-white/30
                  border-t-white
                "
              />

              Sending...
            </>
          ) : (
            <>
              <Send
                size={14}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              {sendLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmailComposer;