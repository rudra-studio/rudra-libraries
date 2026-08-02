import React from 'react';
import styles from './styles.module.scss';

export type ChipVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ChipVariant /* @select|neutral|primary|success|warning|danger */;
  size?: ChipSize /* @select|sm|md|lg */;
  selected?: boolean;
  disabled?: boolean;
  removable?: boolean;
  removeLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void /* @type|function|return:void|args:event */;
  onRemove?: () => void /* @type|function|return:void */;
}

export default function Chip({
  children = 'Label',
  icon,
  variant = 'neutral',
  size = 'md',
  selected = false,
  disabled = false,
  removable = false,
  removeLabel = 'Remove',
  onClick,
  onRemove,
  className = '',
  ...props
}: ChipProps) {
  const classNames = [
    styles.root,
    styles['variant_' + variant],
    styles['size_' + size],
    selected ? styles.selected : '',
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ');

  const labelContent = (
    <>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span className={styles.label}>{children}</span>
    </>
  );

  return (
    <span className={classNames} aria-disabled={disabled || undefined} {...props}>
      {onClick ? (
        <button
          type="button"
          className={styles.mainAction}
          disabled={disabled}
          aria-pressed={selected}
          onClick={onClick}
        >
          {labelContent}
        </button>
      ) : (
        <span className={styles.content}>{labelContent}</span>
      )}

      {removable && (
        <button
          type="button"
          className={styles.remove}
          disabled={disabled}
          aria-label={removeLabel}
          onClick={() => onRemove?.()}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </span>
  );
}
