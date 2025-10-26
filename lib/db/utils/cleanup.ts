import { prisma } from '@lib/db';

export async function cleanupExpiredSessions() {
  const deleted = await prisma.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
    },
  });

  console.log(`Cleaned up ${deleted.count} expired sessions`);
  return deleted.count;
}
