import PageHeader from '@/components/PageHeader';
import RefundPolicyContent from '@/components/refund-policy';

export const metadata = {
  title: 'Refund Policy',
  description:
    'This Privacy Policy governs how we handle personally identifiable information that we collect when you visit our website and use our services. This policy also governs how we handle any personally identifiable information provided to us by third parties.',
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="Refund Policy"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Refund Policy"
      />
      <RefundPolicyContent />
    </>
  );
};

export default Page;
