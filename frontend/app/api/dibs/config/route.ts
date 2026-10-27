import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    spotify: Boolean(process.env.SPOTIFY_CLIENT_ID),
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
}
