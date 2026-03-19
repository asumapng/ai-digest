import { NextResponse } from 'next/server';
import { getLatestNews, getArchiveDates, getNewsByDate, initDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    if (type === 'archive_dates') {
      const dates = await getArchiveDates();
      return NextResponse.json(dates);
    }

    const news = date 
      ? await getNewsByDate(date, limit, offset)
      : await getLatestNews(limit, offset);
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('API News Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
