import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';

// Full-page redirect OAuth (Authorization Code + PKCE). No client secret needed.
export function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const origin = req.nextUrl.origin;
  if (!clientId) return NextResponse.redirect(`${origin}/dibs?spotify=unavailable`);

  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const state = randomBytes(16).toString('base64url');

  const url = new URL('https://accounts.spotify.com/authorize');
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: `${origin}/api/dibs/spotify/callback`,
    scope: 'user-top-read',
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
  }).toString();

  const res = NextResponse.redirect(url);
  res.cookies.set('dibs_sp', `${state}.${verifier}`, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600, path: '/api/dibs' });
  return res;
}
