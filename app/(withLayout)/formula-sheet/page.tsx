import Formula from '@/components/FormulaArchieve/Formula';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'Formula sheet | Doubtlet',
  description:
    'This page will help you to revise formulas and concepts instantly for all the subjects.',
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="Formula Sheet"
        descriptionText="This page will help you to revise formulas and concepts instantly for all the subjects."
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Formula-Sheet"
        breadcrumbUrl2="/formula-sheet"
        className="subject-page py-3"
      />
      <Formula />;
    </>
  );
};

export default Page;
