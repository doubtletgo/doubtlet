'use client';
import React from 'react';
import Image from 'next/image';

import styles from './OurTutors.module.scss';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
interface Tutor {
  name: string;
  expertise: string;
  src: string;
}
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const OurTutors: React.FC = () => {
  const tutors: Tutor[] = [
    {
      name: 'Apoorv Sharma',
      expertise: 'Electrical Engineering Expert',
      src: '/images/testimonial-images/Apoorv.jpeg',
    },
    {
      name: 'Vipin Saini',
      expertise: 'Calculus Expert',
      src: '/images/testimonial-images/Vipin.jpg',
    },
    {
      name: 'Ashwani Sharma',
      expertise: 'Computer Science Expert',
      src: '/images/testimonial-images/Ashwani.jpeg',
    },
    {
      name: 'Tarun Singh',
      expertise: 'Chemistry Expert',
      src: '/images/testimonial-images/Tarun.jpeg',
    },
  ];

  return (
    <div className={styles.ourTutors}>
      <div className={styles.sectionTitle}>
        <span>Our Tutors</span>
        <h2>Meet Our Awesome Tutors</h2>
      </div>

      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={false}
        ssr={true}
        infinite={true}
        autoPlay={false}
        autoPlaySpeed={3500}
        keyBoardControl={true}
        customTransition="transform 1000ms ease-in-out"
        containerClass="carousel-container"
        removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
      >
        {tutors.map((tutor, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image
                width={240}
                height={300}
                src={tutor.src}
                alt={`${tutor.name}`}
                className={styles.image}
              />
            </div>
            <div className={styles.clientInfo}>
              <h3>{tutor.name}</h3>
              <span>{tutor.expertise}</span>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default OurTutors;
