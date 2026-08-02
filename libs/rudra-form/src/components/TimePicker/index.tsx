import React, { useId } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface TimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type'> {
  name: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChangeValue?: (value: string) => void;
  variant?: FormVariant;
  size?: ElementSize;
  showSeconds?: boolean;
  clearable?: boolean;
  error?: string;
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
  error,
  required,
  disabled,
  className,
  step,
  ...rest
}: TimePickerProps) {
  const form = useRudraForm();
  const generatedId = useId();
  const contextValue = form?.values?.[name];
  const resolvedValue = value ?? (contextValue == null ? undefined : String(contextValue));
  const currentValue = resolvedValue ?? defaultValue;
  const resolvedError = error ?? form?.errors?.[name];
  const controlId = rest.id ?? `rudra-time-${generatedId}`;

  const emit = (next: string) => {
    form?.handleChange(name, next);
    onChangeValue?.(next);
  };

  return (
    <FieldWrapper label={label} error={resolvedError} required={required} variant={variant} size={size} className={styles.wrapper}>
      <div className={[
        styles.control,
        styles[`size-${size}`],
        styles[`variant-${variant}`],
        resolvedError ? styles.invalid : '',
        disabled ? styles.disabled : '',
        className ?? '',
      ].filter(Boolean).join(' ')}>
        <input
          {...rest}
          id={controlId}
          name={name}
          type="time"
          value={resolvedValue}
          defaultValue={resolvedValue === undefined ? defaultValue : undefined}
          step={step ?? (showSeconds ? 1 : 60)}
          required={required}
          disabled={disabled}
          aria-invalid={resolvedError ? true : undefined}
          className={styles.input}
          onChange={(event) => emit(event.target.value)}
        />
        {clearable && currentValue && (
          <button type="button" className={styles.clear} disabled={disabled} aria-label="Clear time" onClick={() => emit('')}>×</button>
        )}
      </div>
    </FieldWrapper>
  );
}
