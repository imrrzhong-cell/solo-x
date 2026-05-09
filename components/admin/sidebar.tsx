'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: '仪表盘', icon: '◈' },
  { href: '/admin/articles', label: '文章管理', icon: '▦' },
  { href: '/admin/features', label: '功能开关', icon: '◈' },
  { href: '/admin/command', label: '指令中心', icon: '▸' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <span className="admin-logo-text">SOLO.X</span>
        <span className="admin-logo-sub">Admin</span>
      </div>
      <ul className="admin-nav">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-nav-link">返回前台</Link>
        <button onClick={handleLogout} className="admin-nav-link">退出登录</button>
      </div>
    </aside>
  );
}
