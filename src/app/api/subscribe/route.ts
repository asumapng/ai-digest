import { NextResponse } from 'next/server';
import { initDb, addSubscriber } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (process.env.VERCEL && !process.env.DATABASE_URL) {
      console.error('CRITICAL: DATABASE_URL is missing on Vercel. Subscription will fail.');
      return NextResponse.json({ error: 'Database not configured. Please see deployment guide.' }, { status: 500 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await initDb();
    await addSubscriber(email);
    
    // Send welcome email proactively
    try {
      await sendWelcomeEmail(email);
    } catch (e) {
      console.error('Failed to send welcome email:', e);
    }

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
