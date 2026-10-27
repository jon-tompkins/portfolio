import { createHmac, timingSafeEqual } from 'crypto';

// Signed session cookie. Key falls back to the Google client secret so only
// GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are required to switch login on.
const key = () => process.env.DIBS_SESSION_SECRET || process.env.GOOGLE_CLIENT_SECRET || '';
const sig = (v: string) => createHmac('sha256', key()).update(v).digest('base64url');

export function signSession(email: string): string {
  const body = Buffer.from(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 24 * 90 })).toString('base64url');
  return `${body}.${sig(body)}`;
}

export function readSession(cookie?: string): string | null {
  if (!cookie || !key()) return null;
  const [body, mac] = cookie.split('.');
  if (!body || !mac) return null;
  const a = Buffer.from(mac), b = Buffer.from(sig(body));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { email, exp } = JSON.parse(Buffer.from(body, 'base64url').toString());
    return exp > Date.now() ? email : null;
  } catch { return null; }
}
