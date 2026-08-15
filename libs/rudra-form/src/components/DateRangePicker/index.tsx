import React, { useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, {
  ElementSize,
  FormVariant,
} from '../FieldWrapper';
import styles from './styles.module.scss';

export interface DateRangeValue {
  start: string;
  end: string;
}

export interface DateRangePickerProps {
  name: string; /* @type|string */

  label?: string; /* @type|string|@translate */

  value?: DateRangeValue;

  defaultValue?: DateRangeValue;

  onChangeValue?: (
    value: DateRangeValue
  ) => void; /* @type|function|args:value */

  min?: string; /* @type|string */

  max?: string; /* @type|string */

  startLabel?: string; /* @type|string|@translate */

  endLabel?: string; /* @type|string|@translate */

  allowSameDay?: boolean; /* @type|boolean */

  clearable?: boolean; /* @type|boolean */

  variant?: FormVariant; /* @select|default|filled|floating|underlined */

  size?: ElementSize; /* @select|sm|md|lg */

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

function shiftDate(
  value: string,
  amount: number
): string {
  if (!value) {
    return '';
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  date.setUTCDate(
    date.getUTCDate() + amount
  );

  return date
    .toISOString()
    .slice(0, 10);
}

export default function DateRangePicker({
  name,
  label,
  value,
  defaultValue = {
    start: '',
    end: '',
  },
  onChangeValue,
  min,
  max,
  startLabel = 'Start date',
  endLabel = 'End date',
  allowSameDay = false,
  clearable = false,
  variant = 'default',
  size = 'md',
  required,
  disabled,
  error,
  className =
    'rounded-md shadow-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-500',
}: DateRangePickerProps) {
  const formContext = useRudraForm();

  const startInputRef =
    useRef<HTMLInputElement>(null);

  const endInputRef =
    useRef<HTMLInputElement>(null);

  const id = useId();

  const isInsideForm = !!formContext;

  const contextValue =
    formContext?.values?.[name];

  const range: DateRangeValue =
    value ??
    (
      contextValue &&
      typeof contextValue === 'object'
        ? contextValue
        : defaultValue
    );

  const start = range.start ?? '';
  const end = range.end ?? '';

  const orderError =
    start &&
    end &&
    (
      allowSameDay
        ? end < start
        : end <= start
    )
      ? allowSameDay
        ? 'End date cannot be before start date'
        : 'End date must be after start date'
      : '';

  const errorMessage =
    error ||
    (isInsideForm
      ? formContext.errors[name]
      : undefined) ||
    orderError;

  const emit = (
    next: DateRangeValue
  ) => {
    if (isInsideForm) {
      formContext.handleChange(
        name,
        next
      );
    }

    onChangeValue?.(next);
  };

  /*
   * Strict range:
   *
   * start < end
   *
   * If same-day is allowed:
   *
   * start <= end
   */
  const startMax = end
    ? allowSameDay
      ? end
      : shiftDate(end, -1)
    : max;

  const endMin = start
    ? allowSameDay
      ? start
      : shiftDate(start, 1)
    : min;

  const handleStartChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextStart =
      event.target.value;

    emit({
      start: nextStart,
      end,
    });
  };

  const handleEndChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextEnd =
      event.target.value;

    emit({
      start,
      end: nextEnd,
    });
  };

  const clearRange = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) {
      return;
    }

    emit({
      start: '',
      end: '',
    });
  };

  const openStartPicker = () => {
    if (disabled) return;

    try {
      startInputRef.current
        ?.showPicker?.();
    } catch {
      startInputRef.current?.focus();
    }
  };

  const openEndPicker = () => {
    if (disabled) return;

    try {
      endInputRef.current
        ?.showPicker?.();
    } catch {
      endInputRef.current?.focus();
    }
  };

  const sizeMap = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const labelSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
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

  if (
    variant === 'default' ||
    variant === 'floating'
  ) {
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
        className={styles.container}
      >
        <div
          className={styles.field}
        >
          <label
            htmlFor={`rudra-range-start-${id}`}
            className={`
              ${styles.fieldLabel}
              ${labelSizeMap[size]}
              text-gray-600
              dark:text-gray-400
            `}
          >
            {startLabel}
          </label>

          <input
            ref={startInputRef}
            id={`rudra-range-start-${id}`}
            name={`${name}-start`}
            type="date"
            value={start}
            min={min}
            max={startMax}
            required={required}
            disabled={disabled}
            aria-invalid={
              errorMessage
                ? true
                : undefined
            }
            className={`
              ${styles.dateInput}
              ${inputClass}
            `}
            onChange={
              handleStartChange
            }
            onClick={
              openStartPicker
            }
          />
        </div>

        <span
          className={styles.separator}
          aria-hidden="true"
        >
          →
        </span>

        <div
          className={styles.field}
        >
          <label
            htmlFor={`rudra-range-end-${id}`}
            className={`
              ${styles.fieldLabel}
              ${labelSizeMap[size]}
              text-gray-600
              dark:text-gray-400
            `}
          >
            {endLabel}
          </label>

          <input
            ref={endInputRef}
            id={`rudra-range-end-${id}`}
            name={`${name}-end`}
            type="date"
            value={end}
            min={endMin}
            max={max}
            required={required}
            disabled={disabled}
            aria-invalid={
              errorMessage
                ? true
                : undefined
            }
            className={`
              ${styles.dateInput}
              ${inputClass}
            `}
            onChange={
              handleEndChange
            }
            onClick={
              openEndPicker
            }
          />
        </div>

        {clearable &&
          (start || end) && (
            <button
              type="button"
              disabled={disabled}
              aria-label="Clear date range"
              className={`
                ${styles.clearButton}
                text-gray-400
                dark:text-gray-500
                hover:text-gray-700
                dark:hover:text-gray-200
              `}
              onClick={clearRange}
            >
              <X className="w-4 h-4" />
            </button>
          )}
      </div>
    </FieldWrapper>
  );
}