// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * CSRF Protection Middleware
 *
 * Protects against Cross-Site Request Forgery by validating:
 * 1. SameSite cookie policy (set to 'strict' in auth.ts)
 * 2. Origin/Referer headers match allowed domains
 */
export function middleware(request: NextRequest) {
  // Only protect state-changing methods
  const method = request.method;
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return NextResponse.next();
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Define allowed origins (your app's domains)
  const allowedOrigins = [
    process.env['NEXT_PUBLIC_APP_URL'], // Production URL
  ].filter(Boolean) as string[];

  // Check if request comes from an allowed origin
  const isAllowedOrigin =
    origin && allowedOrigins.some((allowed) => origin.startsWith(allowed));

  // Fallback: check referer if origin is missing (some browsers)
  const isAllowedReferer =
    referer && allowedOrigins.some((allowed) => referer.startsWith(allowed));

  // Block if neither origin nor referer match
  if (
    !(process.env.NODE_ENV === 'development') &&
    !isAllowedOrigin &&
    !isAllowedReferer
  ) {
    console.warn('[CSRF] Blocked suspicious request:', {
      method,
      path: request.nextUrl.pathname,
      origin: origin || 'missing',
      referer: referer || 'missing',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Forbidden',
        message: 'Invalid request origin',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Request is valid, continue
  return NextResponse.next();
}

// Apply middleware only to API routes
export const config = {
  matcher: '/api/v1/:path*',
};
