import React from 'react';
import styles from './styles.module.scss';

export type VisuallyHiddenElement = 'span' | 'div' | 'p' | 'a';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  as?: VisuallyHiddenElement /* @select|span|div|p|a */;
  revealOnFocus?: boolean;
  href?: string;
}

export default function VisuallyHidden({
  children = 'Additional accessible information',
  as = 'span',
  revealOnFocus = false,
  href,
  className = '',
  ...props
}: VisuallyHiddenProps) {
  return React.createElement(
    as,
    {
      className: [
        styles.root,
        revealOnFocus ? styles.revealOnFocus : '',
        className,
      ].filter(Boolean).join(' '),
      ...(as === 'a' && href ? { href } : {}),
      ...props,
    },
    children,
  );
}
