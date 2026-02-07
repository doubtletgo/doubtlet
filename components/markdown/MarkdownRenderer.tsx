'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import remarkHeadingId from 'remark-heading-id';
import rehypeRaw from 'rehype-raw';

type Props = {
  children: string;
  className?: string;
};

function RenderMarkDown({ children, className = '' }: Props) {
  return (
    <div
      className={`form-control-plaintext markdown-notes ${
        className ? className : ''
      }`}
      id="notes-container"
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkHeadingId]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default RenderMarkDown;
