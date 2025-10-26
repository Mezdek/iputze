import { prisma } from '@lib/db';
import { APP_ERRORS, SESSION_COOKIE_KEY } from '@lib/shared';
import type { NextRequest } from 'next/server';

import type { SafeUserWithRoles } from '@/types';

export const getUserOrThrow = async (
  req: NextRequest
): Promise<SafeUserWithRoles> => {
  const sessionId = req.cookies.get(SESSION_COOKIE_KEY)?.value;

  if (!sessionId) throw APP_ERRORS.unauthorized('No session');

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: { include: { roles: true }, omit: { passwordHash: true } },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    // Clean up expired session
    if (session) await prisma.session.delete({ where: { id: sessionId } });
    throw APP_ERRORS.unauthorized();
  }

  // Validate IP hasn't changed drastically
  const currentIP = req.headers.get('x-forwarded-for');
  if (session.ipAddress && currentIP && session.ipAddress !== currentIP) {
    // Log suspicious activity
    console.warn(`Session IP changed: ${session.ipAddress} -> ${currentIP}`);
  }

  // Update last activity (debounce to avoid too many writes)
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (session.lastActivityAt < hourAgo) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { lastActivityAt: new Date() },
    });
  }
  return session.user;
};
