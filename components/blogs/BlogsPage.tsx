import React from 'react';
import Link from 'next/link';
import { BlogListItem } from '@/types/blog.types';

const createTitle = (title: string) => title?.replaceAll('-', ' ');

type Props = {
  blog: BlogListItem;
};

const BlogPage = ({ blog }: Props) => {
  return (
    <Link
      className="outline-btn btn-outline-primary subject-button"
      href={`/blog-post/${blog.blog_link}`}
    >
      {createTitle(blog.blog_link)}
    </Link>
  );
};

export default BlogPage;
