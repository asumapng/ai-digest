import { scrapeNews } from './scraper';
import { saveNews, getSubscribers } from './db';
import { sendNewsletter } from './mailer';

export async function runNewsletterJob() {
  console.log('--- Executing AI Digest Job ---');
  
  try {
    // 1. Scrape (Restricted to 20 items / 6 sources)
    const newsItems = await scrapeNews();
    if (newsItems.length === 0) {
      console.log('No new items found.');
      return { success: true, count: 0 };
    }

    // 2. Save uniquely
    const savedItems = [];
    for (const item of newsItems) {
      const result = saveNews({
        ...item,
        blob: '',
        highlights: []
      });
      if (result.changes > 0) {
        savedItems.push(item);
      }
    }

    // 3. Send Emails
    const subscribers = getSubscribers().map(s => s.email);
    if (subscribers.length > 0 && savedItems.length > 0) {
      await sendNewsletter(subscribers, savedItems.map(item => ({
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
