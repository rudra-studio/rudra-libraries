import React from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface BentoGridLayoutProps {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @schema {"type":"number"} */
  columns?: number;
  /** @select|none|sm|md|lg */
  gap?: 'none' | 'sm' | 'md' | 'lg';
  /** @schema {"type":"boolean"} */
  dense?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const BENTO_GAP_CLASSES: Record<NonNullable<BentoGridLayoutProps['gap']>, string> = {
  none: 'gap-0',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export interface BentoItemProps {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|1|2|3|4 */
  colSpan?: 1 | 2 | 3 | 4;
  /** @select|1|2|3 */
  rowSpan?: 1 | 2 | 3;
  className?: string;
  children?: React.ReactNode;
}

const COL_SPAN_CLASSES: Record<1 | 2 | 3 | 4, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
};

const ROW_SPAN_CLASSES: Record<1 | 2 | 3, string> = {
  1: 'lg:row-span-1',
  2: 'lg:row-span-2',
  3: 'lg:row-span-3',
};

export function BentoItem({
  themeMode = 'dark',
  colSpan = 1,
  rowSpan = 1,
  className,
  children,
}: BentoItemProps) {
  return (
    <div
      data-theme={themeMode}
      className={cn(
        'min-w-0 rounded-2xl',
        COL_SPAN_CLASSES[colSpan],
        ROW_SPAN_CLASSES[rowSpan],
        themeMode === 'light' ? 'light' : 'dark',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridLayout({
  themeMode = 'dark',
  columns = 3,
  gap = 'md',
  dense = false,
  className,
  children,
}: BentoGridLayoutProps) {
  const colClass =
    columns === 2 ? styles.cols2 : columns === 4 ? styles.cols4 : styles.cols3;

  return (
    <div
      data-theme={themeMode}
      className={cn(
        styles.bentoGrid,
        colClass,
        BENTO_GAP_CLASSES[gap],
        dense && 'grid-flow-dense',
        themeMode === 'light' ? 'light' : 'dark',
        className
      )}
    >
      {children}
    </div>
  );
}

export default BentoGridLayout;
