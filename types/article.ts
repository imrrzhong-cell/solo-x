export type ArticleType = 'essay' | 'note' | 'tool' | 'smidgeon' | 'now';

export interface ArticleFrontmatter {
  title: string;
  date: string;
  type: ArticleType;
  tags: string[];
  excerpt: string;
  draft?: boolean;
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: number;
}

export interface SubscribePayload {
  email: string;
  source: 'homepage' | 'article' | 'placeholder';
  consent: boolean;
}

export interface SubscribeResult {
  success: boolean;
  message: string;
}
