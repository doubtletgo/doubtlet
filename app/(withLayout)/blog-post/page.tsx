import AdComponent from '@/components/AdSense';
import BlogContent from '@/components/blogs/BlogContent';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: `Blog Posts | Doubtlet`,
  description: `Explore the concepts of mathematics, chemistry, physics, and biology. From numbers to molecules, unlock the secrets of the Science | Doubtlet`,
};

const Page = async () => {
  const response = await fetch(
    `https://doubt.doubtlet.com/api/get-blog-details.php?request=blog_abstract&page=1&per_page=80`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return null;
    });

  const blogs = response?.data || [];
  const total = response?.meta?.total_records || 0;

  return (
    <>
      <PageHeader
        pageTitle="Blog Posts"
        descriptionText="Explore the concepts of mathematics, chemistry, physics, and biology. From numbers to molecules, unlock the secrets of the Science."
        breadcrumbTextOne="Home"
        breadcrumbUrl="/"
        breadcrumbTextTwo="Blog-post"
        className="blogs-page mt-5"
      />
      {response && <BlogContent totalBlogs={total} initialBlogs={blogs} />}
      <AdComponent />
    </>
  );
};

export default Page;
