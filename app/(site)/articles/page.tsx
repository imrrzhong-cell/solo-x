import { getArticlesByType } from '@/lib/articles';
import { ArticleCard } from '@/components/article-card';
import type { ArticleType } from '@/types/article';

const VALID_TYPES: ArticleType[] = ['essay', 'note', 'tool', 'smidgeon', 'now'];
const TYPE_LABELS: Record<string, string> = {
  all: '全部',
  essay: 'Essay',
  note: 'Note',
  tool: 'Tool',
  smidgeon: 'Smidgeon',
  now: 'Now',
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const activeType = type && VALID_TYPES.includes(type as ArticleType) ? (type as ArticleType) : 'all';
  const articles = getArticlesByType(activeType);

  return (
    <div className="articles-page">
      <h1>创作</h1>
      <p className="articles-subtitle">文字之间，有光</p>

      <div className="filter-bar">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <a
            key={key}
            href={key === 'all' ? '/articles' : `/articles?type=${key}`}
            className={`filter-btn ${activeType === key ? 'active' : ''}`}
          >
            {label}
          </a>
        ))}
      </div>

      <div>
        {articles.length === 0 ? (
          <p style={{ color: 'var(--char3)', fontSize: '.88rem', padding: '2rem 0' }}>
            暂无文章，敬请期待。
          </p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
