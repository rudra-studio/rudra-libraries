import React from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface AuthLayoutProps {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @nodeFunction */
  logo?: React.ReactNode;
  /** @nodeFunction */
  card?: React.ReactNode;
  /** @nodeFunction */
  footer?: React.ReactNode;
  /** @nodeFunction */
  splitVisual?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function AuthLayout({
  themeMode = 'dark',
  logo,
  card,
  footer,
  splitVisual,
  className,
  children,
}: AuthLayoutProps) {
  const mainId = React.useId();
  const hasSplit = Boolean(splitVisual);

  return (
    <div
      data-theme={themeMode}
      className={cn(
        styles.authSplitGrid,
        hasSplit && styles.hasSplit,
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

      {hasSplit && (
        <aside
          aria-label="Brand visual panel"
          className="hidden lg:flex flex-col justify-between p-8 border-r border-slate-500/20 min-w-0"
        >
          {splitVisual}
        </aside>
      )}

      <main
        id={mainId}
        tabIndex={-1}
        className="min-h-dvh flex flex-col justify-between items-center p-4 sm:p-8 min-w-0"
      >
        <div className="w-full max-w-md flex justify-center pt-2">{logo}</div>

        <div className="w-full max-w-md my-auto py-6 min-w-0">
          {card || children}
        </div>

        <footer className="w-full max-w-md text-center pb-2">{footer}</footer>
      </main>
    </div>
  );
}

export default AuthLayout;
