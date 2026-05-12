export interface Source {
  id: number;
  name: string;
  url: string;
  feed_type: string;
  tier: string;
  category: string;
  active: boolean;
  fetch_interval_minutes: number;
  last_fetched_at: string | null;
  success_count: number;
  fail_count: number;
  created_at: string;
}

export interface ScoredItem {
  id: number;
  url: string;
  title: string;
  translated_title: string | null;
  source_name: string;
  source_tier: string;
  score: number;
  category: Category;
  summary_cn: string;
  reason: string;
  keywords: string;
  published_at: string | null;
  is_favorited: boolean;
}

export interface DailyReport {
  id: number;
  report_type: "daily" | "weekly";
  report_date: string;
  title: string;
  summary: string;
  content_json: Record<string, ReportItem[]>;
  stats_json: ReportStats;
  created_at: string;
}

export interface ReportItem {
  id: number;
  title: string;
  url: string;
  source_name: string;
  score: number;
  summary: string;
  reason: string;
  keywords: string;
}

export interface ReportStats {
  total_scored: number;
  by_category: Record<string, number>;
  avg_score: number;
}

export interface Favorite {
  id: number;
  content_id: number;
  note: string | null;
  tags: string | null;
  created_at: string;
  content?: ScoredItem;
}

export interface OverviewStats {
  total_sources: number;
  active_sources: number;
  total_contents: number;
  total_scored: number;
}

export interface TrendData {
  trending_keywords: { keyword: string; count: number }[];
  daily_counts: { date: string; count: number }[];
}

export type Category = "model" | "product" | "research" | "opinion" | "tool";

export interface FeedParams {
  type?: "featured" | "all";
  page?: number;
  size?: number;
  category?: Category | "";
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
