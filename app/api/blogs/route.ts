import { NextRequest, NextResponse } from 'next/server';
import {
  API_URLS,
  BASE_API_URL,
  BLOGS_PER_PAGE,
} from '../../../service/config';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page')!;

    const reqUrl = new URL(BASE_API_URL + API_URLS.GET_BLOG_LIST);
    reqUrl.searchParams.append('request', 'blog_abstract');
    reqUrl.searchParams.append('page', page);
    reqUrl.searchParams.append('per_page', BLOGS_PER_PAGE.toString());

    const data = await fetch(reqUrl);
    const resp = await data.json();
    const total = resp.meta.total_records || 0;
    const totalPages = Math.ceil(total / BLOGS_PER_PAGE);

    const response = {
      blogs: resp.data || [],
      meta: { total, totalPages },
      currentPage: page,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blogLink = '' } = body;
    if (!blogLink) throw new Error('Blog Details not provided');
    const reqUrl = new URL(BASE_API_URL + API_URLS.GET_BLOG_LIST);
    reqUrl.searchParams.append('request', 'blog_details');
    reqUrl.searchParams.append('blog_link', blogLink);

    const data = await fetch(reqUrl);
    const resp = await data.json();
    const blog = resp.data || {};
    const response = { blog };
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: error }, { status: 500 });
  }
}
