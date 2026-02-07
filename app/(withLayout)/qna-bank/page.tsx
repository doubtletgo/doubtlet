import React from 'react';
import AdSense from '@/components/AdSense';
import PageHeader from '@/components/PageHeader';
import SubjectsPage from '@/components/QBanks/SubjectsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Question and Answer Bank',
  description:
    'This page will help you explore step-by-step solutions of problems from all the subjects.',
};

const QBank = () => {
  return (
    <>
      <PageHeader
        pageTitle="Question and Answer Bank"
        descriptionText="This page will help you explore step-by-step solutions of problems from all the subjects."
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="QnA Bank"
        breadcrumbUrl2="/qna-bank/"
      />
      <SubjectsPage />
      <AdSense />
    </>
  );
};

export default QBank;
