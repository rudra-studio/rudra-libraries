import React, { useEffect, useId, useMemo, useRef } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface OTPInputProps {
  name: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChangeValue?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  numericOnly?: boolean;
  masked?: boolean;
  autoFocus?: boolean;
  size?: ElementSize;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  inputLabel?: (index: number) => string;
}

export default function OTPInput({
  name,
  label,
  value,
  defaultValue = '',
  onChangeValue,
  onComplete,
  length = 6,
  numericOnly = true,
  masked = false,
  autoFocus = false,
  size = 'md',
  required,
  disabled,
  error,
  className,
  inputLabel = (index) => `Digit ${index + 1} of verification code`,
}: OTPInputProps) {
  const form = useRudraForm();
  const generatedId = useId();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const contextValue = form?.values?.[name];
  const resolvedValue = value ?? (contextValue == null ? defaultValue : String(contextValue));
  const resolvedError = error ?? form?.errors?.[name];
  const safeLength = Math.max(1, Math.min(12, Math.floor(length)));
  const characters = useMemo(() => Array.from({ length: safeLength }, (_, index) => resolvedValue[index] ?? ''), [resolvedValue, safeLength]);

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus();
  }, [autoFocus]);

  const sanitize = (raw: string) => {
    const filtered = numericOnly ? raw.replace(/\D/g, '') : raw.replace(/\s/g, '');
    return filtered.slice(0, safeLength);
  };

  const emit = (next: string) => {
    form?.handleChange(name, next);
    onChangeValue?.(next);
    if (next.length === safeLength) onComplete?.(next);
  };

  const setAt = (index: number, raw: string) => {
    const incoming = sanitize(raw);
    if (!incoming) return;
    const next = characters.slice();
    incoming.split('').forEach((character, offset) => {
      if (index + offset < safeLength) next[index + offset] = character;
    });
    const joined = next.join('');
    emit(joined);
    inputs.current[Math.min(index + incoming.length, safeLength - 1)]?.focus();
  };

  const removeAt = (index: number) => {
    const next = characters.slice();
    next[index] = '';
    emit(next.join(''));
  };

  return (
    <FieldWrapper label={label} error={resolvedError} required={required} size={size} className={styles.wrapper}>
      <div
        id={`rudra-otp-${generatedId}`}
        className={[styles.group, styles[`size-${size}`], resolvedError ? styles.invalid : '', className ?? ''].filter(Boolean).join(' ')}
        role="group"
        aria-label={label ?? 'Verification code'}
        aria-invalid={resolvedError ? true : undefined}
      >
        {characters.map((character, index) => (
          <input
            key={index}
            ref={(node) => { inputs.current[index] = node; }}
            name={`${name}-${index}`}
            type={masked ? 'password' : 'text'}
            inputMode={numericOnly ? 'numeric' : 'text'}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            value={character}
            maxLength={safeLength}
            required={required}
            disabled={disabled}
            aria-label={inputLabel(index)}
            className={styles.cell}
            onChange={(event) => {
              if (event.target.value === '') removeAt(index);
              else setAt(index, event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !character && index > 0) {
                removeAt(index - 1);
                inputs.current[index - 1]?.focus();
              } else if (event.key === 'ArrowLeft') {
                inputs.current[Math.max(0, index - 1)]?.focus();
              } else if (event.key === 'ArrowRight') {
                inputs.current[Math.min(safeLength - 1, index + 1)]?.focus();
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              setAt(index, event.clipboardData.getData('text'));
            }}
          />
        ))}
      </div>
    </FieldWrapper>
  );
}
