import React from 'react';
import { Container, type ContainerProps } from '../Container';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface SingleColumnLayoutProps {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @nodeFunction */
  header?: React.ReactNode;
  /** @nodeFunction */
  footer?: React.ReactNode;
  /** @select|sm|md|lg|xl|full */
  maxWidth?: ContainerProps['size'];
  className?: string;
  children?: React.ReactNode;
}

export function SingleColumnLayout({
  themeMode = 'dark',
  header,
  footer,
  maxWidth = 'lg',
  className,
  children,
}: SingleColumnLayoutProps) {
  const mainId = React.useId();

  return (
    <div
      data-theme={themeMode}
      className={cn(
        styles.singleColRoot,
        themeMode === 'light' ? 'light bg-slate-50 text-slate-900' : 'dark bg-slate-950 text-slate-50',
        className
      )}
    >
      <a
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--z-toast,60)] px-3 py-2 rounded-lg text-xs font-semibold"
      >
        Skip to main content
      </a>

      {header && <header className="border-b border-slate-500/20">{header}</header>}

      <main id={mainId} tabIndex={-1} className={cn(styles.singleColMain, 'py-6 sm:py-8')}>
        <Container themeMode={themeMode} size={maxWidth} padding="lg">
          {children}
        </Container>
      </main>

      {footer && <footer className="border-t border-slate-500/20">{footer}</footer>}
    </div>
  );
}

export default SingleColumnLayout;
