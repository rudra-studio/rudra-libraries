import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

const containerVariants = cva('mx-auto w-full min-w-0', {
  variants: {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-[var(--container-page,80rem)]',
      full: 'max-w-none',
    },
    padding: {
      none: 'px-0',
      sm: 'px-3 sm:px-4',
      md: 'px-4 sm:px-6',
      lg: 'px-4 sm:px-6 lg:px-8',
    },
  },
  defaultVariants: {
    size: 'xl',
    padding: 'lg',
  },
});

export type ContainerTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'nav';

export interface ContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|div|section|article|main|header|footer|nav */
  as?: ContainerTag;
  /** @schema {"type":"boolean"} */
  asChild?: boolean;
  /** @schema {"type":"boolean"} */
  query?: boolean;
  children?: React.ReactNode;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  {
    themeMode = 'dark',
    as = 'div',
    asChild = false,
    size = 'xl',
    padding = 'lg',
    query = false,
    className,
    children,
    ...rest
  },
  ref
) {
  const classes = cn(
    styles.containerRoot,
    containerVariants({ size, padding }),
    query && styles.queryEnabled,
    query && '@container',
    themeMode === 'light' ? 'light' : 'dark',
    className
  );

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(childElement, {
      className: cn(classes, childElement.props.className),
    });
  }

  const Component = as as React.ElementType;
  return (
    <Component ref={ref as React.Ref<never>} data-theme={themeMode} className={classes} {...rest}>
      {children}
    </Component>
  );
});

export default Container;
