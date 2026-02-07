import AboutUsContent from '@/components/about-us-content';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'About Us',
  description:
    'Doubtlet seeks to provide you a platform that lets you flourish your knowledge anytime, anywhere.',
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="About Us"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="About Us"
      />
      <AboutUsContent />
    </>
  );
};

export default Page;
