export interface SeedSource {
  name: string;
  url: string;
  feed_type: string;
  tier: string;
  category: string;
  fetch_interval_minutes: number;
}

export const SEED_SOURCES: SeedSource[] = [
  // T1 Official
  { name: "OpenAI Blog", url: "https://openai.com/blog/rss.xml", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },
  { name: "Anthropic Blog", url: "https://www.anthropic.com/feed.xml", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },
  { name: "Google AI Blog", url: "https://blog.google/technology/ai/rss/", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },
  { name: "DeepMind Blog", url: "https://blog.google/technology/ai/rss/", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },
  { name: "Meta AI Blog", url: "https://about.fb.com/news/feed/", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },
  { name: "Apple Machine Learning", url: "https://machinelearning.apple.com/rss.xml", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 180 },
  { name: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/feed/", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 180 },
  { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },

  // T1 Media
  { name: "MIT Technology Review", url: "https://www.technologyreview.com/feed/", feed_type: "rss", tier: "T1", category: "媒体", fetch_interval_minutes: 180 },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", feed_type: "rss", tier: "T1", category: "媒体", fetch_interval_minutes: 120 },
  { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", feed_type: "rss", tier: "T1", category: "媒体", fetch_interval_minutes: 120 },
  { name: "Ars Technica AI", url: "https://feeds.arstechnica.com/arstechnica/features", feed_type: "rss", tier: "T1", category: "媒体", fetch_interval_minutes: 180 },
  { name: "WIRED", url: "https://www.wired.com/feed/rss", feed_type: "rss", tier: "T1", category: "媒体", fetch_interval_minutes: 180 },

  // T1 Academic
  { name: "ArXiv cs.AI", url: "https://rss.arxiv.org/rss/cs.AI", feed_type: "rss", tier: "T1", category: "学术", fetch_interval_minutes: 360 },
  { name: "ArXiv cs.LG", url: "https://rss.arxiv.org/rss/cs.LG", feed_type: "rss", tier: "T1", category: "学术", fetch_interval_minutes: 360 },

  // T2 Community
  { name: "Hacker News AI", url: "https://hnrss.org/newest?q=AI+artificial+intelligence", feed_type: "rss", tier: "T2", category: "社区", fetch_interval_minutes: 60 },
  { name: "Reddit r/MachineLearning", url: "https://old.reddit.com/r/MachineLearning/.rss", feed_type: "rss", tier: "T2", category: "社区", fetch_interval_minutes: 120 },
  { name: "Reddit r/artificial", url: "https://old.reddit.com/r/artificial/.rss", feed_type: "rss", tier: "T2", category: "社区", fetch_interval_minutes: 120 },

  // T1 Chinese
  { name: "量子位", url: "https://www.qbitai.com/feed", feed_type: "rss", tier: "T1", category: "中文", fetch_interval_minutes: 120 },
  { name: "机器之心", url: "https://www.jiqizhixin.com/rss", feed_type: "rss", tier: "T1", category: "中文", fetch_interval_minutes: 120 },
  { name: "AI科技评论", url: "https://www.leiphone.com/feed", feed_type: "rss", tier: "T1", category: "中文", fetch_interval_minutes: 180 },
  { name: "少数派 AI", url: "https://sspai.com/feed", feed_type: "rss", tier: "T1", category: "中文", fetch_interval_minutes: 240 },

  // T2 Blogs
  { name: "Andrej Karpathy", url: "https://karpathy.github.io/feed.xml", feed_type: "rss", tier: "T2", category: "博客", fetch_interval_minutes: 360 },
  { name: "The Gradient", url: "https://thegradient.pub/rss/", feed_type: "rss", tier: "T2", category: "博客", fetch_interval_minutes: 360 },
  { name: "Ahead of AI", url: "https://magazine.sebastianraschka.com/feed", feed_type: "rss", tier: "T2", category: "博客", fetch_interval_minutes: 360 },
];

export async function seedSources(sql: any): Promise<void> {
  for (const source of SEED_SOURCES) {
    await sql`
      INSERT INTO sources (name, url, feed_type, tier, category, fetch_interval_minutes)
      VALUES (${source.name}, ${source.url}, ${source.feed_type}, ${source.tier}, ${source.category}, ${source.fetch_interval_minutes})
      ON CONFLICT (url) DO NOTHING
    `;
  }
}
