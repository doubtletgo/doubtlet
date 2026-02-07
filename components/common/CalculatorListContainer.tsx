import React from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  subTitle: string;
  description: string;
  buttonList: { href: string; details: string }[];
};

const CalculatorListContainer = ({
  title = '',
  subTitle = '',
  description = '',
  buttonList = [],
}: Props) => {
  return (
    <>
      <h1 className="text-primary">{title}</h1>
      <p className="text-muted h5">{subTitle}</p>
      <div className="d-flex justify-content-center ">
        <p className="text-muted text-center " style={{ width: '68%' }}>
          {description}
        </p>
      </div>
      <section className="overview-area">
        <div className="partner-area ptb-50 pt-0">
          <div className="container d-flex flex-wrap justify-content-center gridItems my-4 gap-3">
            {buttonList.map((service, index) => (
              <Link
                className="outline-btn btn-outline-primary subject-button"
                key={index}
                href={service.href}
              >
                {service.details}
                <span />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CalculatorListContainer;
