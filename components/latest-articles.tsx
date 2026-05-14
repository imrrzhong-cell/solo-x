'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ArticleCard {
  id: number;
  article_type: string;
  article_date: string;
  title: string;
  summary: string | null;
  source_count: number;
}

export function LatestArticleTimeline() {
  const [articles, setArticles] = useState<ArticleCard[]>([]);

  useEffect(() => {
    fetch('/api/article-gen/articles?limit=2')
      .then(r => r.json())
      .then(data => setArticles(data.items || []))
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <>
      {articles.map(a => (
        <Link
          key={a.id}
          href={a.article_type === 'aihot_deep_read'
            ? `/webapps/aihot/deep-read?date=${a.article_date.slice(0, 10)}`
            : `/webapps/aibizradar/biz-insight?date=${a.article_date.slice(0, 10)}`}
          className="hero-timeline-item"
        >
          <span className="hero-tl-date">{a.article_date.slice(0, 10)}</span>
          <span className="hero-tl-tag">{a.article_type === 'aihot_deep_read' ? 'READ' : 'BIZ'}</span>
          <span className="hero-tl-title">{a.article_type === 'aihot_deep_read' ? 'AI 热点深度解读' : '搞钱雷达·生意经'}</span>
        </Link>
      ))}
    </>
  );
}

export function LatestArticlesSection() {
  const [articles, setArticles] = useState<ArticleCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/article-gen/articles?limit=2')
      .then(r => r.json())
      .then(data => setArticles(data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (articles.length === 0) return null;

  const aihot = articles.find(a => a.article_type === 'aihot_deep_read');
  const bizradar = articles.find(a => a.article_type === 'bizradar_biz_insight');

  return (
    <section className="gen-article-section">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div className="sec-season">每日解读</div>
          <h2 className="sec-title" style={{ fontSize: '1.3rem' }}>AI 为你读报，你看 AI 写的文章。</h2>
        </div>
        <div className="gen-article-grid">
          {aihot && (
            <Link href={`/webapps/aihot/deep-read?date=${aihot.article_date.slice(0, 10)}`} className="gen-article-card">
              <span className="gen-article-tag">热点解读</span>
              <div className="gen-article-title">{aihot.title}</div>
              <div className="gen-article-meta">
                <span>{aihot.article_date.slice(0, 10)}</span>
                <span>基于 {aihot.source_count} 个信源</span>
              </div>
              <div className="gen-article-summary">{aihot.summary || '今日 AI 热点深度解读'}</div>
              <span className="gen-article-link">阅读全文 →</span>
            </Link>
          )}
          {bizradar && (
            <Link href={`/webapps/aibizradar/biz-insight?date=${bizradar.article_date.slice(0, 10)}`} className="gen-article-card">
              <span className="gen-article-tag">生意经</span>
              <div className="gen-article-title">{bizradar.title}</div>
              <div className="gen-article-meta">
                <span>{bizradar.article_date.slice(0, 10)}</span>
                <span>基于 {bizradar.source_count} 个商业案例</span>
              </div>
              <div className="gen-article-summary">{bizradar.summary || '今日搞钱情报商业分析'}</div>
              <span className="gen-article-link">阅读全文 →</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
