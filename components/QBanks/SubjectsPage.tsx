'use client';
import { SUBJECT_LIST } from '@/service/config';
import Link from 'next/link';
import { useState } from 'react';

type Subject = {
  subject_id: string;
  subject_name: string;
  sub_subject_details: {
    subject_id: string;
    subject_name: string;
  }[];
};

const SubjectsPage = () => {
  const [currentSub, setCurrentSub] = useState<Subject | null>(null);
  const allSubs = SUBJECT_LIST.filter(
    (sub) => sub?.sub_subject_details.length > 0
  );
  const subSubs = currentSub?.sub_subject_details;

  return (
    <section className="overview-area">
      <div className="partner-area ptb-50 pt-0">
        <div className="container d-flex flex-wrap justify-content-center gridItems my-4 gap-3">
          {allSubs.map((service) => (
            <button
              key={service.subject_id}
              className={
                currentSub?.subject_id === service.subject_id
                  ? 'outline-btn-revert'
                  : 'outline-btn btn-outline-primary'
              }
              onClick={() => setCurrentSub(service)}
            >
              {service.subject_name}
            </button>
          ))}
        </div>
        <div className="container d-flex flex-wrap justify-content-center gridItems my-4 gap-3">
          {subSubs?.map((service) => (
            <Link
              key={service.subject_id}
              href={{
                pathname: `/qna-bank/${currentSub?.subject_name.replace(
                  /\s+/g,
                  '-'
                )}/${service.subject_name.replace(/\s+/g, '-')}`.toLowerCase(),
              }}
              className="outline-btn btn-outline-primary subject-button"
            >
              {service.subject_name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsPage;
