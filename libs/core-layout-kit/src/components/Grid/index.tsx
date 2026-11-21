import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

const gridVariants = cva('grid min-w-0', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'stretch',
  },
});

const COLS_STATIC_MAP: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
};

export interface ResponsiveColsMap {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export type GridTag = 'div' | 'section' | 'ul' | 'ol' | 'main';

export interface GridProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof gridVariants> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|div|section|ul|ol|main */
  as?: GridTag;
  /** @schema {"type":"boolean"} */
  asChild?: boolean;
  /** @type|json */
  cols?: number | ResponsiveColsMap;
  /** @schema {"type":"string"} */
  minItemWidth?: string;
  children?: React.ReactNode;
}

function resolveColsClass(cols?: number | ResponsiveColsMap): string {
  if (typeof cols === 'number') {
    return COLS_STATIC_MAP[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  }
  if (cols && typeof cols === 'object') {
    const parts: string[] = [];
    if (cols.base === 1) parts.push('grid-cols-1');
    if (cols.base === 2) parts.push('grid-cols-2');
    if (cols.base === 3) parts.push('grid-cols-3');
    if (cols.sm === 1) parts.push('sm:grid-cols-1');
    if (cols.sm === 2) parts.push('sm:grid-cols-2');
    if (cols.sm === 3) parts.push('sm:grid-cols-3');
    if (cols.md === 2) parts.push('md:grid-cols-2');
    if (cols.md === 3) parts.push('md:grid-cols-3');
    if (cols.md === 4) parts.push('md:grid-cols-4');
    if (cols.lg === 2) parts.push('lg:grid-cols-2');
    if (cols.lg === 3) parts.push('lg:grid-cols-3');
    if (cols.lg === 4) parts.push('lg:grid-cols-4');
    if (cols.xl === 4) parts.push('xl:grid-cols-4');
    if (cols.xl === 6) parts.push('xl:grid-cols-6');
    return parts.join(' ');
  }
  return '';
}

export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  {
    themeMode = 'dark',
    as = 'div',
    asChild = false,
    cols,
    minItemWidth,
    gap = 'md',
    align = 'stretch',
    className,
    style,
    children,
    ...rest
  },
  ref
) {
  const useAutoFit = Boolean(minItemWidth && minItemWidth.trim()) && cols === undefined;
  const classes = cn(
    gridVariants({ gap, align }),
    useAutoFit ? styles.autoFitGrid : resolveColsClass(cols ?? 3),
    themeMode === 'light' ? 'light' : 'dark',
    className
  );

  const mergedStyle = minItemWidth
    ? ({ '--min-col': minItemWidth, ...style } as React.CSSProperties)
    : style;

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<{ className?: string; style?: React.CSSProperties }>;
    return React.cloneElement(childElement, {
      className: cn(classes, childElement.props.className),
      style: mergedStyle,
    });
  }

  const Component = as as React.ElementType;
  return (
    <Component ref={ref as React.Ref<never>} data-theme={themeMode} className={classes} style={mergedStyle} {...rest}>
      {children}
    </Component>
  );
});

export default Grid;
