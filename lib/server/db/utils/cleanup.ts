/* eslint-disable no-console */
import { prisma } from '@/lib/server/db/prisma';

export async function cleanupExpiredSessions() {
  const deleted = await prisma.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
    },
  });

  console.log(`Cleaned up ${deleted.count} expired sessions`);
  return deleted.count;
}
