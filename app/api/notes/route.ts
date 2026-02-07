import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAndSaveAllNotes,
  fetchAndSaveNotesContent,
} from '@/lib/notes-parser';
import { getNotesServerSide } from '@/helpers/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name;

    const respNotes = await getNotesServerSide(name);

    return NextResponse.json({ notes: respNotes });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ notes: '', error });
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name');

  try {
    if (name === 'all') {
      await fetchAndSaveAllNotes();
      return NextResponse.json(
        {
          message: 'Successfully fetched and saved all formula files.',
          success: true,
        },
        { status: 200 }
      );
    } else if (name) {
      await fetchAndSaveNotesContent(name);
      return NextResponse.json(
        {
          message: `Successfully fetched and saved formula "${name}".`,
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Please provide a valid formula name or 'all'.",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching formulas:', error);
    return NextResponse.json(
      {
        message: 'Error fetching formulas',
        error: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
