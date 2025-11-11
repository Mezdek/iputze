import { prisma } from '@/lib/server/db/prisma';
import { RoomErrors, roomSelect } from '@/lib/shared/constants';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { transformRoom } from '@/lib/shared/utils/transformers/transformRoom';
import type { RoomWithContext } from '@/types';

export const getRoomOrThrow = async (
  roomId: string
): Promise<RoomWithContext> => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: roomSelect,
  });

  if (!room) throw APP_ERRORS.notFound(RoomErrors.NOT_FOUND);

  const transformedRoom = transformRoom(room);

  return transformedRoom;
};
