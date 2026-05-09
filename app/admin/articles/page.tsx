import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export default function AdminArticlesPage() {
  let articles: {
    slug: string;
    title: string;
    type: string;
    date: string;
    draft: boolean;
    tags: string[];
  }[] = [];

  if (fs.existsSync(ARTICLES_DIR)) {
    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'));
    articles = files.map(file => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        type: data.type || 'unknown',
        date: data.date || '',
        draft: !!data.draft,
        tags: data.tags || [],
      };
    }).sort((a, b) => b.date.localeCompare(a.date));
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">文章管理</h1>
        <Link href="/admin/command?preset=article" className="admin-btn admin-btn-primary admin-btn-sm">
          写新文章
        </Link>
      </div>

      {articles.length === 0 ? (
        <p style={{ color: 'var(--char3)', fontSize: '.88rem', padding: '2rem 0' }}>
          暂无文章，点击右上角创建第一篇。
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>类型</th>
              <th>日期</th>
              <th>标签</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a.slug}>
                <td style={{ fontWeight: 500, color: 'var(--char)' }}>{a.title}</td>
                <td>{a.type}</td>
                <td style={{ fontSize: '.75rem', color: 'var(--char3)' }}>{a.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                    {a.tags.map(t => (
                      <span key={t} style={{ fontSize: '.6rem', color: 'var(--sage2)', background: 'rgba(125,155,118,.08)', padding: '.1rem .4rem', borderRadius: '2px' }}>{t}</span>
                    ))}
                  </div>
                </td>
                <td>
                  {a.draft ? (
                    <span className="admin-badge admin-badge-draft">草稿</span>
                  ) : (
                    <span className="admin-badge admin-badge-active">已发布</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '.4rem' }}>
                    <Link
                      href={`/admin/command?prompt=${encodeURIComponent(`帮我编辑文章 ${a.slug}（content/articles/${a.slug}.mdx），修改为：___`)}`}
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                    >
                      编辑
                    </Link>
                    <Link
                      href={`/admin/command?prompt=${encodeURIComponent(`帮我${a.draft ? '发布' : '转为草稿'}文章 ${a.slug}，把 content/articles/${a.slug}.mdx 的 draft 改为 ${a.draft ? 'false' : 'true'}，然后 git commit 并 push`)}`}
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                    >
                      {a.draft ? '发布' : '转草稿'}
                    </Link>
                    <Link
                      href={`/admin/command?prompt=${encodeURIComponent(`帮我删除文章 ${a.slug}，删除 content/articles/${a.slug}.mdx 文件，然后 git commit 并 push`)}`}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                    >
                      删除
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
