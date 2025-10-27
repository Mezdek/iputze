import { prisma } from '@lib/db';
import {
  HttpStatus,
  ResponseCookieOptions,
  SESSION_COOKIE_KEY,
  withErrorHandling,
} from '@lib/shared';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const POST = withErrorHandling(async (req: NextRequest) => {
  const sessionId = req.cookies.get(SESSION_COOKIE_KEY)?.value;

  if (sessionId) {
    await prisma.session
      .delete({
        where: { id: sessionId },
      })
      .catch((error: unknown) => {
        if (process.env['NODE_ENV'] === 'development') {
          const message =
            error instanceof Error ? error.message : 'Unknown error';
          console.warn('Session deletion failed:', message);
        }
      });
  }

  const res = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: HttpStatus.OK }
  );

  res.cookies.set(SESSION_COOKIE_KEY, '', {
    ...ResponseCookieOptions,
    maxAge: 0,
  });

  return res;
});
