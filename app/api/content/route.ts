import { NextRequest, NextResponse } from 'next/server';
import { API_URLS, BASE_API_URL } from '../../../service/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page = 1, subject, subSubject, size = 16 } = body;

    const reqUrl = new URL(BASE_API_URL + API_URLS.QUESTIONS);
    reqUrl.searchParams.append('request', 'question_details');
    reqUrl.searchParams.append('page', page);
    reqUrl.searchParams.append('per_page', size);
    reqUrl.searchParams.append('subject_id', subject);
    reqUrl.searchParams.append('sub_subject_id', subSubject);

    const data = await fetch(reqUrl);
    const resp = await data.json();

    const total = resp.meta.total_records || 0;
    const totalPages = Math.ceil(total / size);
    const response = {
      questions: resp.data,
      meta: { total, totalPages },
      currentPage: page,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sub = searchParams.get('a');
    const subSubject = searchParams.get('b');

    const reqUrl = new URL(BASE_API_URL + API_URLS.QUESTIONS);
    reqUrl.searchParams.append('request', 'question_details');
    if (sub) reqUrl.searchParams.append('subject_id', sub);
    if (subSubject) reqUrl.searchParams.append('sub_subject_id', subSubject);

    const data = await fetch(reqUrl);
    const resp = await data.json();

    return NextResponse.json(resp);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: error }, { status: 500 });
  }
}
