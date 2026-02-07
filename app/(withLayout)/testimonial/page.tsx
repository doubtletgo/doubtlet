import PageHeader from '@/components/PageHeader';
import TestimonialCodeContent from '@/components/testimonial-code-content';

export const metadata = {
  title: `Testimonial Page | Doubtlet`,
  description: `Explore the snapshots of the results of our students as a proof of our expertise from STEM domain | Doubtlet`,
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="Testimonial"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Testimonial"
      />
      <TestimonialCodeContent />
    </>
  );
};

export default Page;
