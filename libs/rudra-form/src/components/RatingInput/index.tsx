import React, { useId, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface RatingInputProps {
  name: string;
  label?: string;
  value?: number;
  defaultValue?: number;
  onChangeValue?: (value: number) => void;
  max?: number;
  step?: 0.5 | 1;
  allowClear?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: ElementSize;
  activeCharacter?: React.ReactNode;
  inactiveCharacter?: React.ReactNode;
  getItemLabel?: (value: number, max: number) => string;
  error?: string;
  className?: string;
}

export default function RatingInput({
  name,
  label,
  value,
  defaultValue = 0,
  onChangeValue,
  max = 5,
  step = 1,
  allowClear = true,
  readOnly = false,
  disabled,
  required,
  size = 'md',
  activeCharacter = '★',
  inactiveCharacter = '☆',
  getItemLabel = (itemValue, maximum) => `${itemValue} out of ${maximum}`,
  error,
  className,
}: RatingInputProps) {
  const form = useRudraForm();
  const generatedId = useId();
  const [hovered, setHovered] = useState<number | null>(null);
  const contextValue = form?.values?.[name];
  const resolvedValue = value ?? (typeof contextValue === 'number' ? contextValue : defaultValue);
  const resolvedError = error ?? form?.errors?.[name];
  const safeMax = Math.max(1, Math.min(20, Math.floor(max)));
  const shownValue = hovered ?? resolvedValue;

  const emit = (next: number) => {
    if (readOnly || disabled) return;
    const normalized = allowClear && resolvedValue === next ? 0 : next;
    form?.handleChange(name, normalized);
    onChangeValue?.(normalized);
  };

  return (
    <FieldWrapper label={label} error={resolvedError} required={required} size={size} className={styles.wrapper}>
      <div
        id={`rudra-rating-${generatedId}`}
        className={[styles.rating, styles[`size-${size}`], readOnly ? styles.readOnly : '', className ?? ''].filter(Boolean).join(' ')}
        role={readOnly ? 'img' : 'radiogroup'}
        aria-label={label ?? 'Rating'}
        aria-readonly={readOnly || undefined}
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: safeMax }, (_, index) => {
          const wholeValue = index + 1;
          const active = shownValue >= wholeValue;
          const halfActive = step === 0.5 && shownValue >= wholeValue - 0.5 && shownValue < wholeValue;
          return (
            <span key={wholeValue} className={styles.item}>
              {step === 0.5 && !readOnly && (
                <button
                  type="button"
                  className={[styles.button, styles.half].join(' ')}
                  role="radio"
                  aria-checked={resolvedValue === wholeValue - 0.5}
                  aria-label={getItemLabel(wholeValue - 0.5, safeMax)}
                  disabled={disabled}
                  onMouseEnter={() => setHovered(wholeValue - 0.5)}
                  onFocus={() => setHovered(wholeValue - 0.5)}
                  onBlur={() => setHovered(null)}
                  onClick={() => emit(wholeValue - 0.5)}
                />
              )}
              <button
                type="button"
                className={styles.button}
                role={readOnly ? undefined : 'radio'}
                aria-checked={readOnly ? undefined : resolvedValue === wholeValue}
                aria-label={getItemLabel(wholeValue, safeMax)}
                disabled={disabled || readOnly}
                tabIndex={readOnly ? -1 : resolvedValue === wholeValue || (resolvedValue === 0 && index === 0) ? 0 : -1}
                onMouseEnter={() => !readOnly && setHovered(wholeValue)}
                onFocus={() => !readOnly && setHovered(wholeValue)}
                onBlur={() => setHovered(null)}
                onClick={() => emit(wholeValue)}
              >
                <span className={active || halfActive ? styles.active : styles.inactive} aria-hidden="true">
                  {active || halfActive ? activeCharacter : inactiveCharacter}
                </span>
              </button>
            </span>
          );
        })}
        <output className={styles.output} aria-live="polite">{resolvedValue} / {safeMax}</output>
      </div>
    </FieldWrapper>
  );
}
