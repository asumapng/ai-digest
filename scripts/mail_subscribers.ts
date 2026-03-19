import { getSubscribers, initDb } from '../src/lib/db';
import { sendSubscribersList } from '../src/lib/mailer';
import { loadEnv } from './utils';

loadEnv();

async function main() {
  console.log('--- Starting Nightly Subscriber Backup Job ---');
  
  try {
    await initDb();
    
    const subs = await getSubscribers();
    const subscriberEmails = subs.map(s => s.email);
    const adminEmail = 'sumie2717@gmail.com';

    console.log(`Found ${subscriberEmails.length} subscribers. Sending to ${adminEmail}...`);
    
    await sendSubscribersList(adminEmail, subscriberEmails);
    
    console.log('Backup email sent successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Backup Job Failed:', error);
    process.exit(1);
  }
}

main();
