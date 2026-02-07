'use client';
import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll';

const ShapesBackground = () => (
  <>
    <div className="shape-img1">
      <ScrollAnimation animateIn="fadeInUp" delay={100} animateOnce={true}>
        <img src="/images/shape/shape1.png" alt="image" />
      </ScrollAnimation>
    </div>
    <div className="shape-img2">
      <img src="/images/shape/shape2.svg" alt="image" />
    </div>
    <div className="shape-img3">
      <img src="/images/shape/shape3.svg" alt="image" />
    </div>
    <div className="shape-img4">
      <img src="/images/shape/shape4.png" alt="image" />
    </div>
    <div className="shape-img5">
      <img src="/images/shape/shape5.png" alt="image" />
    </div>
    <div className="shape-img6">
      <img src="/images/shape/shape6.png" alt="image" />
    </div>
    <div className="shape-img7">
      <img src="/images/shape/shape7.png" alt="image" />
    </div>
    <div className="shape-img8 shape-images">
      <img src="/images/shape/shape8.png" alt="image" />
    </div>
    <div className="shape-img9 shape-images">
      <img src="/images/shape/shape9.png" alt="image" />
    </div>
    <div className="shape-img10 shape-images">
      <img src="/images/shape/shape10.png" alt="image" />
    </div>
  </>
);

export default ShapesBackground;
