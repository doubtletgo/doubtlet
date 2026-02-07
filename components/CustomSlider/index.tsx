'use client';
import React, { useRef, ReactNode } from 'react';
import styles from './Slider.module.scss';

interface SliderProps {
  children: ReactNode;
  slidesToShow?: number;
}

const CustomSlider: React.FC<SliderProps> = ({
  children,
  slidesToShow = 1,
}) => {
  const slideRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = React.Children.count(children);
  const totalVisibleSlides = Math.min(slidesToShow, totalSlides);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider} ref={slideRef}>
        {React.Children.map(children, (child, index) => (
          <div
            className={styles.slide}
            key={index}
            style={{ width: `${100 / totalVisibleSlides}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSlider;
