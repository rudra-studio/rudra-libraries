import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

export interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface CarouselProps {
  items?: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

const dummyItems: CarouselItem[] = [
  { id: 1, image: 'https://picsum.photos/id/10/800/400', title: 'Majestic Mountains', description: 'Experience the serenity of the high peaks.' },
  { id: 2, image: 'https://picsum.photos/id/20/800/400', title: 'Urban Exploration', description: 'Discover the rhythm of city life.' },
  { id: 3, image: 'https://picsum.photos/id/30/800/400', title: 'Coastal Retreat', description: 'Feel the ocean breeze on your face.' },
];

const Carousel: React.FC<CarouselProps> = ({
  items = dummyItems,
  autoPlay = true,
  interval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [activeIndex, autoPlay, interval]);

  return (
    <div className={styles.carousel}>
      <div
        className={styles.inner}
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div className={styles.slide} key={item.id}>
            <img src={item.image} alt={item.title} className={styles.image} />
            <div className={styles.caption}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button className={`${styles.control} ${styles.prev}`} onClick={prevSlide} aria-label="Previous slide">
        &#10094;
      </button>
      <button className={`${styles.control} ${styles.next}`} onClick={nextSlide} aria-label="Next slide">
        &#10095;
      </button>

      <div className={styles.indicators}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;