import React, { useId } from 'react';
import styles from './styles.module.scss';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type AlertAppearance = 'soft' | 'outlined' | 'solid';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: AlertVariant /* @select|info|success|warning|error|neutral */;
  appearance?: AlertAppearance /* @select|soft|outlined|solid */;
  dismissible?: boolean;
  closeLabel?: string;
  live?: 'off' | 'polite' | 'assertive' /* @select|off|polite|assertive */;
  onDismiss?: () => void /* @type|function|return:void */;
}

export default function Alert({
  title,
  children = 'Important information is available.',
  icon,
  action,
  variant = 'info',
  appearance = 'soft',
  dismissible = false,
  closeLabel = 'Dismiss notification',
  live,
  onDismiss,
  className = '',
  role,
  ...props
}: AlertProps) {
  const titleId = useId();
  const bodyId = useId();
  const resolvedRole = role || (variant === 'error' || variant === 'warning' ? 'alert' : 'status');
  const resolvedLive = live === 'off'
    ? undefined
    : (live || (resolvedRole === 'alert' ? 'assertive' : 'polite'));

  const classNames = [
    styles.root,
    styles['variant_' + variant],
    styles['appearance_' + appearance],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      role={resolvedRole}
      aria-live={resolvedLive}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={children ? bodyId : undefined}
      {...props}
    >
      {icon && <div className={styles.icon} aria-hidden="true">{icon}</div>}

      <div className={styles.content}>
        {title && <div id={titleId} className={styles.title}>{title}</div>}
        {children && <div id={bodyId} className={styles.body}>{children}</div>}
      </div>

      {action && <div className={styles.action}>{action}</div>}

      {dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={closeLabel}
          onClick={() => onDismiss?.()}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}
