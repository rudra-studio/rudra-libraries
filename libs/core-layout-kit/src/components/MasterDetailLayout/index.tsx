import React from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface MasterDetailLayoutProps {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @nodeFunction */
  list?: React.ReactNode;
  /** @nodeFunction */
  detail?: React.ReactNode;
  /** @nodeFunction */
  emptyState?: React.ReactNode;
  selectedId?: string | number | null;
  /** @schema {"type":"string"} */
  listWidth?: string;
  /** @translate */
  backLabel?: string;
  /** @type|function */
  onBack?: () => void;
  className?: string;
}

export function MasterDetailLayout({
  themeMode = 'dark',
  list,
  detail,
  emptyState,
  selectedId = null,
  listWidth = '22rem',
  backLabel = 'Back to list',
  onBack,
  className,
}: MasterDetailLayoutProps) {
  const hasSelection = selectedId !== null && selectedId !== undefined && String(selectedId) !== '';
  const detailContent = hasSelection ? detail : emptyState || detail;

  return (
    <div
      data-theme={themeMode}
      style={{ '--master-list-width': listWidth } as React.CSSProperties}
      className={cn(
        styles.masterDetailWrap,
        themeMode === 'light' ? 'light bg-white text-slate-900' : 'dark bg-slate-950 text-slate-50',
        className
      )}
    >
      <aside
        aria-label="Master list"
        className={cn(styles.masterPane, hasSelection && styles.hideMobile, 'border-r border-slate-500/20 p-3')}
      >
        {list}
      </aside>

      <main aria-label="Detail view" className={cn(styles.detailPane, !hasSelection && styles.hideMobile, 'p-4 sm:p-6')}>
        {hasSelection && onBack && (
          <div className="md:hidden mb-4">
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg border border-slate-500/30 text-xs font-semibold"
            >
              {backLabel}
            </button>
          </div>
        )}
        {detailContent}
      </main>
    </div>
  );
}

export default MasterDetailLayout;
