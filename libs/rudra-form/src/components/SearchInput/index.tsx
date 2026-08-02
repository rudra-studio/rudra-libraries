import React, { useEffect, useId, useRef } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type'> {
  name: string;
  label?: string;
  variant?: FormVariant;
  size?: ElementSize;
  value?: string;
  defaultValue?: string;
  onChangeValue?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  searchAsYouType?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
  leadingContent?: React.ReactNode;
  error?: string;
}

export default function SearchInput({
  name,
  label,
  variant = 'default',
  size = 'md',
  value,
  defaultValue = '',
  onChangeValue,
  onSearch,
  debounceMs = 300,
  searchAsYouType = false,
  clearable = true,
  onClear,
  loading = false,
  leadingContent,
  error,
  required,
  className,
  disabled,
  ...rest
}: SearchInputProps) {
  const form = useRudraForm();
  const generatedId = useId();
  const contextValue = form?.values?.[name];
  const resolvedValue = value ?? (contextValue == null ? undefined : String(contextValue));
  const currentValue = resolvedValue ?? defaultValue;
  const resolvedError = error ?? form?.errors?.[name];
  const controlId = rest.id ?? `rudra-search-${generatedId}`;
  const errorId = resolvedError ? `${controlId}-error` : undefined;
  const searchRef = useRef(onSearch);
  searchRef.current = onSearch;

  useEffect(() => {
    if (!searchAsYouType || !searchRef.current) return;
    const timeout = window.setTimeout(() => searchRef.current?.(currentValue), Math.max(0, debounceMs));
    return () => window.clearTimeout(timeout);
  }, [currentValue, debounceMs, searchAsYouType]);

  const emit = (nextValue: string) => {
    form?.handleChange(name, nextValue);
    onChangeValue?.(nextValue);
  };

  const clear = () => {
    emit('');
    onClear?.();
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
        <span className={styles.leading} aria-hidden={leadingContent == null ? true : undefined}>
          {leadingContent ?? <span className={styles.magnifier} />}
        </span>
        <input
          {...rest}
          id={controlId}
          name={name}
          type="search"
          value={resolvedValue}
          defaultValue={resolvedValue === undefined ? defaultValue : undefined}
          required={required}
          disabled={disabled}
          aria-invalid={resolvedError ? true : undefined}
          aria-describedby={errorId}
          aria-busy={loading || undefined}
          className={styles.input}
          onChange={(event) => emit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSearch?.(event.currentTarget.value);
            rest.onKeyDown?.(event);
          }}
        />
        {loading && <span className={styles.spinner} role="status" aria-label="Searching" />}
        {clearable && currentValue && !loading && (
          <button type="button" className={styles.clear} aria-label="Clear search" disabled={disabled} onClick={clear}>×</button>
        )}
      </div>
    </FieldWrapper>
  );
}
