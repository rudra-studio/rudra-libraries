import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, type ThemeMode } from '../../utils/cn';
import './styles.module.scss';

const boxVariants = cva('min-w-0', {
  variants: {
    p: {
      none: 'p-0',
      xs: 'p-1',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
    px: {
      none: 'px-0',
      xs: 'px-1',
      sm: 'px-2 sm:px-3',
      md: 'px-4 sm:px-6',
      lg: 'px-4 sm:px-6 lg:px-8',
      xl: 'px-6 sm:px-8 lg:px-12',
    },
    py: {
      none: 'py-0',
      xs: 'py-1',
      sm: 'py-2',
      md: 'py-4',
      lg: 'py-6',
      xl: 'py-8',
    },
    position: {
      static: 'static',
      relative: 'relative',
      absolute: 'absolute',
      fixed: 'fixed',
      sticky: 'sticky',
    },
    overflow: {
      visible: 'overflow-visible',
      hidden: 'overflow-hidden',
      clip: 'overflow-clip',
      auto: 'overflow-auto',
      scroll: 'overflow-scroll',
    },
    animated: {
      true: 'layoutAnimateEnter motion-reduce:transition-none',
      false: '',
    },
  },
  defaultVariants: {
    p: 'none',
    position: 'static',
    overflow: 'visible',
    animated: false,
  },
});

export type BoxElementTag = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'ul' | 'li' | 'span';

export interface BoxProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof boxVariants> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|div|section|article|aside|header|footer|main|nav|ul|li|span */
  as?: BoxElementTag;
  /** @schema {"type":"boolean"} */
  asChild?: boolean;
  /** @schema {"type":"boolean"} */
  animated?: boolean;
  children?: React.ReactNode;
}

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    themeMode = 'dark',
    as = 'div',
    asChild = false,
    p = 'none',
    px,
    py,
    position = 'static',
    overflow = 'visible',
    animated = false,
    className,
    children,
    ...rest
  },
  ref
) {
  const classes = cn(
    boxVariants({ p, px, py, position, overflow, animated }),
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

export default Box;
