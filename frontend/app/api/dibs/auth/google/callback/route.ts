import { NextRequest, NextResponse } from 'next/server';
import { signSession } from '../../../session';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const done = (why: string, email?: string) => {
    const r = NextResponse.redirect(`${origin}/dibs?auth=${why}`);
    r.cookies.delete({ name: 'dibs_g', path: '/api/dibs' });
    if (email) r.cookies.set('dibs_user', signSession(email), { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 90, path: '/' });
    return r;
  };
  const clientId = process.env.GOOGLE_CLIENT_ID, secret = process.env.GOOGLE_CLIENT_SECRET;
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const [savedState, verifier] = (req.cookies.get('dibs_g')?.value || '').split('.');
  if (!clientId || !secret || !code || !state || state !== savedState || !verifier) return done('denied');

  const tok = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code', code, client_id: clientId, client_secret: secret,
      redirect_uri: `${origin}/api/dibs/auth/google/callback`, code_verifier: verifier,
    }),
  });
  if (!tok.ok) return done('error');
  const { access_token } = await tok.json();

  const info = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${access_token}` } });
  if (!info.ok) return done('error');
  const { email, email_verified } = await info.json();
  if (!email || email_verified === false) return done('error');
  // Token discarded; only the verified email is kept, in a signed cookie.
  return done('ok', String(email).toLowerCase());
}
