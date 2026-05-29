import styles from "./styles.module.scss";
import React from 'react';

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  // We don't use @translate here because URLs aren't usually localized
  src?: string; 
  poster?: string; 
  // These will automatically parse as toggle switches in your builder UI!
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  
  // Automatically parsed into dropdown selects
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Video({
  src = 'https://www.w3schools.com/html/mov_bbb.mp4', // Safe default testing video
  poster = '',
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  objectFit = 'cover',
  radius = 'md',
  className = '',
  ...props
}: VideoProps) {
  
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl', // 'full' (circle) usually looks terrible on standard videos
  };

  const fitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  return (
    <video
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline // Critical for iOS Safari auto-play rules
      className={`w-full max-w-full overflow-hidden shadow-sm ${fitClasses[objectFit]} ${radiusClasses[radius]} ${className}`}
      {...props}
    />
  );
}