import { CustomSuccessMessages, GeneralErrors } from "@constants";
import { canDeleteRoom, canUpdateRoom, canViewRoom, getHotelOrThrow, getRoomOrThrow, getUserOrThrow } from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import type { RoomParams } from "@lib/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const room = await getRoomOrThrow(params.roomId, hotelId);
        const { roles } = await getUserOrThrow(req);

        if (!canViewRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();
        return NextResponse.json(room);
    }
)

export const PATCH = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const room = await getRoomOrThrow(params.roomId, hotelId);
        const { roles } = await getUserOrThrow(req);

        //to-do: validate update fields
        if (!canUpdateRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();
        const data = await req.json();
        const updatedRoom = await prisma.room.update({ where: { id: room.id, hotelId }, data, });
        return NextResponse.json(updatedRoom);
    }
)

export const DELETE = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const room = await getRoomOrThrow(params.roomId, hotelId);
        const { roles } = await getUserOrThrow(req);
        if (!canDeleteRoom({ roles, hotelId })) throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);
        await prisma.room.delete({ where: { id: room.id, hotelId } });
        return NextResponse.json({ message: CustomSuccessMessages.ROOM_DELETED_SUCCESSFULLY });
    }
)