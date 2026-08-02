import React from 'react';
import styles from './styles.module.scss';

export type KeyboardHintSize = 'sm' | 'md' | 'lg';

export interface KeyboardHintProps extends React.HTMLAttributes<HTMLElement> {
  keys?: string[];
  separator?: string;
  size?: KeyboardHintSize /* @select|sm|md|lg */;
  label?: string;
}

export default function KeyboardHint({
  keys = ['Ctrl', 'K'],
  separator = '+',
  size = 'md',
  label,
  className = '',
  ...props
}: KeyboardHintProps) {
  const normalizedKeys = keys.map((key) => String(key).trim()).filter(Boolean);
  const accessibleLabel = label || normalizedKeys.join(' ' + separator + ' ');

  return (
    <kbd
      className={[
        styles.root,
        styles['size_' + size],
        className,
      ].filter(Boolean).join(' ')}
      aria-label={accessibleLabel}
      {...props}
    >
      {normalizedKeys.map((key, index) => (
        <React.Fragment key={key + index}>
          {index > 0 && <span className={styles.separator} aria-hidden="true">{separator}</span>}
          <span className={styles.key}>{key}</span>
        </React.Fragment>
      ))}
    </kbd>
  );
}
