export interface BizSeedSource {
  name: string;
  url: string;
  tier: number;
  fetch_interval_minutes: number;
}

export const BIZ_SEED_SOURCES: BizSeedSource[] = [
  { name: "Starter Story", url: "https://www.starterstory.com/rss", tier: 1, fetch_interval_minutes: 1440 },
  { name: "Indie Hackers", url: "https://www.indiehackers.com/feed", tier: 1, fetch_interval_minutes: 1440 },
  { name: "Product Hunt", url: "https://www.producthunt.com/feed", tier: 1, fetch_interval_minutes: 1440 },
  { name: "Reddit r/SaaS", url: "https://old.reddit.com/r/SaaS/.rss", tier: 2, fetch_interval_minutes: 1440 },
  { name: "Reddit r/SideProject", url: "https://old.reddit.com/r/SideProject/.rss", tier: 2, fetch_interval_minutes: 1440 },
  { name: "Hacker News 搞钱", url: "https://hnrss.org/newest?q=AI+(MRR+OR+revenue+OR+SaaS)", tier: 2, fetch_interval_minutes: 1440 },
  { name: "MicroAcquire Blog", url: "https://blog.acquire.com/feed/", tier: 1, fetch_interval_minutes: 1440 },
  { name: "宝玉的分享", url: "https://baoyu.io/feed.xml", tier: 2, fetch_interval_minutes: 1440 },
];

export async function seedBizSources(sql: any): Promise<void> {
  for (const source of BIZ_SEED_SOURCES) {
    await sql`
      INSERT INTO biz_sources (name, url, tier, fetch_interval_minutes)
      VALUES (${source.name}, ${source.url}, ${source.tier}, ${source.fetch_interval_minutes})
      ON CONFLICT (url) DO NOTHING
    `;
  }
}
