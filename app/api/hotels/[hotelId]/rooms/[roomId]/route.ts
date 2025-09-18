import { CustomSuccessMessages, GeneralErrors, RoomErrors } from "@constants";
import { canDeleteRoom, canUpdateRoom, canViewRoom, getHotelOrThrow, getRoomOrThrow, getUserOrThrow } from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import type { RoomParams } from "@lib/types";
import { Room, RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


const roomUpdateSchema = z.object({
    number: z.string().optional(),
    occupancy: z.enum(RoomOccupancy).optional(),
    cleanliness: z.enum(RoomCleanliness).optional(),
    notes: z.string().optional(),
});

export type RoomUpdateBody = z.infer<typeof roomUpdateSchema>;


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

        if (!canUpdateRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();
        const json = await req.json();
        const { data, success } = roomUpdateSchema.safeParse(json);
        if (!success) throw APP_ERRORS.badRequest(RoomErrors.INVALID_PARAMETERS);
        const updatedRoom = await prisma.room.update({ where: { id: room.id, hotelId }, data });
        return NextResponse.json<Room>(updatedRoom);
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