import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

const clusterVariants = cva('flex flex-wrap min-w-0', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
  },
  defaultVariants: {
    gap: 'sm',
    align: 'center',
    justify: 'start',
  },
});

export interface ClusterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof clusterVariants> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  children?: React.ReactNode;
}

export const Cluster = forwardRef<HTMLDivElement, ClusterProps>(function Cluster(
  {
    themeMode = 'dark',
    gap = 'sm',
    align = 'center',
    justify = 'start',
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <div
      ref={ref}
      data-theme={themeMode}
      className={cn(
        styles.clusterRow,
        clusterVariants({ gap, align, justify }),
        themeMode === 'light' ? 'light' : 'dark',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Cluster;
