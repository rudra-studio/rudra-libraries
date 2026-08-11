import React, { useEffect, useState } from "react";

export type ImageFit = "cover" | "contain" | "fill" | "none";

export interface ImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "className" | "onError"
  > {
  src?: string;

  /** @translate */
  alt?: string;

  fallbackSrc?: string;

  /** @select|cover|contain|fill|none */
  fit?: ImageFit;

  /** @select|lazy|eager */
  loading?: "lazy" | "eager";

  /**
   * @type|class
   * @schema [{"key":"Width","prefix":"w","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"full","label":"Full Width"},{"key":"1/2","label":"50%"},{"key":"1/3","label":"33%"},{"key":"2/3","label":"66%"}]},{"key":"Height","prefix":"h","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"full","label":"Full Height"},{"key":"32","label":"Small"},{"key":"48","label":"Medium"},{"key":"64","label":"Large"},{"key":"96","label":"Extra Large"}]},{"key":"Radius","prefix":"rounded","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"},{"key":"xl","label":"Extra Large"},{"key":"2xl","label":"2XL"},{"key":"full","label":"Circle"}]},{"key":"Shadow","prefix":"shadow","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"},{"key":"xl","label":"Extra Large"}]},{"key":"Opacity","prefix":"opacity","type":"select","options":[{"key":"100","label":"100%"},{"key":"75","label":"75%"},{"key":"50","label":"50%"},{"key":"25","label":"25%"}]}]
   */
  className?: string;

  /** @type|function */
  onImageError?: () => void;

  /** @type|function */
  onImageLoad?: () => void;
}

const FIT_CLASSES: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
};

export default function Image({
  src,
  alt = "",
  fallbackSrc,
  fit = "cover",
  loading = "lazy",
  className = "",
  onImageError,
  onImageLoad,
  ...props
}: ImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFallbackUsed(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && !fallbackUsed) {
      setCurrentSrc(fallbackSrc);
      setFallbackUsed(true);
      return;
    }

    onImageError?.();
  };

  const resolvedClassName = [
    "block max-w-full",
    FIT_CLASSES[fit],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!currentSrc) {
    return null;
  }

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      loading={loading}
      className={resolvedClassName}
      onLoad={() => onImageLoad?.()}
      onError={handleError}
    />
  );
}