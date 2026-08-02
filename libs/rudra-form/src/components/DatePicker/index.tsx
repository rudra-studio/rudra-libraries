import React, { useId } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type'> {
  name: string; label?: string; value?: string; defaultValue?: string; onChangeValue?: (value: string) => void;
  clearable?: boolean; variant?: FormVariant; size?: ElementSize; error?: string;
}
export default function DatePicker({ name, label, value, defaultValue = '', onChangeValue, clearable = false, variant = 'default', size = 'md', error, required, disabled, className, ...rest }: DatePickerProps) {
  const form = useRudraForm(); const id = useId(); const contextValue = form?.values?.[name]; const resolvedValue = value ?? (contextValue == null ? undefined : String(contextValue)); const current = resolvedValue ?? defaultValue; const resolvedError = error ?? form?.errors?.[name];
  const emit = (next: string) => { form?.handleChange(name, next); onChangeValue?.(next) };
  return <FieldWrapper label={label} error={resolvedError} required={required} variant={variant} size={size} className={styles.wrapper}><div className={[styles.control, styles[`size-${size}`], resolvedError ? styles.invalid : '', disabled ? styles.disabled : '', className ?? ''].filter(Boolean).join(' ')}>
    <input {...rest} id={rest.id ?? `rudra-date-${id}`} name={name} type="date" value={resolvedValue} defaultValue={resolvedValue === undefined ? defaultValue : undefined} required={required} disabled={disabled} aria-invalid={resolvedError ? true : undefined} className={styles.input} onChange={event => emit(event.target.value)} />
    {clearable && current && <button type="button" disabled={disabled} aria-label="Clear date" className={styles.clear} onClick={() => emit('')}>×</button>}
  </div></FieldWrapper>
}
