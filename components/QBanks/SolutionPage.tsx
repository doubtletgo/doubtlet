'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RenderMarkDown from '../markdown/MarkdownRenderer';

import { getAllQuestions } from '@/service/client-service';
import { SUBJECT_IDS } from '@/service/config';
import { QuestionListItem } from '@/types/question.types';
import { useParams } from 'next/navigation';

const linkToTitle = (str = '') => {
  const tempStr = str + '';

  return tempStr.replace(/-/g, ' ');
};

const createLink = (str = '') => {
  return str.toLowerCase().replace(/\s+/g, '-');
};

type Props = {
  question: string;
  solution: string;
  subjects: { subject: string; subSubject: string };
  markdownSolution: string;
  mdQuestion: string | null;
  link: string;
};

const SolutionPage = ({
  question,
  solution,
  subjects,
  markdownSolution,
  mdQuestion,
  link,
}: Props) => {
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { q_link = '' } = useParams();
  useEffect(() => {
    setLoading(true);
    getAllQuestions({
      subject: SUBJECT_IDS[subjects.subject],
      subSubject: SUBJECT_IDS[subjects.subSubject],
    })
      .then((res) => {
        setQuestions(res || []);
      })
      .catch((err) => {
        console.log('Error fetching questions: ', err);
      })
      .finally(() => setLoading(false));
  }, [question]);

  const nextAndPrev = () => {
    const length = questions.length;
    const index = questions.findIndex((itm) => itm.Question_Link == link);

    console.log(index, link, questions);

    return {
      next: index == length - 1 ? null : questions[index + 1],
      prev: index == 0 ? null : questions[index - 1],
    };
  };

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center notes-card">
          <div className="px-2 w-md-50 mx-auto">
            <p className="text-danger pt-3">
              <b>Question :</b>{' '}
            </p>
            {mdQuestion ? (
              <RenderMarkDown className={''}>{question}</RenderMarkDown>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: `<span>${question}</span>`,
                }}
              />
            )}
            <p className="text-success">
              <b> Solution:</b>
            </p>

            {markdownSolution ? (
              <RenderMarkDown className={''}>{markdownSolution}</RenderMarkDown>
            ) : (
              <div
                className="text-center"
                dangerouslySetInnerHTML={{ __html: solution }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto w-75 d-flex flex-column flex-md-row justify-content-center gap-4">
        {nextAndPrev().prev && (
          <Link
            key={'next-que'}
            className="m-1 btn d-flex align-items-center outline-btn btn-outline-primary subject-button"
            href={createLink(
              `/qna-bank/${nextAndPrev().prev?.Main_Subject}/${nextAndPrev().prev?.Sub_Subject
              }/${nextAndPrev().prev?.Question_Link}--${nextAndPrev().prev?.id}`
            )}
            prefetch={true}
          >
            Previous Question
          </Link>
        )}
        {nextAndPrev().next && (
          <Link
            key={'prev-que'}
            className="m-1 d-flex align-items-center outline-btn btn-outline-primary subject-button"
            href={createLink(
              `/qna-bank/${nextAndPrev().next?.Main_Subject}/${nextAndPrev().next?.Sub_Subject
              }/${nextAndPrev().next?.Question_Link}--${nextAndPrev().next?.id}`
            )}
            prefetch={true}
          >
            Next Question
          </Link>
        )}
      </div>
      {!loading && questions.length > 0 && (
        <div className="container w-75 mx-auto">
          <div className="row justify-content-center gap-2">
            <h4 className="mt-4 mb-3 col-md-6">Explore Similar questions</h4>
            {questions.slice(0, 5).map((question, index) => {
              return (
                <Link
                  key={index}
                  className="nav-link col-md-6 col-md-6 d-flex align-items-center"
                  href={`/qna-bank/${question.Main_Subject.toLowerCase()}/${question.Sub_Subject.toLowerCase()}/${question.Question_Link
                    }?${new URLSearchParams({
                      subject: subjects.subject,
                      subSubject: subjects.subSubject,
                    }).toString()}`}
                  as={`/qna-bank/${question.Main_Subject.toLowerCase()}/${question.Sub_Subject.toLowerCase()}/${question.Question_Link
                    }`}
                >
                  <span className="mx-2" style={{ fontSize: 25 }}>
                    &#8226;
                  </span>
                  {linkToTitle(question.Question_Link)}
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </>
  );
};

export default SolutionPage;
