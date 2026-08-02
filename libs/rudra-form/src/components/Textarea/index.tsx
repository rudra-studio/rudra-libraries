import React, { useEffect, useId, useRef } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'size' | 'value' | 'defaultValue' | 'onChange'> {
  name: string;
  label?: string;
  variant?: FormVariant;
  size?: ElementSize;
  value?: string;
  defaultValue?: string;
  onChangeValue?: (value: string) => void;
  error?: string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  showCount?: boolean;
}

export default function Textarea({
  name,
  label,
  variant = 'default',
  size = 'md',
  value,
  defaultValue = '',
  onChangeValue,
  error,
  autoResize = false,
  minRows = 3,
  maxRows = 12,
  showCount = false,
  required,
  maxLength,
  className,
  disabled,
  ...rest
}: TextareaProps) {
  const form = useRudraForm();
  const generatedId = useId();
  const localRef = useRef<HTMLTextAreaElement>(null);

  const contextValue = form?.values?.[name];
  const resolvedValue = value ?? (contextValue == null ? undefined : String(contextValue));
  const resolvedError = error ?? form?.errors?.[name];
  const controlId = rest.id ?? `rudra-textarea-${generatedId}`;
  const errorId = resolvedError ? `${controlId}-error` : undefined;
  const count = resolvedValue?.length ?? defaultValue.length;

  useEffect(() => {
    if (!autoResize || !localRef.current) return;
    const node = localRef.current;
    const lineHeight = Number.parseFloat(getComputedStyle(node).lineHeight) || 20;
    node.style.height = 'auto';
    node.style.height = `${Math.min(Math.max(node.scrollHeight, lineHeight * minRows), lineHeight * maxRows)}px`;
    node.style.overflowY = node.scrollHeight > lineHeight * maxRows ? 'auto' : 'hidden';
  }, [autoResize, maxRows, minRows, resolvedValue]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    form?.handleChange(name, nextValue);
    onChangeValue?.(nextValue);
    rest.onInput?.(event);
  };

  const controlClassName = [
    styles.textarea,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    autoResize ? styles.autoResize : '',
    resolvedError ? styles.invalid : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <FieldWrapper
      label={label}
      error={resolvedError}
      required={required}
      variant={variant}
      size={size}
      className={styles.wrapper}
    >
      <textarea
        {...rest}
        ref={localRef}
        id={controlId}
        name={name}
        rows={minRows}
        value={resolvedValue}
        defaultValue={resolvedValue === undefined ? defaultValue : undefined}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={resolvedError ? true : undefined}
        aria-describedby={errorId}
        className={controlClassName}
        onChange={handleChange}
      />
      {showCount && (
        <span className={styles.count} aria-live="polite">
          {count}{typeof maxLength === 'number' ? ` / ${maxLength}` : ''}
        </span>
      )}
    </FieldWrapper>
  );
}
