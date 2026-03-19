import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'newsletter.db');
const db = new Database(DB_PATH);

// Link Normalizer (removes trailing slashes and common tracking params)
function normalizeLink(url: string) {
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
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news_archive (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL, -- ADDED UNIQUE
    source TEXT NOT NULL,
    blob TEXT,
    highlights TEXT, -- JSON string
    pubDate DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;

export function addSubscriber(email: string) {
  const stmt = db.prepare('INSERT OR IGNORE INTO subscribers (email) VALUES (?)');
  return stmt.run(email);
}

export function removeSubscriber(email: string) {
  const stmt = db.prepare('DELETE FROM subscribers WHERE email = ?');
  return stmt.run(email);
}

export function getSubscribers() {
  return db.prepare('SELECT email FROM subscribers').all() as { email: string }[];
}

export function saveNews(news: any) {
  const normalizedLink = normalizeLink(news.link);
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO news_archive (title, link, source, blob, highlights, pubDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    news.title,
    normalizedLink,
    news.source,
    news.blob || '',
    JSON.stringify(news.highlights || []),
    news.pubDate instanceof Date ? news.pubDate.toISOString() : (news.pubDate || new Date().toISOString())
  );
}

export function getLatestNews(limit = 10, offset = 0) {
  return db.prepare('SELECT * FROM news_archive ORDER BY pubDate DESC LIMIT ? OFFSET ?').all(limit, offset);
}

export function getArchiveDates() {
  return db.prepare(`
    SELECT DISTINCT date(pubDate) as date 
    FROM news_archive 
    ORDER BY date DESC
  `).all() as { date: string }[];
}

export function getNewsByDate(date: string, limit = 10, offset = 0) {
  return db.prepare('SELECT * FROM news_archive WHERE date(pubDate) = ? ORDER BY pubDate DESC LIMIT ? OFFSET ?').all(date, limit, offset);
}
