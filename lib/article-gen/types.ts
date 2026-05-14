export type ArticleType = 'aihot_deep_read' | 'bizradar_biz_insight';

export interface GeneratedArticle {
  id: number;
  article_type: ArticleType;
  article_date: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  content_md: string;
  source_count: number;
  top_items: TopItem[] | null;
  status: 'draft' | 'published';
  created_at: string;
}

export interface TopItem {
  title: string;
  url?: string;
  score?: number;
}

export interface ArticleCard {
  id: number;
  article_type: ArticleType;
  article_date: string;
  title: string;
  summary: string | null;
  source_count: number;
}
