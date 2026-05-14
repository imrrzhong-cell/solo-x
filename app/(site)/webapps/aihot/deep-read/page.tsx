'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  summary: string | null;
  content_md: string;
  source_count: number;
  article_date: string;
}

export default function DeepReadPage() {
  return (
    <Suspense fallback={<div className="gen-article-page"><div className="prose-kicker">AI 热点深度解读</div><div style={{ color: 'var(--char3)', padding: '4rem 0', textAlign: 'center' }}>加载中...</div></div>}>
      <DeepReadContent />
    </Suspense>
  );
}

function localDate(d?: Date): string {
  const dt = d || new Date();
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function DeepReadContent() {
  const params = useSearchParams();
  const date = params.get('date') || localDate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState<{ prev: string | null; next: string | null }>({ prev: null, next: null });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/article-gen/articles?type=aihot_deep_read&date=${date}`)
      .then(r => r.json())
      .then(data => {
        setArticle(data.items?.[0] || null);
        if (data.items?.[0]) {
          fetch(`/api/article-gen/articles?type=aihot_deep_read&limit=50`)
            .then(r => r.json())
            .then(allData => {
              const dates = (allData.items || []).map((a: Article) => a.article_date.slice(0, 10)).sort().reverse();
              const idx = dates.indexOf(date);
              setNav({ prev: idx < dates.length - 1 ? dates[idx + 1] : null, next: idx > 0 ? dates[idx - 1] : null });
            });
        }
      })
      .finally(() => setLoading(false));
  }, [date]);

  if (loading) {
    return (
      <div className="gen-article-page">
        <div className="prose-kicker">AI 热点深度解读</div>
        <div style={{ color: 'var(--char3)', padding: '4rem 0', textAlign: 'center' }}>加载中...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="gen-article-page">
        <div className="prose-kicker">AI 热点深度解读</div>
        <h1 className="prose-title">暂无内容</h1>
        <p style={{ color: 'var(--char3)', margin: '2rem 0' }}>{date} 的深度解读尚未生成，请稍后再来。</p>
        <Link href="/webapps/aihot" style={{ fontSize: '.78rem', color: 'var(--sage2)' }}>返回 AI 热点雷达 →</Link>
      </div>
    );
  }

  return (
    <div className="gen-article-page">
      <div className="prose-kicker">AI 热点深度解读</div>
      <h1 className="prose-title">{article.title}</h1>
      <div className="prose-meta">{date} · 基于 {article.source_count} 个信源</div>
      <div className="gen-article-content" dangerouslySetInnerHTML={{ __html: mdToHtml(article.content_md) }} />
      <div className="gen-article-nav">
        {nav.prev ? <Link href={`/webapps/aihot/deep-read?date=${nav.prev}`}>← 前一天</Link> : <span />}
        {nav.next ? <Link href={`/webapps/aihot/deep-read?date=${nav.next}`}>后一天 →</Link> : <span />}
      </div>
    </div>
  );
}

function mdToHtml(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--sage2)">$1</a>');

  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (line.match(/^<(h[1-3]|hr)/)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(line);
    } else if (line.match(/^[-*] /)) {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(`<li>${line.replace(/^[-*] /, '')}</li>`);
    } else if (line.trim() === '') {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push('');
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<p>${line}</p>`);
    }
  }
  if (inList) result.push('</ul>');

  return result.join('\n');
}
