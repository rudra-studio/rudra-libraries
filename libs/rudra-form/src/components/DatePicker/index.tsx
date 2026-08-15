import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, {
  FormVariant,
  ElementSize,
} from '../FieldWrapper';
import styles from './styles.module.scss';

export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'className'
  > {
  name: string; /* @type|string */

  label?: string; /* @type|string|@translate */

  variant?: FormVariant; /* @select|default|filled|floating|underlined */

  size?: ElementSize; /* @select|sm|md|lg */

  value?: string; /* @type|string */

  defaultValue?: string; /* @type|string */

  onChangeValue?: (value: string) => void; /* @type|function|args:value */

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
  variant = 'default',
  size = 'md',
  value,
  defaultValue = '',
  onChangeValue,
  clearable = false,
  required,
  disabled,
  error,
  className =
    'rounded-md shadow-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-500',
  ...props
}: DatePickerProps) {
  const formContext = useRudraForm();
  const inputRef = useRef<HTMLInputElement>(null);

  const isInsideForm = !!formContext;

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

  const openPicker = () => {
    if (disabled) return;

    try {
      inputRef.current?.showPicker?.();
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleClear = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    if (isInsideForm) {
      formContext.handleChange(name, '');
    }

    onChangeValue?.('');
  };

  const sizeMap = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  let inputClass = `
    w-full
    outline-none
    transition-all
    text-gray-900
    dark:text-white
    ${className}
  `;

  if (variant === 'default') {
    inputClass += `
      border
      focus:ring-4
      ${sizeMap[size]}
    `;
  }

  if (variant === 'floating') {
    inputClass += `
      border
      focus:ring-4
      ${sizeMap[size]}
    `;
  }

  if (
    variant === 'filled' ||
    variant === 'underlined'
  ) {
    inputClass += `
      px-1
      py-1.5
      text-sm
      bg-transparent
    `;
  }

  if (clearable && activeValue) {
    inputClass += ' pr-10 ';
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
  } else {
    inputClass += ' cursor-pointer ';
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
          name={name}
          type="date"
          value={activeValue}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          onClick={openPicker}
          aria-invalid={errorMessage ? true : undefined}
          className={`${styles.dateInput} ${inputClass}`}
        />

        {clearable && activeValue && (
          <button
            type="button"
            disabled={disabled}
            aria-label="Clear date"
            onClick={handleClear}
            className="
              absolute
              right-9
              flex
              items-center
              justify-center
              w-5
              h-5
              text-gray-400
              dark:text-gray-500
              hover:text-gray-700
              dark:hover:text-gray-200
              transition-colors
              focus:outline-none
            "
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </FieldWrapper>
  );
}