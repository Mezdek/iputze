import type { RoomCollectionParams, RoomCreationBody, RoomResponse } from "@/types";
import { APP_ERRORS, canCreateRoom, canListRooms, getHotelOrThrow, getUserOrThrow, HttpStatus, RoomErrors, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
import type { Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {

        const { hotelId: hotelIdFromParams } = await params;

        const { id: hotelId } = await getHotelOrThrow(hotelIdFromParams);

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

        const { hotelId: hotelIdFromParams } = await params;

        const { id: hotelId } = await getHotelOrThrow(hotelIdFromParams);

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
