import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

const flexVariants = cva('min-w-0', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      rowReverse: 'flex-row-reverse',
      colReverse: 'flex-col-reverse',
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
    wrap: {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      wrapReverse: 'flex-wrap-reverse',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    inline: {
      true: 'inline-flex',
      false: 'flex',
    },
  },
  defaultVariants: {
    direction: 'row',
    align: 'center',
    justify: 'start',
    wrap: 'nowrap',
    gap: 'none',
    inline: false,
  },
});

export type FlexTag = 'div' | 'section' | 'nav' | 'header' | 'footer' | 'ul' | 'li';

export interface FlexProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof flexVariants> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|div|section|nav|header|footer|ul|li */
  as?: FlexTag;
  /** @schema {"type":"boolean"} */
  asChild?: boolean;
  /** @schema {"type":"boolean"} */
  inline?: boolean;
  children?: React.ReactNode;
}

export const Flex = forwardRef<HTMLElement, FlexProps>(function Flex(
  {
    themeMode = 'dark',
    as = 'div',
    asChild = false,
    direction = 'row',
    align = 'center',
    justify = 'start',
    wrap = 'nowrap',
    gap = 'none',
    inline = false,
    className,
    children,
    ...rest
  },
  ref
) {
  const classes = cn(
    styles.flexBase,
    flexVariants({ direction, align, justify, wrap, gap, inline }),
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

export default Flex;
