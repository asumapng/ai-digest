import { NextResponse } from 'next/server';
import { getLatestNews, getArchiveDates, getNewsByDate } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    if (type === 'archive_dates') {
      const dates = getArchiveDates();
      return NextResponse.json(dates);
    }

    if (date) {
      const news = getNewsByDate(date, limit, offset);
      return NextResponse.json(news);
    }

    const news = getLatestNews(limit, offset);
    return NextResponse.json(news);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
