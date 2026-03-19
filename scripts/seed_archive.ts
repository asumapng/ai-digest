import { saveNews } from '../src/lib/db';
import { subDays } from 'date-fns';

const oldDate = subDays(new Date(), 2);

const mockNews = [
  {
    title: "Historical Breakthrough in Neural Architecture Search",
    link: "https://example.com/nas-old",
    source: "Arxiv",
    blob: "A look back at the 2024 results for automated neural network design using reinforcement learning.",
    highlights: ["Efficiency gains of 40%", "SOTA performance on ImageNet", "Open-source codebase release"],
    pubDate: oldDate
  }
];

function seed() {
  console.log(`Seeding archive data for ${oldDate.toISOString()}...`);
  for (const item of mockNews) {
    saveNews(item);
  }
  console.log('Archive seeding complete.');
}

seed();
