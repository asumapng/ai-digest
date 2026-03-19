import { NextResponse } from 'next/server';
import { removeSubscriber } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    removeSubscriber(email);
    return new NextResponse(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #000; color: #fff; height: 100vh;">
        <h1 style="color: #ff4d00;">AI Digest</h1>
        <p>You have been successfully unsubscribed from the newsletter.</p>
        <a href="/" style="color: #ff4d00; text-decoration: none;">Return to Home</a>
      </div>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
