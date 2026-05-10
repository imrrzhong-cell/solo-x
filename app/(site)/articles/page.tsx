'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { articles } from '@/lib/data';

const TABS = ['全部', 'Essay', 'Note', 'Tool', 'Smidgeon', 'Now Update'] as const;

export default function ArticlesPage() {
  const [activeTab, setActiveTab] = useState<string>('全部');

  const filtered = activeTab === '全部'
    ? articles
    : articles.filter((a) => a.type === activeTab);

  return (
    <>
      <PageHead
        kicker="深度文章"
        title="把一人公司的判断，写成可复用资产。"
        desc="文章系统承载成熟长文、成长中的想法、工具推荐、碎片灵感和月度动态。每篇文章都指向一个可执行问题。"
        kanji="文"
      />

      <section className="section">
        <div className="container">
          <div className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="article-list">
            {filtered.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="article-card">
                <div>
                  <div className="article-meta">{article.type} · {article.premium ? 'PRO' : 'FREE'}</div>
                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="tag-row">
                    {article.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="article-side">
                  <div>{article.date}</div>
                  <div>{article.read}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
