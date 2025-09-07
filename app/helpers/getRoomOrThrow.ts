import { RoomErrors } from "@constants";
import { parseId } from "@helpers";
import { APP_ERRORS, prisma } from "@lib";
import type { Prisma } from "@prisma/client";

type RoomWithHotel = Prisma.RoomGetPayload<{ include: { hotel: { select: { id: true } } } }>;

export const getRoomOrThrow = async (roomIdParam: string, expectedHotelId?: number): Promise<RoomWithHotel> => {
    const roomId = parseId(roomIdParam, RoomErrors.ROOM_ID_NOT_VALID);

    const room = await prisma.room.findUnique({ where: { id: roomId }, include: { hotel: { select: { id: true } } } });


    if (!room) throw APP_ERRORS.notFound(RoomErrors.ROOM_NOT_FOUND);

    if (expectedHotelId && room.hotel.id !== expectedHotelId) throw APP_ERRORS.badRequest(RoomErrors.ROOM_NOT_IN_HOTEL);

    return room;
};




