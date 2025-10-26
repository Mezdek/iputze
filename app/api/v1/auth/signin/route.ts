import { prisma } from '@lib/db';
import { checkRateLimit } from '@lib/server';
import {
  APP_ERRORS,
  AuthErrors,
  HttpStatus,
  parseExpiryToMilliSeconds,
  RATE_LIMIT_KEYS,
  ResponseCookieOptions,
  SESSION_COOKIE_EXP,
  SESSION_COOKIE_KEY,
  withErrorHandling,
} from '@lib/shared';
import { compare } from 'bcrypt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { SignInRequestBody, SignInResponse } from '@/types';

const MAX_CONCURRENT_SESSIONS = 5;

export const POST = withErrorHandling(async (req: NextRequest) => {
  await checkRateLimit(req, RATE_LIMIT_KEYS.SIGNIN, 'auth');

  const { email, password } = (await req.json()) as SignInRequestBody;
  if (!email || !password) {
    throw APP_ERRORS.badRequest(AuthErrors.INVALID_CREDENTIALS);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) throw APP_ERRORS.unauthorized();

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) throw APP_ERRORS.unauthorized();

  const expiresAt = new Date(
    Date.now() + parseExpiryToMilliSeconds(SESSION_COOKIE_EXP)
  );

  // Create session and enforce concurrent limit in a transaction
  const session = await prisma.$transaction(async (tx) => {
    // Get current active sessions (sorted newest first)
    const activeSessions = await tx.session.findMany({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
        revokedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    // If at or over limit, delete oldest sessions
    if (activeSessions.length >= MAX_CONCURRENT_SESSIONS) {
      const sessionsToKeep = activeSessions.slice(
        0,
        MAX_CONCURRENT_SESSIONS - 1
      );
      const sessionIdsToKeep = new Set(sessionsToKeep.map((s) => s.id));

      const sessionsToDelete = activeSessions
        .filter((s) => !sessionIdsToKeep.has(s.id))
        .map((s) => s.id);

      if (sessionsToDelete.length > 0) {
        await tx.session.deleteMany({
          where: { id: { in: sessionsToDelete } },
        });
      }
    }

    // Create new session
    return tx.session.create({
      data: {
        userId: user.id,
        expiresAt,
        ipAddress: req.headers.get('x-forwarded-for') ?? undefined,
        userAgent: req.headers.get('user-agent') ?? undefined,
      },
    });
  });

  const res = NextResponse.json<SignInResponse>(
    { user: { id: user.id, email: user.email, name: user.name } },
    { status: HttpStatus.OK }
  );

  res.cookies.set(SESSION_COOKIE_KEY, session.id, ResponseCookieOptions);

  return res;
});
