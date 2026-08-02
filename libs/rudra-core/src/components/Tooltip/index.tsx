import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './styles.module.scss';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  children?: React.ReactNode;
  content?: React.ReactNode;
  placement?: TooltipPlacement /* @select|top|right|bottom|left */;
  open?: boolean;
  defaultOpen?: boolean;
  delay?: number;
  closeDelay?: number;
  disabled?: boolean;
  maxWidth?: number;
  onOpenChange?: (open: boolean) => void /* @type|function|return:void|args:open */;
}

export default function Tooltip({
  children = 'Hover or focus me',
  content = 'Helpful information',
  placement = 'top',
  open,
  defaultOpen = false,
  delay = 350,
  closeDelay = 80,
  disabled = false,
  maxWidth = 280,
  onOpenChange,
  className = '',
  ...props
}: TooltipProps) {
  const tooltipId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? Boolean(open) : internalOpen;

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const scheduleOpen = () => {
    if (disabled) return;
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), Math.max(0, delay));
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), Math.max(0, closeDelay));
  };

  return (
    <span
      className={[styles.root, className].filter(Boolean).join(' ')}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={scheduleOpen}
      onBlur={scheduleClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          clearTimers();
          setOpen(false);
        }
      }}
      aria-describedby={isOpen ? tooltipId : undefined}
      {...props}
    >
      <span className={styles.trigger}>{children}</span>
      {isOpen && !disabled && content && (
        <span
          id={tooltipId}
          role="tooltip"
          className={[styles.tooltip, styles['placement_' + placement]].join(' ')}
          style={{ maxWidth }}
        >
          {content}
          <span className={styles.arrow} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
