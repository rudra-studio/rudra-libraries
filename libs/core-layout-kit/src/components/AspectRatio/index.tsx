import React, { forwardRef } from 'react';
import { cn, type ThemeMode } from '../../utils/cn';
import styles from './styles.module.scss';

const RATIO_PRESET_CLASSES: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-4/3',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
};

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @select|light|dark */
  themeMode?: ThemeMode;
  /** @select|16/9|4/3|1/1|21/9 */
  ratio?: '16/9' | '4/3' | '1/1' | '21/9' | string;
  children?: React.ReactNode;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { themeMode = 'dark', ratio = '16/9', className, style, children, ...rest },
  ref
) {
  const presetClass = RATIO_PRESET_CLASSES[ratio];
  const numericStyle = !presetClass && ratio.includes('/')
    ? ({ aspectRatio: ratio.replace('/', ' / '), ...style } as React.CSSProperties)
    : style;

  return (
    <div
      ref={ref}
      data-theme={themeMode}
      className={cn(
        styles.ratioFrame,
        'overflow-hidden [&>*]:h-full [&>*]:w-full [&>*]:object-cover',
        presetClass,
        themeMode === 'light' ? 'light' : 'dark',
        className
      )}
      style={numericStyle}
      {...rest}
    >
      {children}
    </div>
  );
});

export default AspectRatio;
