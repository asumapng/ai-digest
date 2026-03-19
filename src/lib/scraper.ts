import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { subDays, isAfter, startOfDay, endOfDay } from 'date-fns';

const parser = new Parser();

export interface NewsItem {
  title: string;
  link: string;
  pubDate: Date;
  source: string;
}

const SOURCES = [
  // AI & Machine Learning
  { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/' },
  { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml' },
  { name: 'Anthropic Blog', url: 'https://www.anthropic.com/news/rss.xml' },
  { name: 'DeepMind Blog', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'Meta AI Blog', url: 'https://ai.meta.com/blog/rss/' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'MIT Tech Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/' },
  
  // Data Science & Analytics
  { name: 'Towards Data Science', url: 'https://towardsdatascience.com/feed' },
  { name: 'KDnuggets', url: 'https://www.kdnuggets.com/feed' },
  { name: 'DataCamp Blog', url: 'https://www.datacamp.com/blog/rss.xml' },
  { name: 'Kaggle Blog', url: 'https://medium.com/feed/kaggle-blog' },
  { name: 'Analytics Vidhya', url: 'https://www.analyticsvidhya.com/blog/feed/' },
  
  // Data Engineering & MLOps
  { name: 'Data Engineering Weekly', url: 'https://www.dataengineeringweekly.com/feed' },
  { name: 'Seattle Data Guy', url: 'https://www.theseattledataguy.com/feed' },
  { name: 'Databricks Blog', url: 'https://www.databricks.com/blog/feed' },
  { name: 'dbt Blog', url: 'https://www.getdbt.com/blog/rss.xml' },
  
  // News & Newsletters
  { name: 'The Batch', url: 'https://www.deeplearning.ai/the-batch/rss/' },
  { name: 'Import AI', url: 'https://importai.substack.com/feed' },
  { name: 'Last Week in AI', url: 'https://www.lastweekin.ai/feed' },
  { name: 'Data Elixir', url: 'https://dataelixir.com/feed' },
  
  // Industry & Research
  { name: 'Netflix Tech Blog', url: 'https://netflixtechblog.com/feed' },
  { name: 'Uber Engineering', url: 'https://www.uber.com/en-IN/blog/engineering/rss/' },
  { name: 'Airbnb Engineering', url: 'https://medium.com/feed/airbnb-engineering' },
  { name: 'Spotify Engineering', url: 'https://engineering.atspotify.com/feed/' },
  { name: 'ArXiv AI', url: 'http://export.arxiv.org/rss/cs.AI' },
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' }
];

export async function scrapeNews(): Promise<NewsItem[]> {
  const newsItems: NewsItem[] = [];
  const distinctSources = new Set<string>();
  const yesterday = subDays(new Date(), 1);

  for (const source of SOURCES) {
    // Stop condition: 20 items AND at least 6 distinct sources
    if (newsItems.length >= 20 && distinctSources.size >= 6) {
      console.log('Stop condition met: 20 items from 6+ sources.');
      break;
    }

    try {
      console.log(`Scraping ${source.name}...`);
      const feed = await parser.parseURL(source.url);

      for (const item of feed.items) {
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

        if (isAfter(pubDate, yesterday)) {
          newsItems.push({
            title: item.title || 'Untitled',
            link: item.link || '',
            source: source.name,
            pubDate
          });
          distinctSources.add(source.name);
          
          // Internal check within a single source scrape
          if (newsItems.length >= 20 && distinctSources.size >= 6) break;
        }
      }
    } catch (error) {
      console.error(`Failed to scrape ${source.name}:`, error);
    }
  }

  return newsItems.slice(0, 20); // Guarantee 20 max
}
