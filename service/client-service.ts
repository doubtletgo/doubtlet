'use client';
import axios from 'axios';
import { QuestionListItem } from '@/types/question.types';
import { ApiResponse, WithMeta } from '@/types/index.types';
import { BlogListItem, BlogResponse } from '@/types/blog.types';
import { APP_URL } from './config';

export const apiClient = axios.create({
  baseURL: typeof window == 'undefined' ? APP_URL : window?.location.origin,
});

export const getNotes = async (name: string) => {
  try {
    const resp = await apiClient.post('/api/notes', { name });
    const data = resp.data;
    return data.notes || '';
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const getFormulas = async (name: string) => {
  try {
    const resp = await apiClient.post('/api/formulas', { name });
    const data = resp.data;
    return data.formulas || '';
  } catch (error) {
    console.log(error);
    return '';
  }
};

type QuestionResponse = WithMeta & {
  questions: QuestionListItem[];
};
export const getQuestions = async (options: {
  page?: number;
  subject?: string;
  subSubject?: string;
}): Promise<QuestionResponse | null> => {
  try {
    const { page, subSubject = '', subject = '' } = options;
    const resp = await apiClient.post('/api/content', {
      page,
      subSubject,
      subject,
    });
    const data = resp.data;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllQuestions = async (payload: {
  subject: string;
  subSubject: string;
}): Promise<QuestionListItem[] | null> => {
  try {
    const resp = await apiClient.get('/api/content', {
      params: {
        a: payload.subject,
        b: payload.subSubject,
      },
    });
    const data = resp.data;
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getBlogs = async (
  page: number
): ApiResponse<(WithMeta & { blogs: BlogListItem[] }) | null> => {
  try {
    console.log('requested');
    const resp = await apiClient.get('/api/blogs', { params: { page } });
    return resp.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getBlogDetails = async (
  blogLink: string
): ApiResponse<{ blog: BlogResponse } | null> => {
  try {
    if (!blogLink) throw new Error('Blog Link not provided');
    const resp = await apiClient.post('/api/blogs', { blogLink });
    return resp.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getComments = async (name: string) => {
  try {
    const resp = await apiClient.get(`/api/comments?name=${name}`);
    return resp.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addComment = async (data: {
  name: string;
  email: string;
  remarks: string;
  item_type: string;
  item_name: string;
}) => {
  try {
    const resp = await apiClient.post('/api/comments', data);
    return resp.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
