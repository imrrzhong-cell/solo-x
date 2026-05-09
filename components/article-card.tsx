import Link from 'next/link';
import type { Article } from '@/types/article';

const TYPE_LABELS: Record<string, string> = {
  essay: 'Essay',
  note: 'Note',
  tool: 'Tool',
  smidgeon: 'Smidgeon',
  now: 'Now',
};

export function ArticleCard({ article }: { article: Article }) {
  const { frontmatter, readingTime, slug } = article;

  return (
    <Link href={`/articles/${slug}`} className="article-card">
      <div className="ac-type">{TYPE_LABELS[frontmatter.type] || frontmatter.type}</div>
      <h3 className="ac-title">{frontmatter.title}</h3>
      <p className="ac-excerpt">{frontmatter.excerpt}</p>
      <div className="ac-meta">
        <span className="ac-date">{frontmatter.date}</span>
        <span className="ac-time">{readingTime} 分钟</span>
        {frontmatter.tags.map((tag) => (
          <span key={tag} className="ac-tag">{tag}</span>
        ))}
      </div>
    </Link>
  );
}
