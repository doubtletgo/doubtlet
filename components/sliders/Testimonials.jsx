'use client';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

const settings = {
  dots: true,
  infinite: true,
  auto: true,
  autoplaySpeed: 3000,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1550,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 425,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 0,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const feedbacks = [
  {
    name: 'Sebastine Chukwu',
    type: 'Student',
    message: `I was failing my maths calculus class and we tried this website
              as a last resort to help figure out questions. Later the next day
              I got an A on the test which raised my grade from a E to a B-.
              Praise Doubtlet.com`,
    image: '/images/testimonial-images/blankImage.png',
  },
  {
    name: 'Manual Troncoso',
    type: 'Student',
    message: `The tutors on this website are very encouraging and helped me
              through the entire process by giving step by step solution!`,
    image: '/images/testimonial-images/blankImage.png',
  },
  {
    name: 'Mariana Roman',
    type: 'Student',
    message: `The live session on this website helped me to become more
              comfortable with the basics of thermodynamics and its
              application!`,
    image: '/images/testimonial-images/blankImage.png',
  },
  {
    name: 'Monjurul Hussain',
    type: 'Parent',
    message: `My tutor was amazing! Her patience and enthusiasm for all things
              coding was contagious. My 10-year-old daughter now enjoys coding
              and looks forward to her lessons now ..all thanks to Doubtlet.com`,
    image: '/images/testimonial-images/blankImage.png',
  },
];

const Testimonials = () => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setDisplay(true);
  }, []);

  return (
    <div className="feedback-area ptb-100 bg-color">
      <div className="container">
        <div className="section-title">
          <span className="sub-title">Testimonials</span>
          <h2>Some Lovely Feedback From Our Students And Parents</h2>
        </div>
      </div>

      <div>
        {display && (
          <Slider {...settings} className="mx-auto">
            {feedbacks.map((itm, index) => (
              <div className="single-feedback-item mx-auto" key={index}>
                <p>{`"${itm.message}"`}</p>
                <div className="client-info">
                  <img src={itm.image} alt="image" />
                  <h3>{itm.name}</h3>
                  <span>{itm.type}</span>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
