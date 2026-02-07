import React from 'react';
import PageHeader from '@/components/PageHeader';
import { SUBJECTS } from '@/helpers/SubjectsConstants';
import Link from 'next/link';
import ServiceTile from '@/components/tiles/ServiceTile';

export const metadata = {
  title: 'Subject List | Doubtlet',
  description:
    'Maths, Physics and Chemistry Calculators along with Unit and Currency converters | Doubtlet',
};

export default function Page() {
  return (
    <>
      <PageHeader
        pageTitle="Subjects"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="subjects"
        className="subject-page"
      />
      <section className="overview-area ptb-100 pt-100">
        <div className="partner-area ptb-100 pt-0">
          <div className="container d-flex subect-list-container">
            {SUBJECTS.map((service, index) => (
              <div className="subject-list-item" key={index}>
                <Link key={index} href={service.href}>
                  <ServiceTile {...service} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
