import React, {
  useId,
  useRef,
  useState,
} from 'react';

import { X } from 'lucide-react';

import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, {
  ElementSize,
  FormVariant,
} from '../FieldWrapper';

export interface TimePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'name'
    | 'size'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'type'
    | 'className'
  > {
  name: string; /* @type|string */

  label?: string; /* @type|string|@translate */

  value?: string; /* @type|string */

  defaultValue?: string; /* @type|string */

  onChangeValue?: (
    value: string
  ) => void; /* @type|function|args:value */

  variant?: FormVariant; /* @select|default|filled|floating|underlined */

  size?: ElementSize; /* @select|sm|md|lg */

  showSeconds?: boolean; /* @type|boolean */

  clearable?: boolean; /* @type|boolean */

  required?: boolean; /* @type|boolean */

  disabled?: boolean; /* @type|boolean */

  error?: string; /* @type|string */

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
   *     {"key": "full", "label": "Full"}
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

export default function TimePicker({
  name,
  label,
  value,
  defaultValue = '',
  onChangeValue,
  variant = 'default',
  size = 'md',
  showSeconds = false,
  clearable = false,
  required,
  disabled,
  error,
  className =
    'border-gray-300 dark:border-gray-700 focus:border-blue-500',
  step,
  ...props
}: TimePickerProps) {
  const formContext = useRudraForm();

  const generatedId = useId();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const isInsideForm = !!formContext;

  const isControlled =
    value !== undefined;

  const [localValue, setLocalValue] =
    useState(defaultValue);

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
    `rudra-time-${generatedId}`;

  const emit = (next: string) => {
    if (isInsideForm) {
      formContext.handleChange(
        name,
        next
      );
    } else if (!isControlled) {
      setLocalValue(next);
    }

    onChangeValue?.(next);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    emit(event.target.value);
  };

  /**
   * Opens the browser-native time picker.
   */
  const openPicker = () => {
    if (disabled) {
      return;
    }

    const input = inputRef.current;

    if (!input) {
      return;
    }

    try {
      input.showPicker?.();
    } catch {
      input.focus();
    }
  };

  const handleClear = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) {
      return;
    }

    emit('');
  };

  const sizeMap: Record<
    ElementSize,
    string
  > = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

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

  let inputClass = `
    w-full
    outline-none
    transition-all

    text-gray-900
    dark:text-white

    cursor-pointer

    ${variantMap[variant]}
    ${className}
  `;

  if (variant !== 'underlined') {
    inputClass += `
      ${sizeMap[size]}
    `;
  } else {
    inputClass +=
      size === 'sm'
        ? ' py-1.5 text-xs '
        : size === 'lg'
          ? ' py-3 text-base '
          : ' py-2 text-sm ';
  }

  /**
   * Leave space between the clear button
   * and the browser-native time icon.
   */
  if (clearable && activeValue) {
    inputClass += ' pr-16 ';
  }

  if (errorMessage) {
    inputClass += `
      !border-red-500
      focus:!border-red-500
      focus:!ring-red-500/20
    `;
  }

  if (disabled) {
    inputClass += `
      opacity-60
      cursor-not-allowed
    `;
  }

  return (
    <FieldWrapper
      label={label}
      error={errorMessage}
      required={required}
      variant={variant}
      size={size}
    >
      <div className="relative w-full flex items-center">
        <input
          {...props}
          ref={inputRef}
          id={controlId}
          name={name}
          type="time"
          value={activeValue}
          step={
            step ??
            (showSeconds ? 1 : 60)
          }
          required={required}
          disabled={disabled}
          aria-invalid={
            errorMessage
              ? true
              : undefined
          }
          className={inputClass}
          onChange={handleChange}
          onClick={openPicker}
        />

        {clearable && activeValue && (
          <button
            type="button"
            disabled={disabled}
            aria-label="Clear time"
            onClick={handleClear}
            tabIndex={-1}
            className="
              absolute
              right-9

              flex
              items-center
              justify-center

              w-5
              h-5

              border-0
              bg-transparent

              text-gray-400
              dark:text-gray-500

              hover:text-gray-700
              dark:hover:text-gray-200

              transition-colors
              focus:outline-none

              disabled:cursor-not-allowed
            "
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </FieldWrapper>
  );
}