import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
  robots: 'noindex, nofollow',
};

const Error = ({
  title = 'Page Not Found',
  description = `The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.`,
}) => {
  return (
    <section className="error-area mt-5">
      <div className="d-table">
        <div className="d-table-cell">
          <div className="container">
            <div className="error-content">
              <Image
                src="/images/404.png"
                alt="404 Error"
                width={500}
                height={400}
                priority={true}
              />
              <h3>{title}</h3>
              <p>{description}</p>
              <Link
                className="text-primary hover"
                aria-label="Go to Home"
                href="/"
                passHref
              >
                Go to Home <span></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error;
