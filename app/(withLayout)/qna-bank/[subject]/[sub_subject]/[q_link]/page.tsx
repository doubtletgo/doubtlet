import PageHeader from '@/components/PageHeader';
import SolutionPage from '@/components/QBanks/SolutionPage';
import apiService from '@/service/api-service';
import { PageProps } from '@/types/question.types';

export async function generateMetadata({ params }: PageProps) {
  const { q_link } = params;
  const solution = await apiService.getQuestionSolution(q_link);
  const title = `Solve ${
    solution?.QuestionDisplayText.slice(0, 50) || ''
  } | Doubtlet.com`;
  const description = `Solution of ${solution?.QuestionDisplayText || ''}`;

  return {
    title,
    description,
  };
}

const Page = async ({ params }: PageProps) => {
  const { subject, sub_subject, q_link } = params;
  const solution = await apiService.getQuestionSolution(q_link);
  if (!solution) return null;

  const subjects = {
    subject,
    subSubject: sub_subject,
  };

  return (
    <>
      <PageHeader
        mdTitle={solution?.MarkdownQuestion}
        pageTitle={`${solution?.QuestionDisplayText}`}
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="qna-bank"
        breadcrumbUrl2="/qna-bank/"
        className="subject-page py-3"
      />
      <SolutionPage
        question={solution?.QuestionDisplayText}
        markdownSolution={solution?.MarkdownAnswer}
        solution={solution?.Answer}
        mdQuestion={solution?.MarkdownQuestion}
        subjects={subjects}
        link={solution.QuestionSearch}
      />
    </>
  );
};

export default Page;
