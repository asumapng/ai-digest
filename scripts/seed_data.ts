import { saveNews } from '../src/lib/db';

const mockNews = [
  {
    title: "The Future of Generative AI in Data Engineering",
    link: "https://example.com/ai-de",
    source: "Towards Data Science",
    blob: "Exploring how LLMs are automating pipeline generation and schema evolution in modern data stacks.",
    highlights: ["Automated SQL generation", "Dynamic schema mapping", "LLM-driven ETL orchestration"],
    pubDate: new Date()
  },
  {
    title: "Scalable Vector Databases for Real-time Analytics",
    link: "https://example.com/vector-db",
    source: "TechCrunch",
    blob: "A look at the latest benchmarks for Pinecone, Weaviate, and Milvus in production environments.",
    highlights: ["Low-latency retrieval", "Hybrid search strategies", "Cost-efficient scaling"],
    pubDate: new Date()
  },
  {
    title: "Open Source LLMs vs Specialized Models",
    link: "https://example.com/llm-vs-model",
    source: "Hacker News (AI)",
    blob: "Why small, fine-tuned models on internal data are outperforming GPT-4 in niche industry tasks.",
    highlights: ["Data privacy compliance", "Reduced inference costs", "Domain-specific accuracy"],
    pubDate: new Date()
  }
];

function seed() {
  console.log('Seeding mock data for testing...');
  for (const item of mockNews) {
    saveNews(item);
  }
  console.log('Seeding complete.');
}

seed();
