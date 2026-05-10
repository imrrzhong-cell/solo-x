import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-logo">SOLO<mark>.X</mark></div>
          <div className="copyright">© 2026 SOLO.X · 一人公司创作平台</div>
        </div>
        <div className="footer-links">
          <Link href="/privacy">隐私政策</Link>
          <Link href="/terms">使用条款</Link>
          <Link href="/contact">联系</Link>
          <Link href="/map">导航页</Link>
        </div>
      </div>
    </footer>
  );
}
