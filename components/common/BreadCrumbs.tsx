import React from 'react';
import Link from 'next/link';

type Props = {
  breadcrumbText1: string;
  breadcrumbText2?: string;
  breadcrumbText3?: string;
  breadcrumbText4?: string;
  breadcrumbText5?: string;
  breadcrumbText6?: string;
  breadcrumbText7?: string;
  breadcrumbUrl1?: string;
  breadcrumbUrl2?: string;
  breadcrumbUrl3?: string;
  breadcrumbUrl4?: string;
  breadcrumbUrl5?: string;
  breadcrumbUrl6?: string;
  children?: React.ReactNode;
};

const BreadCrumbs = ({
  breadcrumbText1,
  breadcrumbText2,
  breadcrumbText3,
  breadcrumbText4,
  breadcrumbText5,
  breadcrumbText6,
  breadcrumbText7,
  breadcrumbUrl1 = '',
  breadcrumbUrl2 = '',
  breadcrumbUrl3 = '',
  breadcrumbUrl4 = '',
  breadcrumbUrl5 = '',
  breadcrumbUrl6 = '',
  children,
}: Props) => {
  return (
    <>
      <div className="d-table">
        <div className="d-table-cell">
          <div className="container">
            <div className="page-title-content">
              <ul>
                <li>
                  <Link href={breadcrumbUrl1}>{breadcrumbText1}</Link>
                </li>
                {breadcrumbUrl2 && (
                  <li>
                    <Link href={breadcrumbUrl2}>{breadcrumbText2}</Link>
                  </li>
                )}

                {breadcrumbUrl3 && (
                  <li>
                    <Link href={breadcrumbUrl3}>{breadcrumbText3}</Link>
                  </li>
                )}
                {breadcrumbUrl4 && (
                  <li>
                    <Link href={breadcrumbUrl4}>{breadcrumbText4}</Link>
                  </li>
                )}

                {breadcrumbUrl5 && (
                  <li>
                    <Link href={breadcrumbUrl5}>{breadcrumbText5}</Link>
                  </li>
                )}
                {breadcrumbUrl6 && (
                  <li>
                    <Link href={breadcrumbUrl6}>{breadcrumbText6}</Link>
                  </li>
                )}

                {breadcrumbText7 ? <li>{breadcrumbText7}</li> : ''}
              </ul>
            </div>
            {!!children && <div className="d-table-cell">{children}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default BreadCrumbs;
