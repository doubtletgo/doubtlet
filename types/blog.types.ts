export type BlogResponse = {
  blog_link: string;
  blog_id: string;
  blog_seo_id: string;
  content: string;
  display_blog: string;
  meta_title: string;
  meta_description: string;
  publisher: string;
  author: string;
  total_like_dislike: {
    Like: number;
    Dislike: number;
  };
};

export type BlogListItem = {
  blog_link: string;
  blog_id: string;
  blog_seo_id: string;
  content: string;
  display_blog: string;
  blog_category: string;
  image_path: string;
  total_like_dislike: {
    Like: number;
    Dislike: number;
  };
};
