import React from 'react';
import {
  AlignLeft,
  Building2,
  ChevronDown,
  CircleDot,
  Hash,
  ListChecks,
  Mail,
  Phone,
  Plus,
  TextCursorInput,
  type LucideIcon,
} from 'lucide-react';

export interface FormFieldPaletteItem {
  type: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

export interface FormFieldPaletteProps {
  /**
   * Available field types.
   *
   * @type|complex
   * @schema {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "type": { "type": "string" },
   *       "label": { "type": "string" },
   *       "description": { "type": "string" },
   *       "icon": { "type": "string" },
   *       "disabled": { "type": "boolean" }
   *     },
   *     "required": ["type", "label"]
   *   }
   * }
   */
  items?: FormFieldPaletteItem[];

  /**
   * Palette heading.
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
   * Whether the heading area is displayed.
   */
  showHeader?: boolean;

  /**
   * Whether item descriptions are displayed.
   */
  showDescriptions?: boolean;

  /**
   * Whether the add icon is displayed.
   */
  showAddIcon?: boolean;

  /**
   * Layout of palette items.
   *
   * @select|list|grid
   */
  layout?: 'list' | 'grid';

  /**
   * Visual density.
   *
   * @select|compact|default
   */
  size?: 'compact' | 'default';

  /**
   * Whether the complete palette is disabled.
   */
  disabled?: boolean;

  /**
   * Accessible palette label.
   */
  ariaLabel?: string;

  /**
   * Emits the selected field type.
   */
  onFieldSelect?: (
    fieldType: string,
  ) => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const ICONS: Record<
  string,
  LucideIcon
> = {
  AlignLeft,
  Building2,
  ChevronDown,
  CircleDot,
  Hash,
  ListChecks,
  Mail,
  Phone,
  TextCursorInput,
};

const DEFAULT_ITEMS: FormFieldPaletteItem[] = [
  {
    type: 'text',
    label: 'Text',
    description:
      'Short single-line text.',
    icon: 'TextCursorInput',
  },
  {
    type: 'email',
    label: 'Email',
    description:
      'Email address field.',
    icon: 'Mail',
  },
  {
    type: 'phone',
    label: 'Phone',
    description:
      'Phone number field.',
    icon: 'Phone',
  },
  {
    type: 'company',
    label: 'Company',
    description:
      'Company or organization.',
    icon: 'Building2',
  },
  {
    type: 'select',
    label: 'Select',
    description:
      'Choose from predefined options.',
    icon: 'ChevronDown',
  },
  {
    type: 'textarea',
    label: 'Long Text',
    description:
      'Multi-line text response.',
    icon: 'AlignLeft',
  },
];

const FormFieldPalette: React.FC<
  FormFieldPaletteProps
> = ({
  items = DEFAULT_ITEMS,
  title = 'Fields',
  description =
    'Add fields to your form.',
  showHeader = true,
  showDescriptions = true,
  showAddIcon = true,
  layout = 'list',
  size = 'default',
  disabled = false,
  ariaLabel = 'Form fields',
  onFieldSelect,
  className = '',
}) => {
  const compact =
    size === 'compact';

  return (
    <section
      aria-label={ariaLabel}
      className={`
        min-w-0

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
            border-b
            border-slate-200

            px-4
            py-3.5

            dark:border-slate-800
          "
        >
          <h3
            className="
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
                mt-1

                text-[11px]
                leading-4

                text-slate-400

                dark:text-slate-500
              "
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Palette */}
      <div
        className={`
          ${
            compact
              ? 'p-2'
              : 'p-3'
          }

          ${
            layout === 'grid'
              ? `
                grid
                grid-cols-1
                gap-2

                sm:grid-cols-2
              `
              : `
                flex
                flex-col
                gap-1.5
              `
          }
        `}
      >
        {items.map(
          (item) => {
            const Icon =
              item.icon
                ? ICONS[
                    item.icon
                  ] ??
                  TextCursorInput
                : TextCursorInput;

            const itemDisabled =
              disabled ||
              Boolean(
                item.disabled,
              );

            return (
              <button
                key={item.type}
                type="button"
                disabled={
                  itemDisabled
                }
                aria-label={`Add ${item.label} field`}
                onClick={() =>
                  onFieldSelect?.(
                    item.type,
                  )
                }
                className={`
                  group

                  flex
                  min-w-0
                  items-center
                  gap-3

                  rounded-xl

                  border
                  border-transparent

                  text-left

                  transition-[background-color,border-color,box-shadow,transform]

                  hover:border-slate-200
                  hover:bg-slate-50

                  active:scale-[0.99]

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-indigo-500

                  disabled:cursor-not-allowed
                  disabled:opacity-45

                  dark:hover:border-slate-800
                  dark:hover:bg-slate-900

                  ${
                    compact
                      ? 'p-2'
                      : 'p-2.5'
                  }
                `}
              >
                {/* Field icon */}
                <span
                  className={`
                    flex
                    shrink-0
                    items-center
                    justify-center

                    rounded-lg

                    bg-slate-100

                    text-slate-500

                    transition-colors

                    group-hover:bg-indigo-50
                    group-hover:text-indigo-600

                    dark:bg-slate-900
                    dark:text-slate-400

                    dark:group-hover:bg-indigo-500/10
                    dark:group-hover:text-indigo-300

                    ${
                      compact
                        ? `
                          h-8
                          w-8
                        `
                        : `
                          h-9
                          w-9
                        `
                    }
                  `}
                >
                  <Icon
                    size={
                      compact
                        ? 14
                        : 16
                    }
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>

                {/* Text */}
                <span
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <span
                    className="
                      block
                      truncate

                      text-xs
                      font-semibold

                      text-slate-700

                      dark:text-slate-300
                    "
                  >
                    {item.label}
                  </span>

                  {showDescriptions &&
                    item.description && (
                      <span
                        className="
                          mt-0.5
                          block

                          line-clamp-2

                          text-[10px]
                          leading-4

                          text-slate-400

                          dark:text-slate-500
                        "
                      >
                        {
                          item.description
                        }
                      </span>
                    )}
                </span>

                {/* Add */}
                {showAddIcon && (
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center

                      rounded-lg

                      text-slate-300

                      transition-colors

                      group-hover:bg-white
                      group-hover:text-indigo-600

                      dark:text-slate-700
                      dark:group-hover:bg-slate-800
                      dark:group-hover:text-indigo-300
                    "
                  >
                    <Plus
                      size={14}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>
                )}
              </button>
            );
          },
        )}
      </div>
    </section>
  );
};

export default FormFieldPalette;