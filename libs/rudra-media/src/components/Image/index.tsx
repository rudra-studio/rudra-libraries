import React, { useState } from "react";

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  blurPlaceholder?: string; // Optional base64 or low-res URL
  className?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio = "auto",
  radius = "xl",
  blurPlaceholder,
  className = ""
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const radiusClass = radius === "none" ? "rounded-none" : `rounded-${radius}`;
  const aspectClass = 
    aspectRatio === "video" ? "aspect-video" : 
    aspectRatio === "square" ? "aspect-square" : 
    aspectRatio === "portrait" ? "aspect-[3/4]" : 
    "aspect-auto";

  return (
    <div 
      className={`relative overflow-hidden bg-slate-200 shadow-lg ${radiusClass} ${aspectClass} ${className}`}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : undefined,
      }}
    >
      {/* 1. Blur Placeholder Layer */}
      {blurPlaceholder && !isLoaded && (
        <img
          src={blurPlaceholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
        />
      )}

      {/* 2. Main Image */}
      <img
        src={hasError ? "https://placehold.co/400x400?text=Error" : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}