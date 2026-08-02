import React from 'react';
import styles from './styles.module.scss';

export type CardVariant = 'outlined' | 'elevated' | 'filled' | 'glass';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardOrientation = 'vertical' | 'horizontal';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  media?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: CardVariant /* @select|outlined|elevated|filled|glass */;
  padding?: CardPadding /* @select|none|sm|md|lg */;
  orientation?: CardOrientation /* @select|vertical|horizontal */;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void /* @type|function|return:void|args:event */;
}

export default function Card({
  children,
  header,
  footer,
  media,
  actions,
  variant = 'outlined',
  padding = 'md',
  orientation = 'vertical',
  interactive = false,
  selected = false,
  disabled = false,
  className = '',
  onClick,
  onKeyDown,
  tabIndex,
  role,
  ...props
}: CardProps) {
  const isInteractive = interactive || Boolean(onClick);
  const rootClassName = [
    styles.root,
    styles['variant_' + variant],
    styles['padding_' + padding],
    styles['orientation_' + orientation],
    isInteractive ? styles.interactive : '',
    selected ? styles.selected : '',
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ');

  const activateFromKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      disabled ||
      !isInteractive ||
      (event.key !== 'Enter' && event.key !== ' ')
    ) {
      return;
    }
    event.preventDefault();
    event.currentTarget.click();
  };

  return (
    <div
      className={rootClassName}
      role={role || (isInteractive ? 'button' : undefined)}
      tabIndex={disabled ? -1 : (isInteractive ? (tabIndex ?? 0) : tabIndex)}
      aria-disabled={disabled || undefined}
      aria-selected={selected || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={activateFromKeyboard}
      {...props}
    >
      {media && <div className={styles.media}>{media}</div>}

      <div className={styles.content}>
        {header && <div className={styles.header}>{header}</div>}
        {children && <div className={styles.body}>{children}</div>}
        {(footer || actions) && (
          <div className={styles.footer}>
            {footer && <div className={styles.footerContent}>{footer}</div>}
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
