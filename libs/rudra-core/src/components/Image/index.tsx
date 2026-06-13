import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string; /* @translate */
  objectFit?: string; /* @select|cover|contain|fill|none */
  loading?: string; /* @select|lazy|eager */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export default function Image({
  src,
  alt = 'Placeholder image',
  objectFit = 'cover',
  loading = 'lazy',
  radius = 'none',
  className = '',
  ...props
}: ImageProps) {
  
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const fitClasses: Record<string, string> = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  return (
    <img
      src={src}
      alt={alt}
      loading={loading as 'lazy' | 'eager'}
      className={`w-full h-full max-w-full ${fitClasses[objectFit]} ${radiusClasses[radius]} ${className}`}
      {...props}
    />
  );
}import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string; /* @translate */
  objectFit?: string; /* @select|cover|contain|fill|none */
  loading?: string; /* @select|lazy|eager */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export default function Image({
  src,
  alt = 'Placeholder image',
  objectFit = 'cover',
  loading = 'lazy',
  radius = 'none',
  className = '',
  ...props
}: ImageProps) {
  
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const fitClasses: Record<string, string> = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  return (
    <img
      src={src}
      alt={alt}
      loading={loading as 'lazy' | 'eager'}
      className={`w-full h-full max-w-full ${fitClasses[objectFit]} ${radiusClasses[radius]} ${className}`}
      {...props}
    />
  );
}