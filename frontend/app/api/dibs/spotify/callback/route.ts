import { NextRequest, NextResponse } from 'next/server';

// Spotify top-artist genres -> Dibs interest tags.
const GENRE_TAGS: [RegExp, string][] = [
  [/comedy|spoken word/, 'comedy'],
  [/jazz|blues|soul|rock|pop|hip hop|rap|indie|folk|electronic|dance|country|r&b|metal|punk|house|techno/, 'music'],
];

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const fail = (why: string) => {
    const r = NextResponse.redirect(`${origin}/dibs?spotify=${why}`);
    r.cookies.delete({ name: 'dibs_sp', path: '/api/dibs' });
    return r;
  };
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const [savedState, verifier] = (req.cookies.get('dibs_sp')?.value || '').split('.');
  if (!clientId || !code || !state || state !== savedState || !verifier) return fail('denied');

  const tok = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code', code, redirect_uri: `${origin}/api/dibs/spotify/callback`,
      client_id: clientId, code_verifier: verifier,
    }),
  });
  if (!tok.ok) return fail('error');
  const { access_token } = await tok.json();

  const top = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!top.ok) return fail('error');
  const { items = [] } = await top.json();

  const artists: string[] = items.map((a: { name: string }) => a.name).slice(0, 20);
  const genres: string[] = items.flatMap((a: { genres: string[] }) => a.genres || []);
  const tags = new Set<string>(['music']);
  for (const g of genres) for (const [re, tag] of GENRE_TAGS) if (re.test(g)) tags.add(tag);

  // Token is discarded; only artist names + tags go to the client for one read.
  const res = NextResponse.redirect(`${origin}/dibs?spotify=ok`);
  res.cookies.set('dibs_spotify', encodeURIComponent(JSON.stringify({ artists, tags: [...tags] })), {
    secure: true, sameSite: 'lax', maxAge: 300, path: '/dibs',
  });
  res.cookies.delete({ name: 'dibs_sp', path: '/api/dibs' });
  return res;
}
