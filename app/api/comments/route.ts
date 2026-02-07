import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get('name');
    const myHeaders = new Headers();
    myHeaders.append('accept', '*/*');
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('x-api-sender', 'e8ffc7759146cacbd219a2b1efda218b');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    const response = await fetch(
      `https://doubt.doubtlet.com/api/feedback.php?item_id=${name}`,
      requestOptions
    );
    const data = await response.json();
    return NextResponse.json({ success: true, data: data.data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = {
      name: body.name,
      email: body?.email || '',
      remarks: body.remarks,
      item_id: body.item_name,
      item_type: body.item_type,
    };
    const myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('x-api-sender', 'e8ffc7759146cacbd219a2b1efda218b');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload),
    };

    const response = await fetch(
      `https://doubt.doubtlet.com/api/feedback.php`,
      requestOptions
    );
    console.log(response);
    return NextResponse.json({ success: response.ok, data: response });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error });
  }
}
