import React from 'react';
import {
  CheckCircle2,
  FileText,
  Send,
} from 'lucide-react';

export interface PublicFormProps {
  /**
   * Form field definitions.
   *
   * @type|json
   */
  items?: any[];

  /**
   * Current field values keyed by field ID.
   *
   * @type|json
   */
  values?: Record<string, any>;

  /**
   * Validation errors keyed by field ID.
   *
   * @type|json
   */
  errors?: Record<string, string>;

  /**
   * Form title.
   *
   * @translate
   */
  title?: string;

  /**
   * Supporting description.
   *
   * @translate
   */
  description?: string;

  /**
   * Organization or brand name.
   */
  organizationName?: string;

  /**
   * Organization logo URL.
   */
  logoUrl?: string;

  /**
   * Logo fallback text.
   */
  logoText?: string;

  /**
   * Submit button label.
   *
   * @translate
   */
  submitLabel?: string;

  /**
   * Text displayed while submitting.
   *
   * @translate
   */
  submittingLabel?: string;

  /**
   * Success heading.
   *
   * @translate
   */
  successTitle?: string;

  /**
   * Success supporting text.
   *
   * @translate
   */
  successDescription?: string;

  /**
   * General form-level error.
   *
   * @translate
   */
  errorMessage?: string;

  /**
   * Text displayed when no fields exist.
   *
   * @translate
   */
  emptyText?: string;

  /**
   * Whether branding is displayed.
   */
  showBranding?: boolean;

  /**
   * Whether the form description is displayed.
   */
  showDescription?: boolean;

  /**
   * Whether the form has successfully
   * been submitted.
   */
  submitted?: boolean;

  /**
   * Whether submission is in progress.
   */
  submitting?: boolean;

  /**
   * Whether the complete form is disabled.
   */
  disabled?: boolean;

  /**
   * Form width.
   *
   * @select|compact|default|wide
   */
  width?:
    | 'compact'
    | 'default'
    | 'wide';

  /**
   * Spacing between fields.
   *
   * @select|compact|default|relaxed
   */
  spacing?:
    | 'compact'
    | 'default'
    | 'relaxed';

  /**
   * Renderer for each runtime field.
   *
   * @nodeFunction
   */
  children?: (
    context: {
      item: any;
      index: number;
      value: any;
      error: string;
      disabled: boolean;
      isFirst: boolean;
      isLast: boolean;
      onChange: (
        value: any,
      ) => void;
    },
  ) => React.ReactNode;

  /**
   * Emits one field value change.
   */
  onFieldChange?: (
    fieldId: string,
    value: any,
  ) => void;

  /**
   * Emits the current form values.
   */
  onSubmit?: (
    values: Record<
      string,
      any
    >,
  ) => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const WIDTH_STYLES: Record<
  NonNullable<
    PublicFormProps['width']
  >,
  string
> = {
  compact: 'max-w-md',
  default: 'max-w-xl',
  wide: 'max-w-2xl',
};

const SPACING_STYLES: Record<
  NonNullable<
    PublicFormProps['spacing']
  >,
  string
> = {
  compact: 'space-y-3',
  default: 'space-y-5',
  relaxed: 'space-y-7',
};

const PublicForm: React.FC<
  PublicFormProps
> = ({
  items = [],
  values = {},
  errors = {},
  title = 'Contact us',
  description =
    'Tell us a little about yourself and we’ll get back to you.',
  organizationName = '',
  logoUrl = '',
  logoText = '',
  submitLabel = 'Submit',
  submittingLabel = 'Submitting...',
  successTitle = 'Thank you!',
  successDescription =
    'Your response has been submitted successfully.',
  errorMessage = '',
  emptyText =
    'This form does not have any fields yet.',
  showBranding = true,
  showDescription = true,
  submitted = false,
  submitting = false,
  disabled = false,
  width = 'default',
  spacing = 'default',
  children,
  onFieldChange,
  onSubmit,
  className = '',
}) => {
  const formDisabled =
    disabled || submitting;

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      formDisabled ||
      submitted ||
      items.length === 0
    ) {
      return;
    }

    onSubmit?.(values);
  };

  return (
    <div
      className={`
        min-h-full
        w-full

        bg-slate-50

        px-4
        py-8

        dark:bg-slate-950

        sm:px-6
        sm:py-12

        ${className}
      `}
    >
      <div
        className={`
          mx-auto
          w-full

          ${WIDTH_STYLES[width]}
        `}
      >
        {/* Brand */}
        {showBranding && (
          <div
            className="
              mb-6

              flex
              items-center
              justify-center
              gap-2.5
            "
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="
                  h-9
                  max-w-[140px]
                  object-contain
                "
              />
            ) : logoText ? (
              <span
                className="
                  flex
                  h-9
                  min-w-9
                  items-center
                  justify-center

                  rounded-xl

                  bg-gradient-to-br
                  from-indigo-500
                  to-violet-600

                  px-2.5

                  text-sm
                  font-bold

                  text-white

                  shadow-sm
                  shadow-indigo-500/20
                "
              >
                {logoText}
              </span>
            ) : null}

            {organizationName && (
              <span
                className="
                  text-sm
                  font-semibold

                  text-slate-700

                  dark:text-slate-200
                "
              >
                {organizationName}
              </span>
            )}
          </div>
        )}

        <div
          className="
            overflow-hidden

            rounded-3xl

            border
            border-slate-200

            bg-white

            shadow-xl
            shadow-slate-950/[0.04]

            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/20
          "
        >
          {submitted ? (
            /* Success */
            <div
              role="status"
              className="
                flex
                min-h-[420px]
                items-center
                justify-center

                px-6
                py-12

                text-center
              "
            >
              <div
                className="
                  max-w-sm
                "
              >
                <span
                  className="
                    mx-auto

                    flex
                    h-14
                    w-14
                    items-center
                    justify-center

                    rounded-2xl

                    bg-emerald-50

                    text-emerald-600

                    dark:bg-emerald-500/10
                    dark:text-emerald-300
                  "
                >
                  <CheckCircle2
                    size={26}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>

                <h2
                  className="
                    mt-5

                    text-xl
                    font-semibold
                    tracking-tight

                    text-slate-950

                    dark:text-white
                  "
                >
                  {successTitle}
                </h2>

                {successDescription && (
                  <p
                    className="
                      mt-2

                      text-sm
                      leading-6

                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    {
                      successDescription
                    }
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form
              onSubmit={
                handleSubmit
              }
            >
              {/* Header */}
              <div
                className="
                  border-b
                  border-slate-100

                  px-5
                  pb-6
                  pt-7

                  dark:border-slate-800

                  sm:px-8
                  sm:pb-7
                  sm:pt-8
                "
              >
                <h1
                  className="
                    text-2xl
                    font-semibold
                    tracking-tight

                    text-slate-950

                    dark:text-white

                    sm:text-3xl
                  "
                >
                  {title}
                </h1>

                {showDescription &&
                  description && (
                    <p
                      className="
                        mt-2
                        max-w-lg

                        text-sm
                        leading-6

                        text-slate-500

                        dark:text-slate-400
                      "
                    >
                      {description}
                    </p>
                  )}
              </div>

              {/* Fields */}
              <div
                className="
                  px-5
                  py-6

                  sm:px-8
                  sm:py-8
                "
              >
                {items.length >
                0 ? (
                  <div
                    className={
                      SPACING_STYLES[
                        spacing
                      ]
                    }
                  >
                    {items.map(
                      (
                        item,
                        index,
                      ) => {
                        const fieldId =
                          String(
                            item?.id ??
                              index,
                          );

                        const value =
                          values[
                            fieldId
                          ];

                        const error =
                          errors[
                            fieldId
                          ] ?? '';

                        return (
                          <div
                            key={
                              fieldId
                            }
                            className="
                              min-w-0
                            "
                          >
                            {typeof children ===
                            'function'
                              ? children(
                                  {
                                    item,
                                    index,
                                    value,
                                    error,
                                    disabled:
                                      formDisabled,
                                    isFirst:
                                      index ===
                                      0,
                                    isLast:
                                      index ===
                                      items.length -
                                        1,
                                    onChange:
                                      (
                                        nextValue,
                                      ) =>
                                        onFieldChange?.(
                                          fieldId,
                                          nextValue,
                                        ),
                                  },
                                )
                              : children}
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <div
                    className="
                      flex
                      min-h-[220px]
                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-dashed
                      border-slate-200

                      bg-slate-50/60

                      px-6

                      text-center

                      dark:border-slate-700
                      dark:bg-slate-950/40
                    "
                  >
                    <div>
                      <FileText
                        size={22}
                        strokeWidth={
                          1.7
                        }
                        aria-hidden="true"
                        className="
                          mx-auto

                          text-slate-300

                          dark:text-slate-600
                        "
                      />

                      <p
                        className="
                          mt-3

                          text-sm

                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        {emptyText}
                      </p>
                    </div>
                  </div>
                )}

                {/* Form error */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="
                      mt-5

                      rounded-xl

                      border
                      border-rose-200

                      bg-rose-50

                      px-3.5
                      py-3

                      text-xs
                      leading-5

                      text-rose-700

                      dark:border-rose-500/20
                      dark:bg-rose-500/10
                      dark:text-rose-300
                    "
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Submit */}
                {items.length >
                  0 && (
                  <div
                    className="
                      mt-7

                      border-t
                      border-slate-100

                      pt-5

                      dark:border-slate-800
                    "
                  >
                    <button
                      type="submit"
                      disabled={
                        formDisabled
                      }
                      className="
                        inline-flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2

                        rounded-xl

                        bg-indigo-600

                        px-5

                        text-sm
                        font-semibold

                        text-white

                        shadow-sm
                        shadow-indigo-600/20

                        transition-[background-color,transform,box-shadow]

                        hover:bg-indigo-700

                        active:scale-[0.99]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500
                        focus-visible:ring-offset-2

                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        disabled:shadow-none

                        dark:bg-indigo-500
                        dark:hover:bg-indigo-400
                        dark:focus-visible:ring-indigo-400
                        dark:focus-visible:ring-offset-slate-900
                      "
                    >
                      {submitting ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="
                              h-4
                              w-4

                              animate-spin

                              rounded-full

                              border-2
                              border-white/30
                              border-t-white
                            "
                          />

                          {
                            submittingLabel
                          }
                        </>
                      ) : (
                        <>
                          <Send
                            size={
                              15
                            }
                            strokeWidth={
                              1.9
                            }
                            aria-hidden="true"
                          />

                          {
                            submitLabel
                          }
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicForm;