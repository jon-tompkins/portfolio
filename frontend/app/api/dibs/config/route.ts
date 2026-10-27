import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ spotify: Boolean(process.env.SPOTIFY_CLIENT_ID) });
}
