const COOKIE_NAME = 'admin_session';
const MAX_AGE = 24 * 60 * 60;

export function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

export async function createSession(): Promise<string> {
  const timestamp = Date.now().toString();
  const secret = process.env.ADMIN_SESSION_SECRET || 'solo-x-default-secret';
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(timestamp));
  const hash = Buffer.from(sig).toString('base64url');
  return `${timestamp}.${hash}`;
}

export async function verifySession(token: string): Promise<boolean> {
  const [ts, hash] = token.split('.');
  if (!ts || !hash) return false;

  const timestamp = parseInt(ts, 10);
  if (isNaN(timestamp) || Date.now() - timestamp > MAX_AGE * 1000) return false;

  const secret = process.env.ADMIN_SESSION_SECRET || 'solo-x-default-secret';
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts));
  const expected = Buffer.from(sig).toString('base64url');
  return hash === expected;
}

export const sessionCookieConfig = {
  name: COOKIE_NAME,
  options: `HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=${MAX_AGE}`,
};
