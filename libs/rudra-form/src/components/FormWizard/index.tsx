import React, { useMemo, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import styles from './styles.module.scss';
export interface FormWizardStep { id: string; title: string; description?: string; content: React.ReactNode; optional?: boolean }
export interface FormWizardProps {
  steps: FormWizardStep[]; currentStep?: number; defaultStep?: number; onStepChange?: (index: number, step: FormWizardStep) => void;
  validateStep?: (index: number, values: Record<string, unknown>) => boolean | string | Promise<boolean | string>;
  onComplete?: (values: Record<string, unknown>) => void | Promise<void>; allowStepNavigation?: boolean;
  nextLabel?: string; previousLabel?: string; completeLabel?: string; busy?: boolean; className?: string;
}
export default function FormWizard({ steps, currentStep, defaultStep = 0, onStepChange, validateStep, onComplete, allowStepNavigation = false, nextLabel = 'Next', previousLabel = 'Previous', completeLabel = 'Complete', busy = false, className }: FormWizardProps) {
  const form = useRudraForm(); const [internal, setInternal] = useState(defaultStep); const [checking, setChecking] = useState(false); const [message, setMessage] = useState(''); const index = Math.max(0, Math.min(steps.length - 1, currentStep ?? internal)); const step = steps[index]; const values = form?.values ?? {};
  const completed = useMemo(() => steps.map((_, stepIndex) => stepIndex < index), [index, steps]);
  if (!step) return null;
  const go = (next: number) => { const safe = Math.max(0, Math.min(steps.length - 1, next)); if (currentStep === undefined) setInternal(safe); onStepChange?.(safe, steps[safe]); setMessage('') };
  const advance = async () => { setChecking(true); setMessage(''); try { const result = await validateStep?.(index, values); if (result === false) { setMessage('Complete the required fields before continuing'); return } if (typeof result === 'string') { setMessage(result); return } if (index === steps.length - 1) await onComplete?.(values); else go(index + 1) } finally { setChecking(false) } };
  return <section className={[styles.wizard, className ?? ''].filter(Boolean).join(' ')} aria-label="Form progress">
    <ol className={styles.steps}>{steps.map((item, stepIndex) => <li key={item.id} className={[stepIndex === index ? styles.current : '', completed[stepIndex] ? styles.complete : ''].filter(Boolean).join(' ')}><button type="button" disabled={!allowStepNavigation || stepIndex > index || busy || checking} aria-current={stepIndex === index ? 'step' : undefined} onClick={() => go(stepIndex)}><span>{completed[stepIndex] ? '✓' : stepIndex + 1}</span><div><b>{item.title}</b>{item.description && <small>{item.description}</small>}</div></button></li>)}</ol>
    <div className={styles.panel} aria-labelledby={`wizard-step-${step.id}`}><header><p>Step {index + 1} of {steps.length}</p><h2 id={`wizard-step-${step.id}`}>{step.title}</h2>{step.description && <div>{step.description}</div>}</header><div className={styles.content}>{step.content}</div>{message && <p className={styles.error} role="alert">{message}</p>}</div>
    <footer className={styles.footer}><button type="button" className={styles.secondary} disabled={index === 0 || busy || checking} onClick={() => go(index - 1)}>{previousLabel}</button><button type={index === steps.length - 1 ? 'submit' : 'button'} className={styles.primary} disabled={busy || checking} onClick={event => { event.preventDefault(); void advance() }}>{checking ? 'Checking…' : index === steps.length - 1 ? completeLabel : nextLabel}</button></footer>
  </section>
}
