import axios from 'axios';
import { API_URLS, BASE_API_URL } from './config';
import { SolutionResponse } from '@/types/question.types';
import { ApiResponse } from '@/types/index.types';
import { BlogResponse } from '@/types/blog.types';

export const apiClient = axios.create({
  baseURL: BASE_API_URL,
});

const getQuestionSolution = async (
  link: string
): ApiResponse<SolutionResponse | null> => {
  try {
    const response = await apiClient.get(
      API_URLS.GET_SOLUTION_DETAILS + `&question_link=` + link
    );
    return response.data.data?.[0];
  } catch {
    return null;
  }
};

const getBlogDetails = async (
  blogLink: string
): ApiResponse<BlogResponse | null> => {
  {
    try {
      const response = await apiClient.post(
        API_URLS.GET_BLOG_DETAILS +
          `?request=blog_details&blog_link=${blogLink}`
      );
      return response.data.data?.[0]?.[0];
    } catch {
      return null;
    }
  }
};

export default {
  getQuestionSolution,
  getBlogDetails,
};
