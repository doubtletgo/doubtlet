import FullBlogsPage from '@/components/blogs/FullBlogsPage';
import PageHeader from '@/components/PageHeader';
import apiService from '@/service/api-service';
import { BlogListItem } from '@/types/blog.types';
import { PageProps } from '@/types/question.types';

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `https://doubt.doubtlet.com/api/get-blog-details.php?request=blog_abstract&page=1&per_page=80`
    );
    const data = await response.json();

    const blogs: BlogListItem[] = data.data || [];
    return blogs.map((blog) => ({
      blog_link: blog.blog_link,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { blog_link } = params;
  const blog = await apiService.getBlogDetails(blog_link);
  const title = blog?.meta_title || '';
  const description = blog?.meta_description || '';

  return {
    title,
    description,
  };
}

const Page = async ({ params }: PageProps) => {
  const blogLink = params.blog_link;
  const blog = await apiService.getBlogDetails(blogLink);
  if (!blog) return null;
  const {
    meta_description = '',
    meta_title = '',
    author = '',
    publisher = '',
    content = '',
  } = blog;

  return (
    <>
      <PageHeader
        className="blogs-page mt-0"
        pageTitle={`${meta_title}   `}
        breadcrumbTextOne="Home"
        descriptionText={`${meta_description}`}
        breadcrumbUrl="/"
        breadcrumbTextTwo="Blog-post"
        breadcrumbUrl2="/blog-post"
      />
      <FullBlogsPage
        author={author}
        publisher={publisher}
        content={content}
        link={blog.blog_link}
      />
    </>
  );
};

export default Page;
