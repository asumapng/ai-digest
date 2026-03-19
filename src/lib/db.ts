import { createClient } from '@libsql/client';
import path from 'path';

const url = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'newsletter.db')}`;

const client = createClient({
  url: url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Link Normalizer (removes trailing slashes and common tracking params)
export function normalizeLink(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.delete('utm_source');
    u.searchParams.delete('utm_medium');
    u.searchParams.delete('utm_campaign');
    u.searchParams.delete('utm_content');
    u.searchParams.delete('utm_term');
    u.searchParams.delete('ref');
    return u.origin + u.pathname.replace(/\/$/, '');
  } catch (e) {
    return url.replace(/\/$/, '');
  }
}

// Initialize Tables
export async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS news_archive (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      link TEXT UNIQUE NOT NULL,
      source TEXT NOT NULL,
      blob TEXT,
      highlights TEXT, -- JSON string
      pubDate DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function addSubscriber(email: string) {
  return await client.execute({
    sql: 'INSERT OR IGNORE INTO subscribers (email) VALUES (?)',
    args: [email]
  });
}

export async function removeSubscriber(email: string) {
  return await client.execute({
    sql: 'DELETE FROM subscribers WHERE email = ?',
    args: [email]
  });
}

export async function getSubscribers() {
  const result = await client.execute('SELECT email FROM subscribers');
  return result.rows as unknown as { email: string }[];
}

export async function saveNews(news: any) {
  const normalizedLink = normalizeLink(news.link);
  const highlightsJson = JSON.stringify(news.highlights || []);
  const pubDate = news.pubDate instanceof Date ? news.pubDate.toISOString() : (news.pubDate || new Date().toISOString());

  return await client.execute({
    sql: `INSERT OR IGNORE INTO news_archive (title, link, source, blob, highlights, pubDate)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [news.title, normalizedLink, news.source, news.blob || '', highlightsJson, pubDate]
  });
}

export async function getLatestNews(limit = 10, offset = 0) {
  const result = await client.execute({
    sql: 'SELECT * FROM news_archive ORDER BY pubDate DESC LIMIT ? OFFSET ?',
    args: [limit, offset]
  });
  return result.rows;
}

export async function getArchiveDates() {
  const result = await client.execute(`
    SELECT DISTINCT date(pubDate) as date 
    FROM news_archive 
    ORDER BY date DESC
  `);
  return result.rows as unknown as { date: string }[];
}

export async function getNewsByDate(date: string, limit = 10, offset = 0) {
  const result = await client.execute({
    sql: 'SELECT * FROM news_archive WHERE date(pubDate) = ? ORDER BY pubDate DESC LIMIT ? OFFSET ?',
    args: [date, limit, offset]
  });
  return result.rows;
}
