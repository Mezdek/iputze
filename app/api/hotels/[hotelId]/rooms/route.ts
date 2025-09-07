import type { CreateRoomBody, RoomCollectionParams } from "@/types";
import { HttpStatus, RoomErrors } from "@constants";
import { canCreateRoom, canListRooms, getAuthContext, getHotelOrThrow } from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";



export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {


        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getAuthContext(req);

        if (!canListRooms({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const rooms = await prisma.room.findMany({
            where: { hotelId },
            include: { hotel: true }
        });


        return NextResponse.json(rooms);
    }
)

export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getAuthContext(req);

        if (!canCreateRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const data = await req.json() as CreateRoomBody;

        const roomNumber = data.number;
        if (!roomNumber) throw APP_ERRORS.badRequest(RoomErrors.ROOM_NUMBER_REQUIRED);

        // Ensure room number is unique for this hotel
        const existingRoom = await prisma.room.findUnique({
            where: { hotelId_number: { hotelId, number: roomNumber } }
        });

        if (existingRoom) throw APP_ERRORS.badRequest(RoomErrors.ROOM_NUMBER_ALREADY_EXISTS);

        const newRoom = await prisma.room.create({
            data: { ...data, hotelId }
        });

        return NextResponse.json(newRoom, { status: HttpStatus.CREATED });
    }
)
