export interface SeedSource {
  name: string;
  url: string;
  feed_type: string;
  tier: string;
  category: string;
  fetch_interval_minutes: number;
}

export const SEED_SOURCES: SeedSource[] = [
  // T1 Official — AI 头部公司官方博客
  { name: "OpenAI Blog", url: "https://openai.com/blog/rss.xml", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },
  { name: "Anthropic Blog", url: "https://www.anthropic.com/feed.xml", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },
  { name: "Google AI Blog", url: "https://blog.google/technology/ai/rss/", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },
  { name: "DeepMind Blog", url: "https://deepmind.google/blog/rss.xml", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 180 },
  { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml", feed_type: "rss", tier: "T1", category: "官方", fetch_interval_minutes: 120 },

  // T1 Media — 专注 AI 的媒体
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", feed_type: "rss", tier: "T1", category: "媒体", fetch_interval_minutes: 120 },
  { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", feed_type: "rss", tier: "T1", category: "媒体", fetch_interval_minutes: 120 },

  // T1 Academic — 高信号学术论文
  { name: "ArXiv cs.AI", url: "https://rss.arxiv.org/rss/cs.AI", feed_type: "rss", tier: "T1", category: "学术", fetch_interval_minutes: 360 },

  // T2 Community — 高质量社区精选
  { name: "Hacker News AI", url: "https://hnrss.org/newest?q=AI+artificial+intelligence", feed_type: "rss", tier: "T2", category: "社区", fetch_interval_minutes: 60 },
  { name: "Reddit r/MachineLearning", url: "https://old.reddit.com/r/MachineLearning/.rss", feed_type: "rss", tier: "T2", category: "社区", fetch_interval_minutes: 120 },

  // T1 Chinese — 中文 AI 头部媒体
  { name: "量子位", url: "https://www.qbitai.com/feed", feed_type: "rss", tier: "T1", category: "中文", fetch_interval_minutes: 120 },
  { name: "机器之心", url: "https://www.jiqizhixin.com/rss", feed_type: "rss", tier: "T1", category: "中文", fetch_interval_minutes: 120 },

  // T2 Blogs — 高质量个人博客
  { name: "Andrej Karpathy", url: "https://karpathy.github.io/feed.xml", feed_type: "rss", tier: "T2", category: "博客", fetch_interval_minutes: 360 },
  { name: "Ahead of AI", url: "https://magazine.sebastianraschka.com/feed", feed_type: "rss", tier: "T2", category: "博客", fetch_interval_minutes: 360 },
  { name: "Simon Willison", url: "https://simonwillison.net/atom/entries/", feed_type: "rss", tier: "T2", category: "tool", fetch_interval_minutes: 1440 },
  { name: "Lilian Weng", url: "https://lilianweng.github.io/lil-log/feed.xml", feed_type: "rss", tier: "T2", category: "research", fetch_interval_minutes: 1440 },

  // T2 AI 商业化 & 观点
  { name: "Latent Space", url: "https://www.latent.space/feed", feed_type: "rss", tier: "T2", category: "product", fetch_interval_minutes: 1440 },
  { name: "宝玉的分享", url: "https://baoyu.io/feed.xml", feed_type: "rss", tier: "T2", category: "opinion", fetch_interval_minutes: 1440 },
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
