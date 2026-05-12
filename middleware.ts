import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login page doesn't need auth check
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Simple token check: format is timestamp.base64url_hmac
    // Full verification happens server-side in API routes
    const [ts] = token.split('.');
    if (!ts || isNaN(parseInt(ts, 10))) {
      const res = NextResponse.redirect(new URL('/admin/login', req.url));
      res.cookies.delete('admin_session');
      return res;
    }

    // Check expiry (24h)
    const age = Date.now() - parseInt(ts, 10);
    if (age > 24 * 60 * 60 * 1000) {
      const res = NextResponse.redirect(new URL('/admin/login', req.url));
      res.cookies.delete('admin_session');
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
