'use client';
import React, { useCallback, useEffect, useState } from 'react';
import QuestionsPage from './QuestionsPage';
import { getQuestions } from '@/service/client-service';
import { QuestionListItem } from '../../types/question.types';
import SkeletonLoader from './QuestionSkeleton';

type Props = {
  subject: string;
  subSubject: string;
};

const SubjectQuestionList = ({ subject, subSubject }: Props) => {
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });

  const fetchQuestions = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      try {
        const options = {
          ...(subject && { subject }),
          ...(subSubject && { subSubject }),
          page: pageNumber,
        };
        const resp = await getQuestions(options);
        if (resp) {
          setQuestions(resp.questions || []);
          setMeta(resp.meta);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    },
    [subject, subSubject]
  );

  useEffect(() => {
    window.scrollTo({
      top: 150,
      behavior: 'smooth',
    });
    fetchQuestions(page);
  }, [page, fetchQuestions]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const range = 2; // Number of pages to show before and after the current page
    const pages: number[] = [];

    // Always show the first page
    if (currentPage > range + 2) pages.push(1);

    // Ellipsis for skipped pages
    if (currentPage > range + 3) pages.push(-1);

    // Add pages within range
    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      pages.push(i);
    }

    // Ellipsis for skipped pages at the end
    if (currentPage < totalPages - range - 2) pages.push(-1);

    // Always show the last page
    if (currentPage < totalPages - range - 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="container my-5">
      <div className="w-100 d-flex justify-content-center align-items-center mx-auto">
        <input
          className="form-control rounded-pill p-4 shadow mb-0 w-50 mx-auto"
          placeholder="Type to search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} />)
        ) : (
          <>
            <div className="col">
              <QuestionsPage questions={questions} query={search} />
            </div>
            {questions.length > 0 && (
              <div className="d-flex justify-content-center my-4">
                <button
                  className="btn btn-success mx-2"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>

                {generatePageNumbers(page, meta.totalPages).map(
                  (pageNumber, index) =>
                    pageNumber === -1 ? (
                      <span key={index} className="mx-2 text-muted">
                        ...
                      </span>
                    ) : (
                      <button
                        key={index}
                        className={`btn mx-1 ${
                          page === pageNumber
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    )
                )}

                <button
                  className="btn btn-success mx-2"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === meta.totalPages}
                >
                  Next
                </button>
              </div>
            )}
            {questions && questions.length === 0 && (
              <div className="row justify-content-center">
                <p className="no-results-message">No results found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectQuestionList;
