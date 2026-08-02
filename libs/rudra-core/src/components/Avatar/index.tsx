import React, { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'none' | 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: AvatarSize /* @select|xs|sm|md|lg|xl */;
  shape?: AvatarShape /* @select|circle|rounded|square */;
  status?: AvatarStatus /* @select|none|online|offline|busy|away */;
  loading?: 'eager' | 'lazy' /* @select|eager|lazy */;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void /* @type|function|return:void|args:event */;
}

function initialsFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function Avatar({
  src,
  alt,
  name = 'Rudra User',
  fallback,
  size = 'md',
  shape = 'circle',
  status = 'none',
  loading = 'lazy',
  referrerPolicy,
  onImageError,
  className = '',
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const fallbackText = useMemo(
    () => (fallback || initialsFromName(name)).slice(0, 2).toUpperCase(),
    [fallback, name],
  );
  const accessibleName = alt || name || 'Avatar';
  const showImage = Boolean(src) && !imageFailed;

  const rootClassName = [
    styles.root,
    styles['size_' + size],
    styles['shape_' + shape],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      className={rootClassName}
      role="img"
      aria-label={accessibleName}
      {...props}
    >
      {showImage ? (
        <img
          className={styles.image}
          src={src}
          alt=""
          loading={loading}
          referrerPolicy={referrerPolicy}
          onError={(event) => {
            setImageFailed(true);
            onImageError?.(event);
          }}
        />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {fallbackText}
        </span>
      )}

      {status !== 'none' && (
        <span
          className={[styles.status, styles['status_' + status]].join(' ')}
          title={status}
          aria-label={status}
        />
      )}
    </span>
  );
}
