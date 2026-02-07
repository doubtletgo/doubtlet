import React from 'react';

import RenderMarkDown from '../markdown/MarkdownRenderer';

type Props = {
  author: string;
  publisher: string;
  content: string | null;
  link: string;
};

const FullBlogsPage = ({ author, publisher, content, link }: Props) => {
  return (
    <div className="container mt-0 mb-3">
      <div className="card p-4 shadow-sm  bg-white  rounded-3 border-2">
        {!!content && (
          <div className="mt-4">
            <RenderMarkDown>{content}</RenderMarkDown>
          </div>
        )}

        <div className="fade-in animated fadeIn bg-primary mt-2 mb-5 p-3 rounded-3 shadow-sm">
          <div className="card bg-lightblue mb-3">
            <div className="card-body">
              <p className="card-title text-primary mb-3 fw-bold h5">
                Blog Information
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                <div className="mb-3 mb-sm-0">
                  <p className="card-text mb-0">
                    <strong
                      className="text-secondary"
                      style={{ fontSize: '20px' }}
                    >
                      Blog Author:
                    </strong>{' '}
                    <span className="text-dark" style={{ fontSize: '18px' }}>
                      {author}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="card-text mb-0">
                    <strong
                      className="text-secondary"
                      style={{ fontSize: '20px' }}
                    >
                      Blog Publisher:
                    </strong>{' '}
                    <span className="text-dark" style={{ fontSize: '18px' }}>
                      {publisher}
                    </span>
                  </p>
                </div>
              </div>
              <hr className="my-4" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FullBlogsPage;
