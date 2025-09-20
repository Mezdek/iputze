import type { RoomParams, RoomUpdateBody } from "@apptypes";
import { GeneralErrors, HttpStatus } from "@constants";
import { APP_ERRORS, withErrorHandling } from "@errors";
import { canDeleteRoom, canUpdateRoom, canViewRoom, getHotelOrThrow, getRoomOrThrow, getUserOrThrow } from "@helpers";
import { prisma } from "@lib/prisma";
import type { Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const room = await getRoomOrThrow(params.roomId, hotelId);
        const { roles } = await getUserOrThrow(req);

        if (!canViewRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();
        return NextResponse.json<Room>(room);
    }
)

export const PATCH = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const room = await getRoomOrThrow(params.roomId, hotelId);
        const { roles } = await getUserOrThrow(req);

        if (!canUpdateRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();
        // To-Do Add Validation
        const data = await req.json() as RoomUpdateBody;
        const updatedRoom = await prisma.room.update({ where: { id: room.id, hotelId }, data });
        return NextResponse.json<Room>(updatedRoom);
    }
)

export const DELETE = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const room = await getRoomOrThrow(params.roomId, hotelId);
        const { roles } = await getUserOrThrow(req);
        if (!canDeleteRoom({ roles, hotelId })) throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
        await prisma.room.delete({ where: { id: room.id, hotelId } });
        return NextResponse.json(null, { status: HttpStatus.NO_CONTENT });
    }
)