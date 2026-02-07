import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAndSaveAllFormulas,
  fetchAndSaveFormulaContent,
} from '@/lib/formula-parser';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name');

  try {
    if (name === 'all') {
      await fetchAndSaveAllFormulas();
      return NextResponse.json(
        {
          message: 'Successfully fetched and saved all formula files.',
          success: true,
        },
        { status: 200 }
      );
    } else if (name) {
      await fetchAndSaveFormulaContent(name);
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
        success: true,
      },
      { status: 500 }
    );
  }
}
