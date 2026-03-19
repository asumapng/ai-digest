import { scrapeNews } from './scraper';
import { saveNews, getSubscribers, initDb } from './db';
import { sendNewsletter } from './mailer';

export async function runNewsletterJob() {
  console.log('--- Executing AI Digest Job ---');
  
  try {
    await initDb();
    
    // 1. Scrape (Restricted to 20 items / 6 sources)
    const newsItems = await scrapeNews();
    if (newsItems.length === 0) {
      console.log('No new items found.');
      return { success: true, count: 0 };
    }

    // 2. Save uniquely
    const savedItems = [];
    for (const item of newsItems) {
      const result = await saveNews({
        ...item,
        blob: '',
        highlights: []
      });
      // @ts-ignore
      if (result.rowsAffected > 0) {
        savedItems.push(item);
      }
    }

    // 3. Send Emails
    const subs = await getSubscribers();
    const subscriberEmails = subs.map(s => s.email);
    
    if (subscriberEmails.length > 0 && savedItems.length > 0) {
      await sendNewsletter(subscriberEmails, savedItems.map(item => ({
        ...item,
        blob: '',
        highlights: []
      })));
    }

    return { success: true, count: savedItems.length };
  } catch (error) {
    console.error('Job Error:', error);
    throw error;
  }
}
