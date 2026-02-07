import { SUBJECTS } from '@/helpers/SubjectsConstants';
import React from 'react';
import ServiceTile from '../tiles/ServiceTile';

const SubjectList = () => {
  return (
    <section className="overview-area ptb-100 pt-100">
      <div className="partner-area ptb-100 pt-0">
        <div className="container d-flex subect-list-container ">
          {SUBJECTS.map((service, index) => (
            <div className="subject-list-item" key={index}>
              <ServiceTile {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectList;
