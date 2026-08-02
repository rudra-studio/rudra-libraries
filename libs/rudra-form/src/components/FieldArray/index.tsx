import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper from '../FieldWrapper';
import styles from './styles.module.scss';

export interface FieldArrayRenderActions<T> { update: (value: T) => void; remove: () => void; moveUp: () => void; moveDown: () => void }
export interface FieldArrayProps<T = Record<string, unknown>> {
  name: string; label?: string; value?: T[]; defaultValue?: T[]; onChangeValue?: (value: T[]) => void;
  createItem?: () => T; renderItem?: (item: T, index: number, actions: FieldArrayRenderActions<T>) => React.ReactNode;
  minItems?: number; maxItems?: number; addLabel?: string; emptyMessage?: string; disabled?: boolean; error?: string; className?: string;
}
export default function FieldArray<T = Record<string, unknown>>({ name, label, value, defaultValue = [], onChangeValue, createItem = () => ({} as T), renderItem = () => null, minItems = 0, maxItems = 100, addLabel = 'Add item', emptyMessage = 'No items added', disabled, error, className }: FieldArrayProps<T>) {
  const form = useRudraForm(); const contextValue = form?.values?.[name]; const items = value ?? (Array.isArray(contextValue) ? contextValue : defaultValue); const resolvedError = error ?? form?.errors?.[name];
  const emit = (next: T[]) => { form?.handleChange(name, next); onChangeValue?.(next) };
  const update = (index: number, next: T) => emit(items.map((item, itemIndex) => itemIndex === index ? next : item));
  const remove = (index: number) => { if (items.length <= minItems) return; emit(items.filter((_, itemIndex) => itemIndex !== index)) };
  const move = (from: number, to: number) => { if (to < 0 || to >= items.length) return; const next = items.slice(); const [item] = next.splice(from, 1); next.splice(to, 0, item); emit(next) };
  return <FieldWrapper label={label} error={resolvedError} className={styles.wrapper}>
    <div className={[styles.root, resolvedError ? styles.invalid : '', className ?? ''].filter(Boolean).join(' ')}>
      <div className={styles.list}>
        {items.map((item, index) => <section key={index} className={styles.item} aria-label={`Item ${index + 1}`}>
          <div className={styles.itemHeader}><span>{index + 1}</span><div className={styles.actions}>
            <button type="button" disabled={disabled || index === 0} aria-label={`Move item ${index + 1} up`} onClick={() => move(index, index - 1)}>↑</button>
            <button type="button" disabled={disabled || index === items.length - 1} aria-label={`Move item ${index + 1} down`} onClick={() => move(index, index + 1)}>↓</button>
            <button type="button" disabled={disabled || items.length <= minItems} aria-label={`Remove item ${index + 1}`} onClick={() => remove(index)}>×</button>
          </div></div>
          <div className={styles.content}>{renderItem(item, index, { update: (next) => update(index, next), remove: () => remove(index), moveUp: () => move(index, index - 1), moveDown: () => move(index, index + 1) })}</div>
        </section>)}
        {items.length === 0 && <div className={styles.empty}>{emptyMessage}</div>}
      </div>
      <button type="button" className={styles.add} disabled={disabled || items.length >= maxItems} onClick={() => emit([...items, createItem()])}>+ {addLabel}</button>
    </div>
  </FieldWrapper>
}
