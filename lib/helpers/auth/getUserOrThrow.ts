import { APP_ERRORS, SESSION_COOKIE_KEY } from '@lib';
import { prisma } from '@lib/prisma';
import type { NextRequest } from 'next/server';

import type { SafeUserWithRoles } from '@/types';

export const getUserOrThrow = async (
  req: NextRequest
): Promise<SafeUserWithRoles> => {
  const sessionId = req.cookies.get(SESSION_COOKIE_KEY)?.value;

  if (!sessionId) throw APP_ERRORS.unauthorized();

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { include: { roles: true } } },
  });

  if (!session || session.expiresAt < new Date())
    throw APP_ERRORS.unauthorized();

  const { passwordHash: _passwordHash, ...userWithoutPasswordHash } =
    session.user;

  return userWithoutPasswordHash;
};
