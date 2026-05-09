import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession, sessionCookieConfig } from '@/lib/admin/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: '密码错误' }, { status: 401 });
  }

  const session = await createSession();
  const res = NextResponse.json({ success: true });
  res.headers.set('Set-Cookie', `${sessionCookieConfig.name}=${session}; ${sessionCookieConfig.options}`);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.headers.set('Set-Cookie', `${sessionCookieConfig.name}=; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=0`);
  return res;
}
