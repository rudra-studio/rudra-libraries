import React, { useEffect, useRef, useState } from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface AppShellProps {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @nodeFunction */
  header?: React.ReactNode;
  /** @nodeFunction */
  sidebar?: React.ReactNode;
  /** @nodeFunction */
  footer?: React.ReactNode;
  /** @schema {"type":"boolean"} */
  collapsible?: boolean;
  /** @schema {"type":"boolean"} */
  defaultCollapsed?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function AppShell({
  themeMode = 'dark',
  header,
  sidebar,
  footer,
  collapsible = true,
  defaultCollapsed = false,
  className,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const mainId = React.useId();
  const sidebarId = React.useId();

  useEffect(() => {
    if (!mobileOpen) return;
    drawerCloseRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const closeMobileDrawer = () => {
    setMobileOpen(false);
    mobileToggleRef.current?.focus();
  };

  return (
    <div
      data-theme={themeMode}
      className={cn(
        styles.shellRoot,
        'h-dvh w-full overflow-hidden',
        themeMode === 'light' ? 'light bg-slate-50 text-slate-900' : 'dark bg-slate-950 text-slate-50',
        className
      )}
    >
      <a
        href={`#${mainId}`}
        className={cn(
          styles.skipLink,
          'sr-only focus:not-sr-only focus:outline-2 focus:outline-indigo-500',
          themeMode === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
        )}
      >
        Skip to main content
      </a>

      <header className={cn(styles.headerBar, 'border-b border-slate-500/20')}>
        <div className="flex items-center gap-2 min-w-0">
          {sidebar && (
            <button
              ref={mobileToggleRef}
              type="button"
              aria-label="Toggle navigation drawer"
              aria-expanded={mobileOpen}
              aria-controls={sidebarId}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden px-2.5 py-1.5 rounded-lg border border-slate-500/30 text-sm font-medium motion-reduce:transition-none"
            >
              Menu
            </button>
          )}
          {sidebar && collapsible && (
            <button
              type="button"
              aria-label="Toggle sidebar width"
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed((c) => !c)}
              className="hidden lg:inline-flex px-2.5 py-1.5 rounded-lg border border-slate-500/30 text-xs font-medium motion-reduce:transition-none"
            >
              {collapsed ? 'Expand' : 'Collapse'}
            </button>
          )}
          <div className="min-w-0 flex-1">{header}</div>
        </div>
      </header>

      {sidebar && (
        <nav
          id={sidebarId}
          aria-label="Primary sidebar"
          className={cn(
            styles.sidebarDesktop,
            collapsed && styles.sidebarCollapsed,
            'border-r border-slate-500/20'
          )}
        >
          {sidebar}
        </nav>
      )}

      <div className={styles.mainPane}>
        <main id={mainId} tabIndex={-1} className={cn(styles.mainContent, 'p-4 sm:p-6')}>
          {children}
        </main>
        {footer && <footer className="border-t border-slate-500/20 px-4 py-3">{footer}</footer>}
      </div>

      {sidebar && mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={styles.drawerBackdrop}
          onClick={closeMobileDrawer}
        >
          <div
            className={cn(
              styles.drawerPanel,
              themeMode === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-50'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-500/20">
              <span className="text-xs font-semibold uppercase tracking-wider">Navigation</span>
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={closeMobileDrawer}
                className="px-2 py-1 rounded border border-slate-500/30 text-xs motion-reduce:transition-none"
              >
                Close
              </button>
            </div>
            <div className="p-3">{sidebar}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppShell;
