import React, { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

export interface FocusTrapProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  active?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  lockScroll?: boolean;
  initialFocusId?: string;
  onEscape?: () => void /* @type|function|return:void */;
  onDeactivate?: () => void /* @type|function|return:void */;
}

export default function FocusTrap({
  children,
  active = true,
  autoFocus = true,
  restoreFocus = true,
  lockScroll = false,
  initialFocusId,
  onEscape,
  onDeactivate,
  className = '',
  ...props
}: FocusTrapProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    const root = rootRef.current;
    if (!root) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    const getFocusable = () => Array.from(
      root.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter((element) => (
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      (element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement)
    ));

    if (lockScroll) document.body.style.overflow = 'hidden';

    if (autoFocus) {
      const requested = initialFocusId ? document.getElementById(initialFocusId) : null;
      const first = getFocusable()[0];
      queueMicrotask(() => (requested || first || root).focus());
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (lockScroll) document.body.style.overflow = previousOverflow;
      if (restoreFocus && previouslyFocused?.isConnected) previouslyFocused.focus();
      onDeactivate?.();
    };
  }, [
    active,
    autoFocus,
    initialFocusId,
    lockScroll,
    onDeactivate,
    onEscape,
    restoreFocus,
  ]);

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(' ')}
      tabIndex={-1}
      data-focus-trap-active={active || undefined}
      {...props}
    >
      {children}
    </div>
  );
}
