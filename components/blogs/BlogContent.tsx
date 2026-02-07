'use client';
import React, { useEffect, useState } from 'react';
import BlogPage from './BlogsPage';
import { getBlogs } from '@/service/client-service';
import { BlogListItem } from '@/types/blog.types';

type Props = {
  initialBlogs: BlogListItem[];
  totalBlogs: number;
};

const BlogContent = ({ initialBlogs, totalBlogs }: Props) => {
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState(initialBlogs);
  const [currentPage, setCurrentPage] = useState(1);
  const [serverPage, setServerPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const blogsPerPage = 16;
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  const fetchBlogs = async (pageNumber: number) => {
    try {
      setLoading(true);
      const data = await getBlogs(pageNumber);

      const newBlogs = data?.blogs || [];
      setBlogs((prev) => [...prev, ...newBlogs]);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (
      currentPage > Math.ceil(blogs.length / blogsPerPage) &&
      !loading &&
      blogs.length < totalBlogs
    ) {
      fetchBlogs(serverPage);
      setServerPage((prev) => prev + 1);
    }
  }, [currentPage, blogs.length, loading, serverPage, totalBlogs]);
  const filteredBlogs = blogs.filter(
    (b) =>
      b.blog_link.toLowerCase().includes(search.toLowerCase()) ||
      b.blog_category.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="w-100 d-flex justify-content-center align-items-center">
          <input
            className="form-control rounded-pill p-4 shadow mb-0 w-50 mx-auto"
            placeholder="Type to search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="row gap-4 mt-5 mx-auto justify-content-center">
          {paginatedBlogs.length > 0
            ? paginatedBlogs.map((blog, index) => (
                <BlogPage key={index} blog={blog} />
              ))
            : !loading && <p>No blogs found.</p>}
        </div>
      </div>
      <div className="my-3"></div>
      <div className="d-flex justify-content-center my-4">
        <button
          className="btn btn-success mx-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            disabled={loading}
            className={`btn mx-1 ${
              currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-success mx-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogContent;
