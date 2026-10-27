import { NextRequest, NextResponse } from 'next/server';
import { readSession } from '../session';

export function GET(req: NextRequest) {
  return NextResponse.json({ email: readSession(req.cookies.get('dibs_user')?.value) }, { headers: { 'Cache-Control': 'no-store' } });
}
