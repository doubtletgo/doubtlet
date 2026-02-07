import PageHeader from '@/components/PageHeader';
import TermsAndConditionsContent from '@/components/terms-and-conditions';

export const metadata = {
  title: 'Terms And Conditions',
  description:
    'The ‘ Terms of Use’ apply to all our websites, mobile apps, applications and other initiative features or services that post a link of any of the above mentioned services under Doubtlet tree.',
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="Terms And Conditions"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Terms And Conditions"
      />
      <TermsAndConditionsContent />
    </>
  );
};

export default Page;
