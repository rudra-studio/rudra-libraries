import React, { useId, useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, {
  ElementSize,
  FormVariant,
} from '../FieldWrapper';
import styles from './styles.module.scss';

export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'className'
  > {
  name: string; /* @type|string */

  label?: string; /* @type|string|@translate */

  value?: string; /* @type|string */

  defaultValue?: string; /* @type|string */

  onChangeValue?: (value: string) => void; /* @type|function|args:value */

  clearable?: boolean; /* @type|boolean */

  variant?: FormVariant; /* @select|default|filled|floating|underlined */

  size?: ElementSize; /* @select|sm|md|lg */

  error?: string; /* @type|string */

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
   *     {"key": "full", "label": "Full"}
   *   ]
   * },{
   *   "key": "Shadow",
   *   "prefix": "shadow",
   *   "type": "select",
   *   "options": [
   *     {"key": "none", "label": "None"},
   *     {"key": "sm", "label": "Small"},
   *     {"key": "md", "label": "Medium"}
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

export default function DatePicker({
  name,
  label,
  value,
  defaultValue = '',
  onChangeValue,
  clearable = false,
  variant = 'default',
  size = 'md',
  error,
  required,
  disabled,
  className =
    'rounded-md shadow-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-500',
  ...props
}: DatePickerProps) {
  const formContext = useRudraForm();
  const isInsideForm = !!formContext;

  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const activeValue = isInsideForm
    ? String(formContext.values[name] || '')
    : value ?? defaultValue;

  const errorMessage =
    error ||
    (isInsideForm
      ? formContext.errors[name]
      : undefined);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const next = event.target.value;

    if (isInsideForm) {
      formContext.handleChange(name, next);
    }

    onChangeValue?.(next);
  };

  const openCalendar = () => {
    if (disabled) return;

    const input = inputRef.current;

    if (!input) return;

    input.focus();

    try {
      input.showPicker?.();
    } catch {
      // Native browser fallback
    }
  };

  const clearDate = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (disabled) return;

    if (isInsideForm) {
      formContext.handleChange(name, '');
    }

    onChangeValue?.('');
  };

  const sizeMap = {
    sm: 'px-2.5 py-1.5 pr-10 text-xs',
    md: 'px-3 py-2 pr-11 text-sm',
    lg: 'px-4 py-3 pr-12 text-base',
  };

  const calendarPositionMap = {
    sm: 'right-2',
    md: 'right-3',
    lg: 'right-3.5',
  };

  let inputClass = `
    w-full
    outline-none
    transition-all
    text-gray-900
    dark:text-white
    cursor-pointer
    ${className}
  `;

  if (variant === 'default') {
    inputClass += `
      border
      focus:ring-4
      ${sizeMap[size]}
    `;
  } else if (variant === 'floating') {
    inputClass += `
      border
      focus:ring-4
      ${sizeMap[size]}
    `;
  } else if (
    variant === 'filled' ||
    variant === 'underlined'
  ) {
    inputClass += `
      px-1
      py-1.5
      pr-10
      text-sm
      bg-transparent
    `;
  }

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
      <div
        className="relative w-full flex items-center"
        onClick={openCalendar}
      >
        <input
          {...props}
          ref={inputRef}
          id={props.id ?? `rudra-date-${id}`}
          name={name}
          type="date"
          value={activeValue}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          aria-invalid={
            errorMessage ? true : undefined
          }
          className={`${styles.dateInput} ${inputClass}`}
        />

        <div
          className={`
            absolute
            ${calendarPositionMap[size]}
            flex
            items-center
            gap-1
          `}
        >
          {clearable && activeValue && (
            <button
              type="button"
              disabled={disabled}
              aria-label="Clear date"
              onClick={clearDate}
              className="
                flex
                items-center
                justify-center
                text-gray-400
                hover:text-gray-700
                dark:text-gray-500
                dark:hover:text-gray-200
                transition-colors
                focus:outline-none
              "
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            aria-label="Open calendar"
            onClick={(event) => {
              event.stopPropagation();
              openCalendar();
            }}
            className="
              flex
              items-center
              justify-center
              text-gray-400
              hover:text-gray-700
              dark:text-gray-500
              dark:hover:text-gray-200
              transition-colors
              focus:outline-none
            "
          >
            <Calendar
              className={
                size === 'sm'
                  ? 'w-4 h-4'
                  : 'w-5 h-5'
              }
            />
          </button>
        </div>
      </div>
    </FieldWrapper>
  );
}