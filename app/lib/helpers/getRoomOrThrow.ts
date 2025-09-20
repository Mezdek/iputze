import { RoomErrors } from "@constants";
import { APP_ERRORS } from "@errors";
import { prisma } from "@lib/prisma";
import type { Room } from "@prisma/client";


export const getRoomOrThrow = async (roomId: string, expectedHotelId?: string): Promise<Room> => {

    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room) throw APP_ERRORS.notFound(RoomErrors.NOT_FOUND);

    if (expectedHotelId && room.hotelId !== expectedHotelId) throw APP_ERRORS.badRequest(RoomErrors.NOT_IN_HOTEL);

    return room;
};




