'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RenderMarkDown from '../markdown/MarkdownRenderer';
import styles from './styles.module.scss';

type Props = {
  pageTitle: string;
  mdTitle?: string | null;
  breadcrumbTextOne: string;
  breadcrumbUrl: string;
  breadcrumbTextTwo?: string;
  descriptionText?: string;
  breadcrumbTextThree?: string;
  breadcrumbUrl2?: string;
  breadcrumbUrl3?: string;
  children?: React.ReactNode;
  className?: string;
};

const PageHeader = (props: Props) => {
  const {
    pageTitle,
    mdTitle = null,
    breadcrumbTextOne,
    breadcrumbTextTwo,
    breadcrumbUrl,
    descriptionText,
    breadcrumbTextThree,
    breadcrumbUrl2 = '',
    children,
    className,
  } = props;
  return (
    <>
      <div
        className={`page-title-area page-title-bg2 ${className || ''} mt-5`}
        style={{ height: 300 }}
      >
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <div className="page-title-content">
                {pageTitle && (
                  <h1 className="text-primary mt-2">
                    {mdTitle ? (
                      <RenderMarkDown className={styles.centeredText}>
                        {mdTitle.toString().split('![')?.[0]}
                      </RenderMarkDown>
                    ) : (
                      pageTitle
                    )}
                  </h1>
                )}
                {descriptionText && <span>{descriptionText}</span>}
                {breadcrumbTextOne && (
                  <ul>
                    <li>
                      <Link href={breadcrumbUrl.toLowerCase()}>
                        {breadcrumbTextOne}
                      </Link>
                    </li>
                    <li>
                      {breadcrumbTextTwo && (
                        <Link href={breadcrumbUrl2.toLowerCase()}>
                          {breadcrumbTextTwo}
                        </Link>
                      )}
                    </li>
                    {breadcrumbTextThree ? <li>{breadcrumbTextThree}</li> : ''}
                  </ul>
                )}
              </div>
              {!!children && <div className="d-table-cell">{children}</div>}
            </div>
          </div>
        </div>

        {/* Optimized images using next/image */}
        <div className="shape-img2">
          <Image
            src="/images/shape/shape2.svg"
            alt="Shape 2"
            width={40}
            height={40}
            priority
          />
        </div>
        <div className="shape-img3">
          <Image
            src="/images/shape/shape3.svg"
            alt="Shape 3"
            width={20}
            height={20}
            priority
          />
        </div>
        <div className="shape-img4">
          <Image
            src="/images/shape/shape4.png"
            alt="Shape 4"
            width={20}
            height={20}
            priority
          />
        </div>
        <div className="shape-img5">
          <Image
            src="/images/shape/shape5.png"
            alt="Shape 5"
            width={20}
            height={20}
            priority
          />
        </div>
        <div className="shape-img7">
          <Image
            src="/images/shape/shape7.png"
            alt="Shape 7"
            width={40}
            height={40}
            priority
          />
        </div>
        <div className="shape-img8">
          <Image
            src="/images/shape/shape8.png"
            alt="Shape 8"
            width={40}
            height={40}
            priority
          />
        </div>
        <div className="shape-img9">
          <Image
            src="/images/shape/shape9.png"
            alt="Shape 9"
            width={40}
            height={40}
            priority
          />
        </div>
        <div className="shape-img10">
          <Image
            src="/images/shape/shape10.png"
            alt="Shape 10"
            width={40}
            height={40}
            priority
          />
        </div>
      </div>
    </>
  );
};

export default PageHeader;
