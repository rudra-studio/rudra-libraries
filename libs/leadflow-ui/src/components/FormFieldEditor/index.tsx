import React from 'react';
import {
  AlignLeft,
  ChevronDown,
  CirclePlus,
  GripVertical,
  Settings2,
  Trash2,
  X,
} from 'lucide-react';

export interface FormFieldEditorOption {
  id: string;
  label: string;
  value: string;
}

export interface FormFieldEditorProps {
  /**
   * Stable field identifier.
   */
  fieldId?: string;

  /**
   * Field type.
   */
  fieldType?: string;

  /**
   * Field label.
   */
  label?: string;

  /**
   * Input placeholder.
   */
  placeholder?: string;

  /**
   * Optional helper text.
   */
  description?: string;

  /**
   * Whether this field is required.
   */
  required?: boolean;

  /**
   * Options for fields such as select,
   * radio or other choice-based fields.
   *
   * @type|complex
   * @schema {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "id": { "type": "string" },
   *       "label": { "type": "string" },
   *       "value": { "type": "string" }
   *     },
   *     "required": ["id", "label", "value"]
   *   }
   * }
   */
  options?: FormFieldEditorOption[];

  /**
   * Field types that support options.
   *
   * @type|json
   */
  optionFieldTypes?: string[];

  /**
   * Editor heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Label input caption.
   *
   * @translate
   */
  labelText?: string;

  /**
   * Placeholder input caption.
   *
   * @translate
   */
  placeholderText?: string;

  /**
   * Description input caption.
   *
   * @translate
   */
  descriptionText?: string;

  /**
   * Required setting caption.
   *
   * @translate
   */
  requiredText?: string;

  /**
   * Options section caption.
   *
   * @translate
   */
  optionsText?: string;

  /**
   * Add option button caption.
   *
   * @translate
   */
  addOptionText?: string;

  /**
   * Delete field caption.
   *
   * @translate
   */
  deleteText?: string;

  /**
   * Whether the header is displayed.
   */
  showHeader?: boolean;

  /**
   * Whether the delete action is displayed.
   */
  showDeleteAction?: boolean;

  /**
   * Whether the close action is displayed.
   */
  showCloseAction?: boolean;

  /**
   * Whether the complete editor is disabled.
   */
  disabled?: boolean;

  /**
   * Accessible editor label.
   */
  ariaLabel?: string;

  onLabelChange?: (
    fieldId: string,
    value: string,
  ) => void;

  onPlaceholderChange?: (
    fieldId: string,
    value: string,
  ) => void;

  onDescriptionChange?: (
    fieldId: string,
    value: string,
  ) => void;

  onRequiredChange?: (
    fieldId: string,
    required: boolean,
  ) => void;

  onOptionChange?: (
    fieldId: string,
    optionId: string,
    property: string,
    value: string,
  ) => void;

  onOptionAdd?: (
    fieldId: string,
  ) => void;

  onOptionRemove?: (
    fieldId: string,
    optionId: string,
  ) => void;

  onDelete?: (
    fieldId: string,
  ) => void;

  onClose?: () => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const FormFieldEditor: React.FC<
  FormFieldEditorProps
> = ({
  fieldId = '',
  fieldType = 'text',
  label = '',
  placeholder = '',
  description = '',
  required = false,
  options = [],
  optionFieldTypes = [
    'select',
    'radio',
  ],
  title = 'Field settings',
  labelText = 'Label',
  placeholderText = 'Placeholder',
  descriptionText = 'Helper text',
  requiredText = 'Required field',
  optionsText = 'Options',
  addOptionText = 'Add option',
  deleteText = 'Delete field',
  showHeader = true,
  showDeleteAction = true,
  showCloseAction = true,
  disabled = false,
  ariaLabel = 'Form field settings',
  onLabelChange,
  onPlaceholderChange,
  onDescriptionChange,
  onRequiredChange,
  onOptionChange,
  onOptionAdd,
  onOptionRemove,
  onDelete,
  onClose,
  className = '',
}) => {
  const supportsOptions =
    optionFieldTypes.includes(
      fieldType,
    );

  return (
    <section
      aria-label={ariaLabel}
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
            items-center
            justify-between
            gap-3

            border-b
            border-slate-200

            px-4
            py-3.5

            dark:border-slate-800
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2.5
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

                rounded-lg

                bg-indigo-50

                text-indigo-600

                dark:bg-indigo-500/10
                dark:text-indigo-300
              "
            >
              <Settings2
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

              <p
                className="
                  mt-0.5

                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wide

                  text-slate-400

                  dark:text-slate-500
                "
              >
                {fieldType}
              </p>
            </div>
          </div>

          {showCloseAction && (
            <button
              type="button"
              disabled={disabled}
              aria-label="Close field settings"
              onClick={onClose}
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

      {/* Settings */}
      <div
        className="
          space-y-5

          px-4
          py-5
        "
      >
        {/* Label */}
        <div>
          <label
            htmlFor={`${fieldId}-label`}
            className="
              mb-1.5
              block

              text-xs
              font-medium

              text-slate-700

              dark:text-slate-300
            "
          >
            {labelText}
          </label>

          <input
            id={`${fieldId}-label`}
            type="text"
            value={label}
            disabled={disabled}
            onChange={(event) =>
              onLabelChange?.(
                fieldId,
                event.target.value,
              )
            }
            className="
              h-10
              w-full

              rounded-xl

              border
              border-slate-200

              bg-white

              px-3

              text-sm

              text-slate-900

              outline-none

              transition-[border-color,box-shadow]

              focus:border-indigo-400
              focus:ring-4
              focus:ring-indigo-500/10

              disabled:cursor-not-allowed
              disabled:bg-slate-50
              disabled:opacity-60

              dark:border-slate-800
              dark:bg-slate-950
              dark:text-slate-100

              dark:focus:border-indigo-500
              dark:focus:ring-indigo-500/10

              dark:disabled:bg-slate-900
            "
          />
        </div>

        {/* Placeholder */}
        <div>
          <label
            htmlFor={`${fieldId}-placeholder`}
            className="
              mb-1.5
              block

              text-xs
              font-medium

              text-slate-700

              dark:text-slate-300
            "
          >
            {placeholderText}
          </label>

          <input
            id={`${fieldId}-placeholder`}
            type="text"
            value={placeholder}
            disabled={disabled}
            onChange={(event) =>
              onPlaceholderChange?.(
                fieldId,
                event.target.value,
              )
            }
            className="
              h-10
              w-full

              rounded-xl

              border
              border-slate-200

              bg-white

              px-3

              text-sm

              text-slate-900

              outline-none

              transition-[border-color,box-shadow]

              placeholder:text-slate-400

              focus:border-indigo-400
              focus:ring-4
              focus:ring-indigo-500/10

              disabled:cursor-not-allowed
              disabled:bg-slate-50
              disabled:opacity-60

              dark:border-slate-800
              dark:bg-slate-950
              dark:text-slate-100
              dark:placeholder:text-slate-600

              dark:focus:border-indigo-500
              dark:focus:ring-indigo-500/10

              dark:disabled:bg-slate-900
            "
          />
        </div>

        {/* Helper text */}
        <div>
          <label
            htmlFor={`${fieldId}-description`}
            className="
              mb-1.5
              block

              text-xs
              font-medium

              text-slate-700

              dark:text-slate-300
            "
          >
            {descriptionText}
          </label>

          <div className="relative">
            <AlignLeft
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
              className="
                pointer-events-none

                absolute
                left-3
                top-3

                text-slate-400

                dark:text-slate-500
              "
            />

            <textarea
              id={`${fieldId}-description`}
              value={description}
              disabled={disabled}
              rows={3}
              onChange={(event) =>
                onDescriptionChange?.(
                  fieldId,
                  event.target.value,
                )
              }
              className="
                block
                w-full
                resize-y

                rounded-xl

                border
                border-slate-200

                bg-white

                py-2.5
                pl-9
                pr-3

                text-sm
                leading-5

                text-slate-900

                outline-none

                transition-[border-color,box-shadow]

                focus:border-indigo-400
                focus:ring-4
                focus:ring-indigo-500/10

                disabled:cursor-not-allowed
                disabled:bg-slate-50
                disabled:opacity-60

                dark:border-slate-800
                dark:bg-slate-950
                dark:text-slate-100

                dark:focus:border-indigo-500
                dark:focus:ring-indigo-500/10

                dark:disabled:bg-slate-900
              "
            />
          </div>
        </div>

        {/* Required */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-4

            rounded-xl

            border
            border-slate-200

            bg-slate-50/70

            px-3.5
            py-3

            dark:border-slate-800
            dark:bg-slate-900/40
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-xs
                font-medium

                text-slate-700

                dark:text-slate-300
              "
            >
              {requiredText}
            </p>

            <p
              className="
                mt-0.5

                text-[10px]

                text-slate-400

                dark:text-slate-500
              "
            >
              Users must complete this
              field before submitting.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={required}
            aria-label={requiredText}
            disabled={disabled}
            onClick={() =>
              onRequiredChange?.(
                fieldId,
                !required,
              )
            }
            className={`
              relative

              h-6
              w-11
              shrink-0

              rounded-full

              transition-colors

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:focus-visible:ring-offset-slate-950

              ${
                required
                  ? `
                    bg-indigo-600
                    dark:bg-indigo-500
                  `
                  : `
                    bg-slate-200
                    dark:bg-slate-700
                  `
              }
            `}
          >
            <span
              aria-hidden="true"
              className={`
                absolute
                top-0.5

                h-5
                w-5

                rounded-full

                bg-white

                shadow-sm

                transition-transform

                ${
                  required
                    ? 'translate-x-[22px]'
                    : 'translate-x-0.5'
                }
              `}
            />
          </button>
        </div>

        {/* Choice options */}
        {supportsOptions && (
          <div
            className="
              border-t
              border-slate-100

              pt-5

              dark:border-slate-900
            "
          >
            <div
              className="
                mb-3

                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <h4
                  className="
                    text-xs
                    font-semibold

                    text-slate-800

                    dark:text-slate-200
                  "
                >
                  {optionsText}
                </h4>

                <p
                  className="
                    mt-0.5

                    text-[10px]

                    text-slate-400

                    dark:text-slate-500
                  "
                >
                  Configure the choices
                  available to users.
                </p>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  onOptionAdd?.(
                    fieldId,
                  )
                }
                className="
                  inline-flex
                  h-8
                  shrink-0
                  items-center
                  gap-1.5

                  rounded-lg

                  px-2.5

                  text-[11px]
                  font-semibold

                  text-indigo-600

                  transition-colors

                  hover:bg-indigo-50

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-indigo-500

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  dark:text-indigo-300
                  dark:hover:bg-indigo-500/10
                "
              >
                <CirclePlus
                  size={13}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />

                {addOptionText}
              </button>
            </div>

            <div className="space-y-2">
              {options.map(
                (option, index) => (
                  <div
                    key={option.id}
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
                        h-9
                        shrink-0
                        items-center

                        text-slate-300

                        dark:text-slate-700
                      "
                    >
                      <GripVertical
                        size={14}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>

                    <span
                      className="
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center

                        rounded-md

                        bg-slate-100

                        text-[10px]
                        font-semibold

                        text-slate-400

                        dark:bg-slate-900
                        dark:text-slate-500
                      "
                    >
                      {index + 1}
                    </span>

                    <input
                      type="text"
                      aria-label={`Option ${
                        index + 1
                      } label`}
                      value={
                        option.label
                      }
                      disabled={disabled}
                      onChange={(
                        event,
                      ) =>
                        onOptionChange?.(
                          fieldId,
                          option.id,
                          'label',
                          event.target
                            .value,
                        )
                      }
                      className="
                        h-9
                        min-w-0
                        flex-1

                        rounded-lg

                        border
                        border-slate-200

                        bg-white

                        px-2.5

                        text-xs

                        text-slate-800

                        outline-none

                        focus:border-indigo-400
                        focus:ring-3
                        focus:ring-indigo-500/10

                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        dark:border-slate-800
                        dark:bg-slate-950
                        dark:text-slate-200
                      "
                    />

                    <button
                      type="button"
                      disabled={disabled}
                      aria-label={`Remove option ${
                        index + 1
                      }`}
                      onClick={() =>
                        onOptionRemove?.(
                          fieldId,
                          option.id,
                        )
                      }
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

                        hover:bg-rose-50
                        hover:text-rose-600

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-rose-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        dark:text-slate-500
                        dark:hover:bg-rose-500/10
                        dark:hover:text-rose-300
                      "
                    >
                      <X
                        size={14}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                ),
              )}

              {options.length === 0 && (
                <div
                  className="
                    rounded-xl

                    border
                    border-dashed
                    border-slate-200

                    px-4
                    py-5

                    text-center

                    text-[11px]

                    text-slate-400

                    dark:border-slate-800
                    dark:text-slate-500
                  "
                >
                  No options added yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete */}
      {showDeleteAction && (
        <div
          className="
            border-t
            border-slate-200

            px-4
            py-3

            dark:border-slate-800
          "
        >
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onDelete?.(fieldId)
            }
            className="
              inline-flex
              h-9
              items-center
              gap-2

              rounded-xl

              px-3

              text-xs
              font-semibold

              text-rose-600

              transition-colors

              hover:bg-rose-50

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-rose-500

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:text-rose-300
              dark:hover:bg-rose-500/10
            "
          >
            <Trash2
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {deleteText}
          </button>
        </div>
      )}
    </section>
  );
};

export default FormFieldEditor;