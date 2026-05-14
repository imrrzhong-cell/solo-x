'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/articles', label: '文章' },
  { href: '/music', label: '音乐' },
  { href: '/courses', label: '课程' },
  { href: '/webapps', label: '网页应用' },
  { href: '/games', label: '游戏' },
  { href: '/tools', label: '工具箱' },
  { href: '/pricing', label: '会员' },
  { href: '/about', label: '关于' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="主导航">
      <div className="nav-inner">
        <Link className="logo" href="/">
          SOLO<mark>.X</mark><span className="logo-dot" />
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <Link className="nav-map" href="/map">站点地图</Link>
          <Link className="nav-cta" href="/opcx">进入 OPC</Link>
        </div>
      </div>
    </nav>
  );
}
