import React, { useState } from 'react';
import styles from './styles.module.scss';

export interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onImageChange?: (index: number) => void;
  mainImageSlot?: React.ReactNode;
  thumbnailSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ImageGallery({
  images = [ "https://picsum.photos/400/300?random=1",
  "https://picsum.photos/400/300?random=2",
  "https://picsum.photos/400/300?random=3",
  "https://picsum.photos/400/300?random=4",
  "https://picsum.photos/400/300?random=5"],
  initialIndex = 0,
  onImageChange,
  mainImageSlot,
  thumbnailSlot,
  children,
  className = '',
  style
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    if (onImageChange) {
      onImageChange(index);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={`${styles.galleryContainer} ${className}`} style={style}>
        <div className={styles.noImages}>No images to display</div>
      </div>
    );
  }

  return (
    <div className={`${styles.galleryContainer} ${className}`} style={style}>
      <div className={styles.mainImageContainer}>
        <div className={styles.mainImageWrapper}>
          <img 
            src={images[currentIndex]} 
            alt={`Selected view ${currentIndex + 1}`} 
            className={styles.mainImage} 
          />
          {mainImageSlot && <div className={styles.mainSlotWrapper}>{mainImageSlot}</div>}
        </div>
      </div>

      <div className={styles.thumbnailList}>
        {images.map((img, index) => (
          <div 
            key={`${img}-${index}`}
            className={`${styles.thumbnailWrapper} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className={styles.thumbnail} />
            {thumbnailSlot && <div className={styles.thumbnailSlotWrapper}>{thumbnailSlot}</div>}
          </div>
        ))}
      </div>
      
      {children}
    </div>
  );
}
