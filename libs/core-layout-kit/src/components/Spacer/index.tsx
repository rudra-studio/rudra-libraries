import React, { forwardRef } from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @schema {"type":"string"} */
  size?: string;
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(function Spacer(
  { themeMode = 'dark', size, className, style, ...rest },
  ref
) {
  const customStyle = size
    ? ({ flex: '0 0 auto', width: size, height: size, ...style } as React.CSSProperties)
    : style;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-theme={themeMode}
      className={cn(
        !size && styles.spacerFlex,
        !size && 'flex-1',
        themeMode === 'light' ? 'light' : 'dark',
        className
      )}
      style={customStyle}
      {...rest}
    />
  );
});

export default Spacer;
