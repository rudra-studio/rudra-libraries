import React, { useId, useMemo, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss'; 

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'prefix'> {
  name: string;
  label?: string;
  variant?: FormVariant;
  size?: ElementSize;
  value?: number | null;
  defaultValue?: number;
  onChangeValue?: (value: number | null) => void;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  allowNegative?: boolean;
  clampOnBlur?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
}

export default function CurrencyInput({
  name,
  label,
  variant = 'default',
  size = 'md',
  value,
  defaultValue,
  onChangeValue,
  currency = 'USD',
  locale,
  minimumFractionDigits,
  maximumFractionDigits = 2,
  allowNegative = false,
  clampOnBlur = true,
  prefix,
  suffix,
  error,
  min,
  max,
  required,
  className,
  disabled,
  ...rest
}: CurrencyInputProps) {
  const form = useRudraForm();
  const generatedId = useId();
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState('');
  const contextValue = form?.values?.[name];
  const resolvedValue = value !== undefined ? value : (typeof contextValue === 'number' ? contextValue : contextValue == null ? undefined : Number(contextValue));
  const numericValue = Number.isFinite(resolvedValue) ? resolvedValue as number : null;
  const resolvedError = error ?? form?.errors?.[name];
  const controlId = rest.id ?? `rudra-currency-${generatedId}`;
  const errorId = resolvedError ? `${controlId}-error` : undefined;

  const formatter = useMemo(() => new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }), [currency, locale, maximumFractionDigits, minimumFractionDigits]);

  const decimalSymbol = useMemo(() => {
    return new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === 'decimal')?.value ?? '.';
  }, [locale]);

  const format = (next: number | null) => next == null ? '' : formatter.format(next);
  const editable = (next: number | null) => next == null ? '' : String(next).replace('.', decimalSymbol);

  const parse = (raw: string) => {
    const normalized = raw
      .replace(new RegExp(`[^0-9${decimalSymbol === '.' ? '\\.' : decimalSymbol}-]`, 'g'), '')
      .replace(decimalSymbol, '.');
    if (normalized === '' || normalized === '-' || normalized === '.') return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const clamp = (next: number | null) => {
    if (next === null) return next;
    const minimum = min == null ? undefined : Number(min);
    const maximum = max == null ? undefined : Number(max);
    const lowerBound = allowNegative ? minimum ?? Number.NEGATIVE_INFINITY : Math.max(0, minimum ?? 0);
    return Math.min(maximum ?? Number.POSITIVE_INFINITY, Math.max(lowerBound, next));
  };

  const emit = (next: number | null) => {
    form?.handleChange(name, next);
    onChangeValue?.(next);
  };

  const displayValue = focused ? draft : format(numericValue ?? (resolvedValue === undefined ? defaultValue ?? null : null));

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
          type="text"
          inputMode="decimal"
          value={displayValue}
          required={required}
          disabled={disabled}
          aria-invalid={resolvedError ? true : undefined}
          aria-describedby={errorId}
          className={styles.input}
          onFocus={(event) => {
            setFocused(true);
            setDraft(editable(numericValue ?? (resolvedValue === undefined ? defaultValue ?? null : null)));
            rest.onFocus?.(event);
          }}
          onChange={(event) => {
            const raw = event.target.value;
            if (!allowNegative && raw.includes('-')) return;
            setDraft(raw);
            emit(parse(raw));
          }}
          onBlur={(event) => {
            const next = parse(draft);
            emit(clampOnBlur ? clamp(next) : next);
            setFocused(false);
            rest.onBlur?.(event);
          }}
        />
        {suffix != null && <span className={styles.affix}>{suffix}</span>}
        <span className={styles.code} aria-label={`Currency ${currency}`}>{currency}</span>
      </div>
    </FieldWrapper>
  );
}
