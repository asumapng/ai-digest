import { runNewsletterJob } from '../src/lib/jobs';
import { loadEnv } from './utils';

loadEnv();

async function main() {
  try {
    const result = await runNewsletterJob();
    console.log(`Job finished. Items processed: ${result.count}`);
    process.exit(0);
  } catch (error) {
    console.error('Job failed:', error);
    process.exit(1);
  }
}

main();
