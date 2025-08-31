import { CustomErrorMessages, HttpStatus } from "@constants/httpResponses";
import { getAuthContext } from "@helpers/getAuthContext";
import { parseId } from "@helpers/parseId";
import { canListRooms } from "@helpers/permissions/hotelManagement";
import { canCreateRoom } from "@helpers/permissions/roomManagement";
import { APP_ERRORS } from "@lib/errors/factories";
import { HttpError } from "@lib/errors/HttpError";
import { prisma } from "@lib/prisma";
import { RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type Params = { hotelId: string };

interface CreateRoomRequest {
    number: string;
    hotelId: number;
    occupancy?: RoomOccupancy;
    cleanliness?: RoomCleanliness;
}


export async function GET(_req: NextRequest, { params }: { params: Params }) {
    try {
        const hotelId = parseId(params.hotelId, CustomErrorMessages.HOTEL_ID_NOT_VALID);

        const { roles } = await getAuthContext();

        if (!canListRooms({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const rooms = await prisma.room.findMany({
            where: { hotelId },
            include: { hotel: true }
        });

        if (rooms.length === 0) throw APP_ERRORS.notFound(CustomErrorMessages.NO_ROOM_FOUND);

        return NextResponse.json(rooms);

    } catch (error: unknown) {
        if (error instanceof HttpError) {
            console.error(error);
            return error.nextResponse();
        }

        console.error(error);
        return APP_ERRORS.internalServerError(CustomErrorMessages.UNEXPECTED_SERVER_ERROR).nextResponse();
    }
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
    try {
        const hotelId = parseId(params.hotelId, CustomErrorMessages.HOTEL_ID_NOT_VALID);

        const { roles } = await getAuthContext();

        if (!canCreateRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const data = (await req.json()) as CreateRoomRequest;

        const roomNumber = data.number;
        if (!roomNumber) throw APP_ERRORS.badRequest(CustomErrorMessages.ROOM_NUMBER_REQUIRED);

        // Ensure room number is unique for this hotel
        const existingRoom = await prisma.room.findUnique({
            where: { hotelId_number: { hotelId, number: roomNumber } }
        });

        if (existingRoom) throw APP_ERRORS.badRequest(CustomErrorMessages.ROOM_NUMBER_ALREADY_EXISTS);

        const newRoom = await prisma.room.create({
            data: { ...data, hotelId }
        });

        return NextResponse.json(newRoom, { status: HttpStatus.CREATED });
    } catch (error: unknown) {
        if (error instanceof HttpError) {
            console.error(error);
            return error.nextResponse();
        }

        console.error(error);
        return APP_ERRORS.internalServerError(CustomErrorMessages.UNEXPECTED_SERVER_ERROR).nextResponse();
    }
}
