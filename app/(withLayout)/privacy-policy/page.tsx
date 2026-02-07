import PageHeader from '@/components/PageHeader';
import PrivacyPolicyContent from '@/components/privacy-policy';
export const metadata = {
  title: 'Privacy Policy',
  description:
    'This Privacy Policy governs how we handle personally identifiable information that we collect when you visit our website and use our services. This policy also governs how we handle any personally identifiable information provided to us by third parties.',
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="Privacy Policy"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Privacy Policy"
      />
      <PrivacyPolicyContent />
    </>
  );
};

export default Page;
