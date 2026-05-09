import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { execSync } from 'child_process';
import { getAllFeatures, isFeatureEnabled } from '@/lib/features';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export interface AdminStats {
  articleCount: number;
  draftCount: number;
  subscriberCount: number | null;
  features: { key: string; label: string; labelZh: string; enabled: boolean; route: string; icon: string }[];
  recentCommits: { hash: string; message: string; date: string }[];
  siteUrl: string;
}

export function getAdminStats(): AdminStats {
  // Articles
  let articleCount = 0;
  let draftCount = 0;
  if (fs.existsSync(ARTICLES_DIR)) {
    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
      const { data } = matter(raw);
      if (data.draft) draftCount++;
      else articleCount++;
    }
  }

  // Features
  const features = getAllFeatures().map(f => ({
    key: f.key,
    label: f.label,
    labelZh: f.labelZh,
    enabled: isFeatureEnabled(f.key),
    route: f.route,
    icon: f.icon,
  }));

  // Recent commits
  let recentCommits: { hash: string; message: string; date: string }[] = [];
  try {
    const log = execSync('git log --oneline --format="%h|%s|%cr" -10', { encoding: 'utf-8' });
    recentCommits = log.trim().split('\n').filter(Boolean).map(line => {
      const [hash, ...rest] = line.split('|');
      const message = rest.slice(0, -1).join('|');
      const date = rest[rest.length - 1];
      return { hash, message, date };
    });
  } catch {}

  return {
    articleCount,
    draftCount,
    subscriberCount: null,
    features,
    recentCommits,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://solo-x-wheat.vercel.app',
  };
}
