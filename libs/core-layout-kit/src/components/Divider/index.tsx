import React, { forwardRef } from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|horizontal|vertical */
  orientation?: 'horizontal' | 'vertical';
  /** @translate */
  label?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { themeMode = 'dark', orientation = 'horizontal', label, className, ...rest },
  ref
) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-theme={themeMode}
      className={cn(
        styles.dividerWrap,
        isVertical ? 'inline-flex flex-col items-center' : 'w-full',
        themeMode === 'light' ? 'light' : 'dark',
        className
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn(styles.line, isVertical ? styles.verticalLine : styles.horizontalLine)}
      />
      {label && !isVertical && <span className="text-xs shrink-0">{label}</span>}
      {label && !isVertical && (
        <span aria-hidden="true" className={cn(styles.line, styles.horizontalLine)} />
      )}
    </div>
  );
});

export default Divider;
