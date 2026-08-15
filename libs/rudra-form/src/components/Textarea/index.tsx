import React, {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, {
  ElementSize,
  FormVariant,
} from '../FieldWrapper';

export interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    | 'name'
    | 'size'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'className'
  > {
  name: string; /* @type|string */

  label?: string; /* @type|string|@translate */

  variant?: FormVariant; /* @select|default|filled|floating|underlined */

  size?: ElementSize; /* @select|sm|md|lg */

  value?: string; /* @type|string */

  defaultValue?: string; /* @type|string */

  placeholder?: string; /* @type|string|@translate */

  onChangeValue?: (
    value: string
  ) => void; /* @type|function|args:value */

  error?: string; /* @type|string */

  autoResize?: boolean; /* @type|boolean */

  minRows?: number; /* @type|number */

  maxRows?: number; /* @type|number */

  showCount?: boolean; /* @type|boolean */

  required?: boolean; /* @type|boolean */

  disabled?: boolean; /* @type|boolean */

  /**
   * @type|class
   * @schema [{
   *   "key": "Radius",
   *   "prefix": "rounded",
   *   "type": "select",
   *   "options": [
   *     {"key": "none", "label": "None"},
   *     {"key": "sm", "label": "Small"},
   *     {"key": "md", "label": "Medium"},
   *     {"key": "lg", "label": "Large"},
   *     {"key": "xl", "label": "Extra Large"}
   *   ]
   * },{
   *   "key": "Shadow",
   *   "prefix": "shadow",
   *   "type": "select",
   *   "options": [
   *     {"key": "none", "label": "None"},
   *     {"key": "sm", "label": "Small"},
   *     {"key": "md", "label": "Medium"},
   *     {"key": "lg", "label": "Large"}
   *   ]
   * },{
   *   "key": "Background",
   *   "prefix": "bg",
   *   "type": "select",
   *   "options": [
   *     {"key": "transparent", "label": "Transparent"},
   *     {"key": "white dark:bg-gray-900", "label": "Solid"},
   *     {"key": "gray-50 dark:bg-gray-800", "label": "Subtle"}
   *   ]
   * }]
   */
  className?: string;
}

export default function Textarea({
  name,
  label,
  variant = 'default',
  size = 'md',
  value,
  defaultValue = '',
  placeholder,
  onChangeValue,
  error,
  autoResize = false,
  minRows = 3,
  maxRows = 12,
  showCount = false,
  required,
  disabled,
  maxLength,
  className =
    'border-gray-300 dark:border-gray-700 focus:border-blue-500',
  ...props
}: TextareaProps) {
  const formContext = useRudraForm();

  const generatedId = useId();

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const isInsideForm = !!formContext;

  /*
   * Used when the Textarea is outside RudraForm
   * and no controlled value is provided.
   */
  const [localValue, setLocalValue] =
    useState(defaultValue);

  const isControlled =
    value !== undefined;

  const contextValue =
    formContext?.values?.[name];

  const activeValue = isInsideForm
    ? String(contextValue ?? '')
    : isControlled
      ? value
      : localValue;

  const errorMessage =
    error ||
    (isInsideForm
      ? formContext.errors[name]
      : undefined);

  const controlId =
    props.id ??
    `rudra-textarea-${generatedId}`;

  /*
   * Protect against invalid row configurations,
   * for example:
   *
   * minRows={10}
   * maxRows={5}
   */
  const resolvedMinRows =
    Math.max(1, minRows);

  const resolvedMaxRows =
    Math.max(
      resolvedMinRows,
      maxRows
    );

  const resizeTextarea = () => {
    if (
      !autoResize ||
      !textareaRef.current
    ) {
      return;
    }

    const node =
      textareaRef.current;

    const computed =
      window.getComputedStyle(node);

    const lineHeight =
      Number.parseFloat(
        computed.lineHeight
      ) || 20;

    const paddingTop =
      Number.parseFloat(
        computed.paddingTop
      ) || 0;

    const paddingBottom =
      Number.parseFloat(
        computed.paddingBottom
      ) || 0;

    const minHeight =
      lineHeight *
        resolvedMinRows +
      paddingTop +
      paddingBottom;

    const maxHeight =
      lineHeight *
        resolvedMaxRows +
      paddingTop +
      paddingBottom;

    /*
     * Reset first so scrollHeight can
     * shrink when text is deleted.
     */
    node.style.height = 'auto';

    const nextHeight = Math.min(
      Math.max(
        node.scrollHeight,
        minHeight
      ),
      maxHeight
    );

    node.style.height =
      `${nextHeight}px`;

    node.style.overflowY =
      node.scrollHeight >
      maxHeight
        ? 'auto'
        : 'hidden';
  };

  useEffect(() => {
    resizeTextarea();
  }, [
    activeValue,
    autoResize,
    resolvedMinRows,
    resolvedMaxRows,
  ]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const nextValue =
      event.target.value;

    if (isInsideForm) {
      formContext.handleChange(
        name,
        nextValue
      );
    } else if (!isControlled) {
      setLocalValue(nextValue);
    }

    onChangeValue?.(nextValue);
  };

  const sizeMap: Record<
    ElementSize,
    string
  > = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  /*
   * Variant decides the component's
   * overall visual pattern.
   */
  const variantMap: Record<
    FormVariant,
    string
  > = {
    default: `
      border
      rounded-md
      bg-white
      dark:bg-gray-900
      focus:ring-4
      focus:ring-blue-500/20
    `,

    filled: `
      border
      border-transparent
      rounded-md
      bg-gray-100
      dark:bg-gray-800
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-500/20
    `,

    floating: `
      border
      rounded-md
      bg-white
      dark:bg-gray-900
      placeholder-transparent
      focus:ring-4
      focus:ring-blue-500/20
    `,

    underlined: `
      border-0
      border-b
      rounded-none
      bg-transparent
      px-1
      focus:ring-0
      focus:border-blue-500
    `,
  };

  let textareaClass = `
    w-full
    outline-none
    transition-all

    text-gray-900
    dark:text-white

    placeholder:text-gray-400
    dark:placeholder:text-gray-500

    ${variantMap[variant]}
    ${className}
  `;

  /*
   * Underlined has intentionally smaller
   * horizontal padding.
   */
  if (variant !== 'underlined') {
    textareaClass += `
      ${sizeMap[size]}
    `;
  } else {
    textareaClass +=
      size === 'sm'
        ? ' py-1.5 text-xs '
        : size === 'lg'
          ? ' py-3 text-base '
          : ' py-2 text-sm ';
  }

  /*
   * Auto resize controls height itself.
   * Otherwise browser resize stays available.
   */
  if (autoResize) {
    textareaClass += `
      resize-none
    `;
  }

  if (errorMessage) {
    textareaClass += `
      !border-red-500
      focus:!border-red-500
      focus:!ring-red-500/20
    `;
  }

  if (disabled) {
    textareaClass += `
      opacity-60
      cursor-not-allowed
    `;
  }

  const count =
    activeValue?.length ?? 0;

  return (
    <FieldWrapper
      label={label}
      error={errorMessage}
      required={required}
      variant={variant}
      size={size}
    >
      <div className="relative w-full">
        <textarea
          {...props}
          ref={textareaRef}
          id={controlId}
          name={name}
          rows={resolvedMinRows}
          value={activeValue}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={
            variant === 'floating'
              ? ' '
              : placeholder
          }
          aria-invalid={
            errorMessage
              ? true
              : undefined
          }
          className={textareaClass}
          onChange={handleChange}
        />

        {showCount && (
          <div
            className="
              mt-1
              flex
              justify-end
              text-xs
              text-gray-500
              dark:text-gray-400
            "
            aria-live="polite"
          >
            {count}

            {typeof maxLength ===
              'number' &&
              ` / ${maxLength}`}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}