import { NAV_LINKS } from '@/lib/constants';
import { isFeatureEnabled } from '@/lib/features';

export function Nav() {
  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.feature || isFeatureEnabled(link.feature as Parameters<typeof isFeatureEnabled>[0])
  );

  return (
    <nav>
      <div className="nav-inner">
        <a href="/" className="logo">
          <span className="logo-text">SOLO.X</span>
          <span className="logo-dot" />
        </a>
        <ul>
          {visibleLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <button className="nav-toggle" aria-label="菜单">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
