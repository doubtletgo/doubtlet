type Props = {
  questions: QuestionListItem[];
  query: string;
};

import React, { memo } from 'react';
import Link from 'next/link';
import { QuestionListItem } from '@/types/question.types';
import RenderMarkDown from '../markdown/MarkdownRenderer';

const QuestionsPage = ({ questions, query }: Props) => {
  const filteredQuestions = questions?.filter(
    (que) =>
      que.Question_Link.toLowerCase().includes(query.toLowerCase()) ||
      que.Main_Subject.toLowerCase().includes(query.toLowerCase()) ||
      que.Sub_Subject.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="container mt-5">
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {filteredQuestions?.map((question, index) => (
          <div
            key={question.Question_Link + index}
            className="position-relative col mb-4"
          >
            <div className="card h-100 position-relative shadow">
              <div className="card-body">
                <p className="card-title d-flex justify-content-between">
                  <b>{question.Main_Subject}</b>
                  <b>{question.Sub_Subject}</b>
                </p>

                <p className="card-subtitle mb-2 text-muted">Question:</p>
                <div className="mb-5">
                  <RenderMarkDown>{question.QuestionDisplay}</RenderMarkDown>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center w-100 mt-2 card-footer">
                <Link
                  className="btn btn-outline-primary"
                  prefetch
                  href={`/qna-bank/${question.Main_Subject.toLowerCase().replaceAll(
                    ' ',
                    '-'
                  )}/${question.Sub_Subject.toLowerCase().replaceAll(
                    ' ',
                    '-'
                  )}/${question.Question_Link}--${question.id}`}
                >
                  Show Solution
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(QuestionsPage);
