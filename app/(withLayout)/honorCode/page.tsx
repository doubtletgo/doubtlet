import HonorCodeContent from '@/components/honor-code';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'Honor Code',
  description: `Doubtlet understands that the Academic process in a student’s life has its own crust and trough. 
    But the integrity, solidarity, and commitment shown during the process make a learner and instructor ascend in life.`,
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="Honor Code"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Honor Code"
      />
      <HonorCodeContent />
    </>
  );
};

export default Page;
