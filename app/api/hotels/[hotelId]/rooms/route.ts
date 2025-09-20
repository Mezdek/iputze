import type { RoomCollectionParams, RoomCreationBody, RoomResponse } from "@apptypes";
import { HttpStatus, RoomErrors } from "@constants";
import { APP_ERRORS, withErrorHandling } from "@errors";
import { canCreateRoom, canListRooms, getHotelOrThrow, getUserOrThrow } from "@helpers";
import { prisma } from "@lib/prisma";
import { Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getUserOrThrow(req);

        if (!canListRooms({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const rooms = await prisma.room.findMany({
            where: { hotelId },
            include: { hotel: true }
        });

        return NextResponse.json<RoomResponse>(rooms);
    }
)

export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getUserOrThrow(req);

        if (!canCreateRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const data = await req.json() as RoomCreationBody;

        const roomNumber = data.number;
        if (!roomNumber) throw APP_ERRORS.badRequest(RoomErrors.MISSING_NUMBER);

        // Ensure room number is unique for this hotel
        const existingRoom = await prisma.room.findUnique({
            where: { hotelId_number: { hotelId, number: roomNumber } }
        });

        if (existingRoom) throw APP_ERRORS.badRequest(RoomErrors.DUPLICATED_NUMBER);

        const newRoom = await prisma.room.create({
            data: { ...data, hotelId }
        });

        return NextResponse.json<Room>(newRoom, { status: HttpStatus.CREATED });
    }
)
