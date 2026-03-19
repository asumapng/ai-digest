import { NextResponse } from 'next/server';
import { runNewsletterJob } from '@/lib/jobs'; // I'll create this helper

export async function GET(req: Request) {
  // Simple auth check via header (standard for Vercel Cron)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await runNewsletterJob();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Job failed' }, { status: 500 });
  }
}
