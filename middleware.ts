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

  // Define allowed origins
  const allowedOrigins = [
    // Production URLs
    process.env['NEXT_PUBLIC_APP_URL'],
    process.env['NEXT_PUBLIC_PRODUCTION_URL'],
    process.env['NEXT_PUBLIC_STAGING_URL'],

    // Development URLs
    ...(process.env.NODE_ENV === 'development'
      ? [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:8080',
          'http://localhost:4200',
          'http://127.0.0.1:3000',
          'http://0.0.0.0:3000',
        ]
      : []),
  ].filter(Boolean) as string[];

  // Check if request comes from an allowed origin
  const isAllowedOrigin =
    origin &&
    (allowedOrigins.some((allowed) => origin.startsWith(allowed)) ||
      // Allow local network IPs in development (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      // Common dev ports: 3000-3001, 5173-5174, 8080, 4200
      (process.env.NODE_ENV === 'development' &&
        /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}):(3000|3001|5173|5174|8080|4200)/.test(
          origin
        )));

  // Fallback: check referer if origin is missing (some browsers)
  const isAllowedReferer =
    referer &&
    (allowedOrigins.some((allowed) => referer.startsWith(allowed)) ||
      (process.env.NODE_ENV === 'development' &&
        /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}):(3000|3001|5173|5174|8080|4200)/.test(
          referer
        )));

  // Block if neither origin nor referer match (skip in development)
  if (
    process.env.NODE_ENV !== 'development' &&
    !isAllowedOrigin &&
    !isAllowedReferer
  ) {
    console.warn('[CSRF] Blocked suspicious request:', {
      method,
      path: request.nextUrl.pathname,
      origin: origin || 'missing',
      referer: referer || 'missing',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      allowedOrigins: allowedOrigins.length
        ? allowedOrigins
        : 'NONE CONFIGURED',
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
