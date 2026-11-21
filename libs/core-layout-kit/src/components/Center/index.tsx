import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

const centerVariants = cva('grid min-w-0', {
  variants: {
    axis: {
      both: 'place-items-center',
      horizontal: 'justify-items-center',
      vertical: 'content-center',
    },
  },
  defaultVariants: {
    axis: 'both',
  },
});

export type CenterTag = 'div' | 'section' | 'main';

export interface CenterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof centerVariants> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|div|section|main */
  as?: CenterTag;
  /** @schema {"type":"string"} */
  minHeight?: string;
  children?: React.ReactNode;
}

export const Center = forwardRef<HTMLElement, CenterProps>(function Center(
  {
    themeMode = 'dark',
    as = 'div',
    axis = 'both',
    minHeight = '12rem',
    className,
    style,
    children,
    ...rest
  },
  ref
) {
  const Component = as as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<never>}
      data-theme={themeMode}
      className={cn(
        styles.centerBox,
        centerVariants({ axis }),
        themeMode === 'light' ? 'light' : 'dark',
        className
      )}
      style={{ minHeight, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
});

export default Center;
