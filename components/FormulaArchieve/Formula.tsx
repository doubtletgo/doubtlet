'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FormulaConstants } from '@/helpers/constants';

const Formula = () => {
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('MATHEMATICS');
  const [loading, setLoading] = useState(false);

  const subjects = ['PHYSICS', 'MATHEMATICS', 'CHEMISTRY', 'BIOLOGY'];

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setLoading(true); // Start loading
    // Simulate loading delay (remove this in actual usage)
    setTimeout(() => {
      setLoading(false); // Stop loading
    }, 2000); // Set loading duration (in milliseconds)
  };

  const filteredItems = FormulaConstants.filter((itm) => {
    const subjectMatches =
      selectedSubject === 'MATHEMATICS' || itm.label === selectedSubject;
    const queryMatches = itm.details
      .toLowerCase()
      .includes(query.toLowerCase());
    return subjectMatches && queryMatches;
  });

  return (
    <section className="overview-area">
      <div className="partner-area ptb-50 md-5 pt-0 d-flex justify-center flex-column align-items-center">
        <div className="input-group mb-3 w-50">
          <select
            className="form-select border-primary rounded-start custom-select"
            value={selectedSubject}
            onChange={(e) => handleSubjectSelect(e.target.value)}
          >
            <option value="">Select a subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control border-primary rounded-start"
            placeholder="Type your subject's query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn btn-primary rounded-end"
            type="button"
            onClick={() => setLoading(!loading)}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
        </div>
        {selectedSubject && (
          <div className="container d-flex flex-wrap justify-content-center gridItems my-4 gap-3">
            {loading ? (
              <div className="spinner-border text-primary" role="stutus">
                <span className="sr-only">Loading....</span>
              </div>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((service, index) => (
                <Link
                  className="outline-btn btn-outline-primary subject-button"
                  key={index}
                  href={service.href}
                >
                  {service.details}
                </Link>
              ))
            ) : (
              <h5 className="text-danger">
                No Formulas Found For {selectedSubject}...
              </h5>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Formula;
