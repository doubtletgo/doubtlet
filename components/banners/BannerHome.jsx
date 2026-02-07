'use client';
import React, { useEffect } from 'react';
import ShapesBackground from '../ShapesBackground';
import Link from 'next/link';
import Image from 'next/image';
import TextTransition, { presets } from 'react-text-transition';
import { TITLE_TEXTS } from '../../helpers/constants';

const BannerHome = () => {
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 3000);
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <>
      <div className=" banner-bg2">
        <h1 style={{ opacity: 0 }}>Homework help</h1>
        <div className="d-table">
          <div className="pt-md-1 mt-5">
            <div className="container">
              <div className="row mt-5">
                <div className="col-lg-6 col-md-12">
                  <Image
                    src="/images/study.svg"
                    height={640}
                    width={638}
                    alt="Doubtlet home image"
                  />
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="hero-main-banner-content">
                    <span className="sub-title d-block">Doubtlet...</span>
                    <span className="text-primary mb-2 d-block h3">
                      Have Doubts?
                    </span>
                    <span className="mb-2 h2 d-block">Get Personalised</span>
                    <span
                      className="color-reddish h1 d-block display-2"
                      style={{ fontWeight: '500' }}
                    >
                      <TextTransition
                        inline={true}
                        springConfig={presets.wobbly}
                      >
                        {TITLE_TEXTS[index % TITLE_TEXTS.length]}
                      </TextTransition>
                    </span>
                    <h2 className="mb-3">24x7 Available </h2>
                    <h3 className="mt-3 text-primary">
                      Better Doubt Clearing Better Grades
                    </h3>
                    <div>
                      <Link href="https://doubt.doubtlet.com/myLogin.php">
                        <button className="default-btn mt-3 rounded-pill btn-blue">
                          <b> Get help now!</b>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ShapesBackground />
      </div>
    </>
  );
};

export default BannerHome;
