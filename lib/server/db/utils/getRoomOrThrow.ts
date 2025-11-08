import { prisma } from '@/lib/server/db/prisma';
import { RoomErrors } from '@/lib/shared/constants/errors/rooms';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import type { RoomResponse } from '@/types';

export const getRoomOrThrow = async (
  roomId: string,
  expectedHotelId?: string
): Promise<RoomResponse> => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { defaultCleaners: true },
  });

  if (!room) throw APP_ERRORS.notFound(RoomErrors.NOT_FOUND);

  if (expectedHotelId && room.hotelId !== expectedHotelId)
    throw APP_ERRORS.badRequest(RoomErrors.NOT_IN_HOTEL);

  return room;
};
