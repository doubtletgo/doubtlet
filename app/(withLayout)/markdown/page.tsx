import MarkdownEditor from '@/components/markdown-editor';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'Markdown Editor | Doubtlet',
  description: 'DOubtlet',
};

const Page = () => {
  return (
    <>
      <PageHeader
        pageTitle="MarkDown Editor"
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="MarkDown Editor"
      />
      <MarkdownEditor />
    </>
  );
};

export default Page;
