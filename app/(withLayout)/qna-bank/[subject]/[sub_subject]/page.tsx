import AdSense from '@/components/AdSense';
import PageHeader from '@/components/PageHeader';
import SubjectQuestionList from '@/components/QBanks/SubjectQuestionList';
import { PageProps } from '@/types/question.types';
import { SUBJECT_IDS } from '@/service/config';

export const metadata = {
  title: 'Question and Answer Bank',
  description:
    'This page will help you explore step-by-step solutions of problems from all the subjects.',
};

const Page = async ({ params: { sub_subject, subject } }: PageProps) => {
  const sub = SUBJECT_IDS[subject];
  const sub_sub = SUBJECT_IDS[sub_subject];

  return (
    <>
      <PageHeader
        pageTitle="Question and Answer Bank"
        descriptionText="This page will help you explore step-by-step solutions of problems from all the subjects."
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="QnA Bank"
        breadcrumbUrl2="/QnABank/"
      />
      <SubjectQuestionList subSubject={sub_sub} subject={sub} />
      <AdSense />
    </>
  );
};

export default Page;
