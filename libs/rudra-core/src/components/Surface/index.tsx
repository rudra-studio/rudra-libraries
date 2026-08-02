import React from 'react';
import styles from './styles.module.scss';

export type SurfaceElement = 'div' | 'section' | 'article' | 'aside' | 'main';
export type SurfaceTone = 'default' | 'subtle' | 'raised' | 'inverted' | 'transparent';
export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SurfaceRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  as?: SurfaceElement /* @select|div|section|article|aside|main */;
  tone?: SurfaceTone /* @select|default|subtle|raised|inverted|transparent */;
  padding?: SurfacePadding /* @select|none|sm|md|lg|xl */;
  radius?: SurfaceRadius /* @select|none|sm|md|lg|xl|full */;
  bordered?: boolean;
  responsivePadding?: boolean;
}

export default function Surface({
  children,
  as = 'div',
  tone = 'default',
  padding = 'md',
  radius = 'lg',
  bordered = false,
  responsivePadding = true,
  className = '',
  ...props
}: SurfaceProps) {
  const classNames = [
    styles.root,
    styles['tone_' + tone],
    styles['padding_' + padding],
    styles['radius_' + radius],
    bordered ? styles.bordered : '',
    responsivePadding ? styles.responsive : '',
    className,
  ].filter(Boolean).join(' ');

  return React.createElement(as, { className: classNames, ...props }, children);
}
