import React, { useEffect, useRef, useState } from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface HolyGrailLayoutProps {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @nodeFunction */
  header?: React.ReactNode;
  /** @nodeFunction */
  leftNav?: React.ReactNode;
  /** @nodeFunction */
  rightAside?: React.ReactNode;
  /** @nodeFunction */
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function HolyGrailLayout({
  themeMode = 'dark',
  header,
  leftNav,
  rightAside,
  footer,
  className,
  children,
}: HolyGrailLayoutProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [asideOpen, setAsideOpen] = useState(true);
  const navBtnRef = useRef<HTMLButtonElement | null>(null);
  const mainId = React.useId();

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNavOpen(false);
        navBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <div
      data-theme={themeMode}
      className={cn(
        styles.grailRoot,
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

      <header className={cn(styles.grailHeader, 'border-b border-slate-500/20 px-4 py-2 flex items-center justify-between gap-2')}>
        <div className="flex items-center gap-2 min-w-0">
          {leftNav && (
            <button
              ref={navBtnRef}
              type="button"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
              className="lg:hidden px-2.5 py-1.5 rounded-lg border border-slate-500/30 text-xs font-semibold motion-reduce:transition-none"
            >
              Nav
            </button>
          )}
          <div className="min-w-0 flex-1">{header}</div>
        </div>
        {rightAside && (
          <button
            type="button"
            aria-expanded={asideOpen}
            onClick={() => setAsideOpen((v) => !v)}
            className="lg:hidden px-2.5 py-1.5 rounded-lg border border-slate-500/30 text-xs font-semibold motion-reduce:transition-none"
          >
            {asideOpen ? 'Hide Aside' : 'Aside'}
          </button>
        )}
      </header>

      <div className={styles.grailBody}>
        {leftNav && (
          <nav aria-label="Left navigation" className={cn(styles.leftRail, 'border-r border-slate-500/20 p-4')}>
            {leftNav}
          </nav>
        )}

        <main id={mainId} tabIndex={-1} className={cn(styles.centerMain, 'p-4 sm:p-6')}>
          {children}
        </main>

        {rightAside && asideOpen && (
          <aside aria-label="Supplementary aside" className={cn(styles.rightRail, 'border-l border-slate-500/20 p-4')}>
            {rightAside}
          </aside>
        )}
      </div>

      {footer && <footer className="border-t border-slate-500/20 px-4 py-3">{footer}</footer>}

      {leftNav && navOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Left navigation drawer"
          className={styles.mobileDrawerBackdrop}
          onClick={() => {
            setNavOpen(false);
            navBtnRef.current?.focus();
          }}
        >
          <div
            className={cn(
              styles.mobileDrawerPanel,
              themeMode === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-50',
              'p-4'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => {
                  setNavOpen(false);
                  navBtnRef.current?.focus();
                }}
                className="px-2 py-1 rounded border border-slate-500/30 text-xs motion-reduce:transition-none"
              >
                Close
              </button>
            </div>
            {leftNav}
          </div>
        </div>
      )}
    </div>
  );
}

export default HolyGrailLayout;
