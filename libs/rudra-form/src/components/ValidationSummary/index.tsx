import React from 'react';
import { useRudraForm } from '../RudraFormContext';
import styles from './styles.module.scss';
export interface ValidationSummaryProps {
  title?: string; errors?: Record<string, string>; fieldLabels?: Record<string, string>; focusFieldOnClick?: boolean;
  live?: 'off' | 'polite' | 'assertive'; className?: string; emptyContent?: React.ReactNode;
}
export default function ValidationSummary({ title = 'Please correct the following fields', errors, fieldLabels = {}, focusFieldOnClick = true, live = 'polite', className, emptyContent = null }: ValidationSummaryProps) {
  const form = useRudraForm(); const resolvedErrors = errors ?? form?.errors ?? {}; const entries = Object.entries(resolvedErrors).filter(([, message]) => Boolean(message));
  if (entries.length === 0) return <>{emptyContent}</>;
  const focus = (name: string) => { if (!focusFieldOnClick) return; const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(name) : name.replace(/"/g, '\\"'); const target = document.querySelector<HTMLElement>(`[name="${escaped}"]`); target?.focus(); target?.scrollIntoView({ behavior: 'smooth', block: 'center' }) };
  return <section className={[styles.summary, className ?? ''].filter(Boolean).join(' ')} role="alert" aria-live={live}><h2>{title}</h2><ul>{entries.map(([name, message]) => <li key={name}>{focusFieldOnClick ? <button type="button" onClick={() => focus(name)}><strong>{fieldLabels[name] ?? name}:</strong> {message}</button> : <span><strong>{fieldLabels[name] ?? name}:</strong> {message}</span>}</li>)}</ul></section>
}
