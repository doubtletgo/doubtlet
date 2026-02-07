import FeaturedServices from '@/components/featured-services';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'Features',
  description:
    'Proven Methodology, Effective Learning, Supportive Culture(24x7 Support), Flexible and Convenient Learning, Expert Teaching Team and Transparent Fees Structure',
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="Doubtlet Features"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="features"
      />
      <FeaturedServices />
    </>
  );
};

export default Page;
