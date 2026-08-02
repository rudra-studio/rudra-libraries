import React, { useId } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'prefix'> {
  name: string;
  label?: string;
  variant?: FormVariant;
  size?: ElementSize;
  value?: number | null;
  defaultValue?: number;
  onChangeValue?: (value: number | null) => void;
  error?: string;
  showControls?: boolean;
  clampOnBlur?: boolean;
  allowWheel?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export default function NumberInput({
  name,
  label,
  variant = 'default',
  size = 'md',
  value,
  defaultValue,
  onChangeValue,
  error,
  showControls = true,
  clampOnBlur = true,
  allowWheel = false,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  required,
  className,
  disabled,
  ...rest
}: NumberInputProps) {
  const form = useRudraForm();
  const generatedId = useId();
  const contextValue = form?.values?.[name];
  const resolvedValue = value !== undefined ? value : contextValue;
  const resolvedError = error ?? form?.errors?.[name];
  const controlId = rest.id ?? `rudra-number-${generatedId}`;
  const errorId = resolvedError ? `${controlId}-error` : undefined;

  const emit = (next: number | null) => {
    form?.handleChange(name, next);
    onChangeValue?.(next);
  };

  const parse = (raw: string) => {
    if (raw.trim() === '') return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const clamp = (next: number | null) => {
    if (next === null) return next;
    const minimum = min == null ? undefined : Number(min);
    const maximum = max == null ? undefined : Number(max);
    return Math.min(maximum ?? Number.POSITIVE_INFINITY, Math.max(minimum ?? Number.NEGATIVE_INFINITY, next));
  };

  const changeByStep = (direction: 1 | -1) => {
    if (disabled) return;
    const stepValue = step === 'any' ? 1 : Number(step) || 1;
    const base = typeof resolvedValue === 'number' ? resolvedValue : Number(defaultValue ?? min ?? 0);
    emit(clamp(base + stepValue * direction));
  };

  return (
    <FieldWrapper
      label={label}
      error={resolvedError}
      required={required}
      variant={variant}
      size={size}
      className={styles.wrapper}
    >
      <div className={[
        styles.control,
        styles[`size-${size}`],
        styles[`variant-${variant}`],
        resolvedError ? styles.invalid : '',
        disabled ? styles.disabled : '',
        className ?? '',
      ].filter(Boolean).join(' ')}>
        {prefix != null && <span className={styles.affix}>{prefix}</span>}
        <input
          {...rest}
          id={controlId}
          name={name}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={resolvedValue ?? ''}
          defaultValue={resolvedValue === undefined ? defaultValue : undefined}
          required={required}
          disabled={disabled}
          aria-invalid={resolvedError ? true : undefined}
          aria-describedby={errorId}
          className={styles.input}
          onChange={(event) => emit(parse(event.target.value))}
          onBlur={(event) => {
            if (clampOnBlur) emit(clamp(parse(event.target.value)));
            rest.onBlur?.(event);
          }}
          onWheel={(event) => {
            if (!allowWheel && document.activeElement === event.currentTarget) event.currentTarget.blur();
            rest.onWheel?.(event);
          }}
        />
        {suffix != null && <span className={styles.affix}>{suffix}</span>}
        {showControls && (
          <span className={styles.steppers} aria-hidden={disabled ? true : undefined}>
            <button type="button" tabIndex={-1} disabled={disabled} aria-label="Increase value" onClick={() => changeByStep(1)}>+</button>
            <button type="button" tabIndex={-1} disabled={disabled} aria-label="Decrease value" onClick={() => changeByStep(-1)}>−</button>
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}
