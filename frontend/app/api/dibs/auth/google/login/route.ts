import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';

// Identity only: openid + email. No profile/name scopes on purpose.
export function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const origin = req.nextUrl.origin;
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) return NextResponse.redirect(`${origin}/dibs?auth=unavailable`);

  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const state = randomBytes(16).toString('base64url');

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: `${origin}/api/dibs/auth/google/callback`,
    scope: 'openid email',
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
    prompt: 'select_account',
  }).toString();

  const res = NextResponse.redirect(url);
  res.cookies.set('dibs_g', `${state}.${verifier}`, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600, path: '/api/dibs' });
  return res;
}
