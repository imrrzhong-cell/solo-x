import { getAllFeatures, isFeatureEnabled } from '@/lib/features';
import Link from 'next/link';

export default function AdminFeaturesPage() {
  const features = getAllFeatures().map(f => ({
    ...f,
    enabled: isFeatureEnabled(f.key),
  }));

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">功能开关</h1>
      </div>

      <p style={{ fontSize: '.82rem', color: 'var(--char3)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
        点击"开启"或"关闭"会生成指令发送到 Claude Code 执行，修改 .env.local 和 Vercel 环境变量后自动部署。
      </p>

      <div className="admin-feature-grid">
        {features.map(f => (
          <div key={f.key} className="admin-feature-card">
            <div className="admin-feature-info">
              <span className="admin-feature-icon">{f.icon}</span>
              <div>
                <div className="admin-feature-name">{f.labelZh}</div>
                <div className="admin-feature-route">{f.route}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
              <span className={`admin-feature-status ${f.enabled ? 'admin-feature-on' : 'admin-feature-off'}`}>
                {f.enabled ? '已开启' : '未开启'}
              </span>
              <Link
                href={`/admin/command?prompt=${encodeURIComponent(
                  f.enabled
                    ? `帮我把 ${f.key} 功能开关关闭：1) 修改 .env.local 中 NEXT_PUBLIC_FEATURE_${f.key} 为 false；2) 用 Vercel API 更新环境变量（token 和 project ID 在 .env.local 中）；3) git commit 并 push`
                    : `帮我把 ${f.key} 功能开关打开：1) 修改 .env.local 中 NEXT_PUBLIC_FEATURE_${f.key} 为 true；2) 用 Vercel API 更新环境变量（token 和 project ID 在 .env.local 中）；3) git commit 并 push`
                )}`}
                className={`admin-btn admin-btn-sm ${f.enabled ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
              >
                {f.enabled ? '关闭' : '开启'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
