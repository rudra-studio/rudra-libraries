import React from 'react';
import {
  Eye,
  FileText,
} from 'lucide-react';

export interface FormPreviewProps {
  /**
   * Form fields/items to preview.
   *
   * @type|json
   */
  items?: any[];

  /**
   * Form title.
   *
   * @translate
   */
  title?: string;

  /**
   * Form description.
   *
   * @translate
   */
  description?: string;

  /**
   * Optional logo URL.
   */
  logoUrl?: string;

  /**
   * Fallback initials/text when no logo exists.
   */
  logoText?: string;

  /**
   * Submit button label shown in the preview.
   *
   * @translate
   */
  submitLabel?: string;

  /**
   * Whether the form header is displayed.
   */
  showHeader?: boolean;

  /**
   * Whether branding/logo is displayed.
   */
  showBranding?: boolean;

  /**
   * Whether the submit button is displayed.
   */
  showSubmitButton?: boolean;

  /**
   * Preview width.
   *
   * @select|compact|default|wide
   */
  width?:
    | 'compact'
    | 'default'
    | 'wide';

  /**
   * Spacing between rendered fields.
   *
   * @select|compact|default|relaxed
   */
  spacing?:
    | 'compact'
    | 'default'
    | 'relaxed';

  /**
   * Text shown when no fields exist.
   *
   * @translate
   */
  emptyText?: string;

  /**
   * Supporting empty-state text.
   *
   * @translate
   */
  emptyDescription?: string;

  /**
   * Renderer for each form field.
   *
   * @nodeFunction
   */
  children?: (
    context: {
      item: any;
      index: number;
      isFirst: boolean;
      isLast: boolean;
    },
  ) => React.ReactNode;

  /**
   * Called when the preview submit button
   * is clicked.
   *
   * This is only a preview action. Form data
   * collection/submission remains outside.
   */
  onSubmitClick?: () => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const WIDTH_STYLES: Record<
  NonNullable<
    FormPreviewProps['width']
  >,
  string
> = {
  compact: 'max-w-md',
  default: 'max-w-xl',
  wide: 'max-w-2xl',
};

const SPACING_STYLES: Record<
  NonNullable<
    FormPreviewProps['spacing']
  >,
  string
> = {
  compact: 'space-y-3',
  default: 'space-y-4',
  relaxed: 'space-y-6',
};

const FormPreview: React.FC<
  FormPreviewProps
> = ({
  items = [],
  title = 'Contact us',
  description =
    'Tell us a little about yourself and we’ll get back to you.',
  logoUrl = '',
  logoText = '',
  submitLabel = 'Submit',
  showHeader = true,
  showBranding = true,
  showSubmitButton = true,
  width = 'default',
  spacing = 'default',
  emptyText = 'Your form is empty',
  emptyDescription =
    'Add fields from the field palette to start building your form.',
  children,
  onSubmitClick,
  className = '',
}) => {
  return (
    <section
      aria-label="Form preview"
      className={`
        min-w-0

        rounded-2xl

        border
        border-slate-200

        bg-slate-50/70

        p-3

        dark:border-slate-800
        dark:bg-slate-900/30

        sm:p-5

        ${className}
      `}
    >
      {/* Preview toolbar */}
      <div
        className="
          mb-3

          flex
          items-center
          justify-between
          gap-3

          px-1
        "
      >
        <div
          className="
            flex
            items-center
            gap-2

            text-[11px]
            font-medium

            text-slate-400

            dark:text-slate-500
          "
        >
          <Eye
            size={13}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          Form preview
        </div>

        <span
          className="
            rounded-full

            border
            border-slate-200

            bg-white

            px-2
            py-0.5

            text-[9px]
            font-semibold
            uppercase
            tracking-wide

            text-slate-400

            dark:border-slate-800
            dark:bg-slate-950
            dark:text-slate-500
          "
        >
          Preview
        </span>
      </div>

      {/* Form canvas */}
      <div
        className={`
          mx-auto
          w-full

          overflow-hidden

          rounded-2xl

          border
          border-slate-200

          bg-white

          shadow-sm
          shadow-slate-950/[0.03]

          dark:border-slate-800
          dark:bg-slate-950
          dark:shadow-black/10

          ${WIDTH_STYLES[width]}
        `}
      >
        {showHeader && (
          <div
            className="
              border-b
              border-slate-100

              px-5
              pb-5
              pt-6

              dark:border-slate-900

              sm:px-7
              sm:pb-6
              sm:pt-7
            "
          >
            {showBranding && (
              <div className="mb-5">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt=""
                    className="
                      h-10
                      max-w-[160px]
                      object-contain
                      object-left
                    "
                  />
                ) : logoText ? (
                  <div
                    className="
                      inline-flex
                      h-10
                      min-w-10
                      items-center
                      justify-center

                      rounded-xl

                      bg-gradient-to-br
                      from-indigo-500
                      to-violet-600

                      px-3

                      text-sm
                      font-bold

                      text-white

                      shadow-sm
                      shadow-indigo-500/20
                    "
                  >
                    {logoText}
                  </div>
                ) : null}
              </div>
            )}

            {title && (
              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight

                  text-slate-950

                  dark:text-white

                  sm:text-2xl
                "
              >
                {title}
              </h2>
            )}

            {description && (
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
        )}

        {/* Dynamic fields */}
        <div
          className="
            px-5
            py-6

            sm:px-7
            sm:py-7
          "
        >
          {items.length > 0 ? (
            <div
              className={`
                min-w-0
                ${SPACING_STYLES[
                  spacing
                ]}
              `}
            >
              {items.map(
                (item, index) => {
                  const isFirst =
                    index === 0;

                  const isLast =
                    index ===
                    items.length - 1;

                  return (
                    <div
                      key={
                        item?.id ??
                        index
                      }
                      className="
                        min-w-0
                      "
                    >
                      {typeof children ===
                      'function'
                        ? children({
                            item,
                            index,
                            isFirst,
                            isLast,
                          })
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

                rounded-xl

                border
                border-dashed
                border-slate-200

                bg-slate-50/50

                px-6
                py-10

                text-center

                dark:border-slate-800
                dark:bg-slate-900/30
              "
            >
              <div
                className="
                  max-w-[280px]
                "
              >
                <span
                  className="
                    mx-auto

                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    rounded-xl

                    bg-white

                    text-slate-400

                    shadow-sm
                    ring-1
                    ring-slate-200

                    dark:bg-slate-950
                    dark:text-slate-500
                    dark:ring-slate-800
                  "
                >
                  <FileText
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>

                <p
                  className="
                    mt-3

                    text-sm
                    font-medium

                    text-slate-600

                    dark:text-slate-300
                  "
                >
                  {emptyText}
                </p>

                {emptyDescription && (
                  <p
                    className="
                      mt-1

                      text-xs
                      leading-5

                      text-slate-400

                      dark:text-slate-500
                    "
                  >
                    {
                      emptyDescription
                    }
                  </p>
                )}
              </div>
            </div>
          )}

          {showSubmitButton &&
            items.length > 0 && (
              <div
                className="
                  mt-6
                  border-t
                  border-slate-100

                  pt-5

                  dark:border-slate-900
                "
              >
                <button
                  type="button"
                  onClick={
                    onSubmitClick
                  }
                  className="
                    inline-flex
                    min-h-10
                    items-center
                    justify-center

                    rounded-xl

                    bg-indigo-600

                    px-5

                    text-sm
                    font-semibold

                    text-white

                    shadow-sm
                    shadow-indigo-600/20

                    transition-[background-color,transform]

                    hover:bg-indigo-700

                    active:scale-[0.98]

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                    focus-visible:ring-offset-2

                    dark:bg-indigo-500
                    dark:hover:bg-indigo-400
                    dark:focus-visible:ring-indigo-400
                    dark:focus-visible:ring-offset-slate-950
                  "
                >
                  {submitLabel}
                </button>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default FormPreview;