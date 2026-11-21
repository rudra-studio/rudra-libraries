import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';
import styles from './styles.module.scss';

export interface AvatarProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  src?: string;
  /** @translate */
  alt?: string;
  /** @translate */
  initials?: string;
  /** @schema {"type":"number"} */
  size?: number;
}

export function Avatar({
  themeMode = 'dark',
  src = '',
  alt = 'Avatar',
  initials = 'SS',
  size = 40,
}: AvatarProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiAvatar src={src || undefined} alt={alt} sx={{ width: size, height: size }}>
        {!src ? initials : null}
      </MuiAvatar>
    </span>
  );
}
export default Avatar;
