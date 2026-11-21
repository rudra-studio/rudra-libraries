import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

const stackVariants = cva('flex min-w-0', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row items-center',
    },
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
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

export type StackTag = 'div' | 'section' | 'ul' | 'ol' | 'nav' | 'aside' | 'header' | 'footer';

export interface StackProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof stackVariants> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|div|section|ul|ol|nav|aside|header|footer */
  as?: StackTag;
  /** @schema {"type":"boolean"} */
  asChild?: boolean;
  /** @schema {"type":"boolean"} */
  divider?: boolean;
  children?: React.ReactNode;
}

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  {
    themeMode = 'dark',
    as = 'div',
    asChild = false,
    direction = 'vertical',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    divider = false,
    className,
    children,
    ...rest
  },
  ref
) {
  const effectiveGap = divider ? 'none' : gap;
  const classes = cn(
    stackVariants({ direction, gap: effectiveGap, align, justify }),
    themeMode === 'light' ? 'light' : 'dark',
    className
  );

  const childArray = React.Children.toArray(children).filter(Boolean);
  const isHorizontal = direction === 'horizontal';

  const renderedChildren = divider
    ? childArray.flatMap((child, idx) => {
        if (idx === childArray.length - 1) return [child];
        const sep = (
          <span
            key={`stack-sep-${idx}`}
            role="separator"
            aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
            className={cn(
              styles.dividerLine,
              isHorizontal ? styles.dividerVertical : styles.dividerHorizontal,
              isHorizontal ? 'mx-3' : 'my-3'
            )}
          />
        );
        return [child, sep];
      })
    : children;

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(childElement, {
      className: cn(classes, childElement.props.className),
    });
  }

  const Component = as as React.ElementType;
  return (
    <Component ref={ref as React.Ref<never>} data-theme={themeMode} className={classes} {...rest}>
      {renderedChildren}
    </Component>
  );
});

export const VStack = forwardRef<HTMLElement, Omit<StackProps, 'direction'>>(function VStack(
  props,
  ref
) {
  return <Stack ref={ref} direction="vertical" {...props} />;
});

export const HStack = forwardRef<HTMLElement, Omit<StackProps, 'direction'>>(function HStack(
  props,
  ref
) {
  return <Stack ref={ref} direction="horizontal" {...props} />;
});

export default Stack;
