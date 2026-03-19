import { runNewsletterJob } from '../src/lib/jobs';
import { loadEnv } from './utils';

loadEnv();

async function main() {
  console.log('Starting daily newsletter script...');
  console.log('Environment Check:', {
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasDbUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd()
  });

  try {
    const result = await runNewsletterJob();
    console.log(`Job successfully finished. Items processed: ${result.count}`);
    process.exit(0);
  } catch (error: any) {
    console.error('CRITICAL: Daily Newsletter Job Failed!');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    process.exit(1);
  }
}

main();
