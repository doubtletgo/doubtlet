import ContactForm from '@/components/Contact/ContactForm';
import ContactInfo from '@/components/Contact/ContactInfo';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'Contact Us',
  description: 'Drop Us Message For Any Query',
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="Drop a Query"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Contact"
      />
      <ContactForm />
      <ContactInfo />
    </>
  );
};

export default Page;
