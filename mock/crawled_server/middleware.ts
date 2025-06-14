import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  if (/bot|crawler|spider/i.test(ua)) {
    return new NextResponse('Blocked', { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/anti-bot/:path*'],
};
