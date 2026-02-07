import RenderMarkDown from '@/components/markdown/MarkdownRenderer';
import PageHeader from '@/components/PageHeader';
import { toTitleCase } from '@/helpers/index';
import { PageProps } from '@/types/question.types';
import { getFormulaServerSide } from '@/helpers/server';

export const generateMetadata = async ({ params }: PageProps) => {
  const { name } = params;
  const title = toTitleCase(name);

  return {
    title: title + ' Formula Sheet Doubtlet',
    description: `This page will help you to revise formulas and concepts of  ${title} instantly for various exams.`,
  };
};

const Page = async ({ params }: PageProps) => {
  const { name } = params;
  const title = toTitleCase(name);
  const formulas = await getFormulaServerSide(name);

  return (
    <>
      <PageHeader
        pageTitle={`${title} Formula Sheet`}
        descriptionText={`This page will help you to revise formulas and concepts of ${title} instantly for various exams. `}
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Formula-Sheet"
        breadcrumbUrl2="/formula-sheet"
        breadcrumbTextThree={title}
        breadcrumbUrl3={`/${name}`}
        className="subject-page my-md-3 py-3"
      />
      <div className="container px-5 text-center mb-5">
        <div className="notes-container notes-card">
          {!!formulas && <RenderMarkDown>{formulas}</RenderMarkDown>}
        </div>
      </div>
    </>
  );
};

export default Page;
