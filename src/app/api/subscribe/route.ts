import { NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    addSubscriber(email);
    
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
