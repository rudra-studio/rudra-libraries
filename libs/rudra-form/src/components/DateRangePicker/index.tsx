import React, { useId } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface DateRangeValue { start: string; end: string }
export interface DateRangePickerProps {
  name: string; label?: string; value?: DateRangeValue; defaultValue?: DateRangeValue; onChangeValue?: (value: DateRangeValue) => void;
  min?: string; max?: string; startLabel?: string; endLabel?: string; allowSameDay?: boolean; clearable?: boolean;
  variant?: FormVariant; size?: ElementSize; required?: boolean; disabled?: boolean; error?: string; className?: string;
}
export default function DateRangePicker({ name, label, value, defaultValue = { start: '', end: '' }, onChangeValue, min, max, startLabel = 'Start date', endLabel = 'End date', allowSameDay = true, clearable = false, variant = 'default', size = 'md', required, disabled, error, className }: DateRangePickerProps) {
  const form = useRudraForm(); const id = useId(); const contextValue = form?.values?.[name]; const range = value ?? (contextValue && typeof contextValue === 'object' ? contextValue : defaultValue); const orderError = range.start && range.end && (allowSameDay ? range.end < range.start : range.end <= range.start) ? 'End date must be after start date' : ''; const resolvedError = error ?? form?.errors?.[name] ?? orderError;
  const emit = (next: DateRangeValue) => { form?.handleChange(name, next); onChangeValue?.(next) };
  return <FieldWrapper label={label} error={resolvedError} required={required} variant={variant} size={size} className={styles.wrapper}>
    <div className={[styles.range, styles[`size-${size}`], resolvedError ? styles.invalid : '', disabled ? styles.disabled : '', className ?? ''].filter(Boolean).join(' ')}>
      <label className={styles.field}><span>{startLabel}</span><input id={`rudra-range-start-${id}`} type="date" value={range.start ?? ''} min={min} max={range.end || max} required={required} disabled={disabled} aria-invalid={resolvedError ? true : undefined} onChange={event => emit({ ...range, start: event.target.value })} /></label>
      <span className={styles.separator} aria-hidden="true">→</span>
      <label className={styles.field}><span>{endLabel}</span><input id={`rudra-range-end-${id}`} type="date" value={range.end ?? ''} min={range.start || min} max={max} required={required} disabled={disabled} aria-invalid={resolvedError ? true : undefined} onChange={event => emit({ ...range, end: event.target.value })} /></label>
      {clearable && (range.start || range.end) && <button type="button" className={styles.clear} disabled={disabled} aria-label="Clear date range" onClick={() => emit({ start: '', end: '' })}>×</button>}
    </div>
  </FieldWrapper>
}
