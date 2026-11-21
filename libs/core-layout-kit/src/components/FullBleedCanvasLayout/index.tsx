import React, { useState } from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface FullBleedCanvasLayoutProps {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @nodeFunction */
  toolbar?: React.ReactNode;
  /** @nodeFunction */
  leftPanel?: React.ReactNode;
  /** @nodeFunction */
  rightInspector?: React.ReactNode;
  /** @nodeFunction */
  canvas?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function FullBleedCanvasLayout({
  themeMode = 'dark',
  toolbar,
  leftPanel,
  rightInspector,
  canvas,
  className,
  children,
}: FullBleedCanvasLayoutProps) {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const mainId = React.useId();

  return (
    <div
      data-theme={themeMode}
      className={cn(
        styles.canvasRoot,
        themeMode === 'light' ? 'light bg-slate-100 text-slate-900' : 'dark bg-slate-950 text-slate-50',
        className
      )}
    >
      <a
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--z-toast,60)] px-3 py-2 rounded-lg text-xs font-semibold"
      >
        Skip to main content
      </a>

      <header className="border-b border-slate-500/20 px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {leftPanel && (
            <button
              type="button"
              aria-expanded={showLeft}
              onClick={() => setShowLeft((v) => !v)}
              className="px-2.5 py-1 rounded border border-slate-500/30 text-xs font-semibold motion-reduce:transition-none"
            >
              {showLeft ? 'Hide Panel' : 'Panel'}
            </button>
          )}
          <div className="min-w-0 flex-1">{toolbar}</div>
        </div>
        {rightInspector && (
          <button
            type="button"
            aria-expanded={showRight}
            onClick={() => setShowRight((v) => !v)}
            className="px-2.5 py-1 rounded border border-slate-500/30 text-xs font-semibold motion-reduce:transition-none"
          >
            {showRight ? 'Hide Inspector' : 'Inspector'}
          </button>
        )}
      </header>

      <div className={styles.canvasBody}>
        {leftPanel && showLeft && (
          <aside
            aria-label="Left panel"
            className={cn(
              styles.panelRail,
              'border-r border-slate-500/20 p-3',
              themeMode === 'light' ? 'bg-white' : 'bg-slate-900'
            )}
          >
            {leftPanel}
          </aside>
        )}

        <main id={mainId} tabIndex={-1} className={styles.canvasStage}>
          {canvas || children}
        </main>

        {rightInspector && showRight && (
          <aside
            aria-label="Right inspector"
            className={cn(
              styles.inspectorRail,
              'border-l border-slate-500/20 p-3',
              themeMode === 'light' ? 'bg-white' : 'bg-slate-900'
            )}
          >
            {rightInspector}
          </aside>
        )}
      </div>
    </div>
  );
}

export default FullBleedCanvasLayout;
