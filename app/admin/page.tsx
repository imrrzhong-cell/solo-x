import { getAdminStats } from '@/lib/admin/stats';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = getAdminStats();

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">仪表盘</h1>
        <a href={stats.siteUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm">
          查看线上网站
        </a>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-num">{stats.articleCount}</div>
          <div className="admin-stat-label">已发布文章</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-num">{stats.draftCount}</div>
          <div className="admin-stat-label">草稿</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-num">
            {stats.features.filter(f => f.enabled).length}/{stats.features.length}
          </div>
          <div className="admin-stat-label">已开启功能</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-num">—</div>
          <div className="admin-stat-label">订阅者</div>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">功能状态</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
          {stats.features.map(f => (
            <span key={f.key} className={`admin-badge ${f.enabled ? 'admin-badge-active' : 'admin-badge-off'}`}>
              {f.labelZh} {f.enabled ? 'ON' : 'OFF'}
            </span>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">最近提交</h2>
        {stats.recentCommits.length === 0 ? (
          <p style={{ color: 'var(--char3)', fontSize: '.82rem' }}>暂无提交记录</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Hash</th><th>信息</th><th>时间</th></tr>
            </thead>
            <tbody>
              {stats.recentCommits.map(c => (
                <tr key={c.hash}>
                  <td><code style={{ fontSize: '.75rem', color: 'var(--sage2)' }}>{c.hash}</code></td>
                  <td>{c.message}</td>
                  <td style={{ color: 'var(--char3)', fontSize: '.75rem' }}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">快捷操作</h2>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <Link href="/admin/command?preset=article" className="admin-btn admin-btn-primary admin-btn-sm">写新文章</Link>
          <Link href="/admin/command?preset=feature" className="admin-btn admin-btn-ghost admin-btn-sm">开关板块</Link>
          <Link href="/admin/command?preset=style" className="admin-btn admin-btn-ghost admin-btn-sm">调整样式</Link>
          <Link href="/admin/command" className="admin-btn admin-btn-ghost admin-btn-sm">自由指令</Link>
        </div>
      </div>
    </>
  );
}
