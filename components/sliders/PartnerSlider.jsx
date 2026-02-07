'use client';
import React from 'react';
import { SERVICES } from '../../helpers/SubjectsConstants';
import PartnerTile from '../tiles/partner-tile';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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

const PartnerSlider = () => {
  return (
    <section className="overview-area ">
      <div className="partner-area ptb-100 pt-0">
        <div className="container">
          <div className="section-title">
            <h3 className="text-primary">Services</h3>
          </div>

          <Carousel
            responsive={responsive}
            swipeable={true}
            draggable={true}
            showDots={false}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3500}
            keyBoardControl={true}
            customTransition="transform 1000ms ease-in-out"
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
          >
            {SERVICES.map((service) => (
              <PartnerTile
                key={service.heading}
                {...service}
                style={{ height: '570px', maxHeight: '570px' }}
              />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default PartnerSlider;
