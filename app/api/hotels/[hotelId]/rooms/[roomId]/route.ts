import { CustomErrorMessages, CustomSuccessMessages } from "@constants/httpResponses";
import { getAuthContext } from "@helpers/getAuthContext";
import { parseId } from "@helpers/parseId";
import { canDeleteRoom, canUpdateRoom, canViewRoom } from "@helpers/permissions/roomManagement";
import { APP_ERRORS } from "@lib/errors/factories";
import { HttpError } from "@lib/errors/HttpError";
import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";


type Params = { hotelId: string; roomId: string };

export async function GET(_req: NextRequest, { params }: { params: Params }) {
    try {
        const roomId = parseId(params.roomId, CustomErrorMessages.ROOM_ID_NOT_VALID);
        const hotelId = parseId(params.hotelId, CustomErrorMessages.HOTEL_ID_NOT_VALID);

        const room = await prisma.room.findUnique({ where: { id: roomId, hotelId }, include: { hotel: true }, });

        if (!room) throw APP_ERRORS.notFound(CustomErrorMessages.ROOM_NOT_FOUND);

        const { roles } = await getAuthContext();

        if (!canViewRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();

        return NextResponse.json(room);
    } catch (error: unknown) {

        if (error instanceof HttpError) {
            // If error is a custom HttpError, return its NextResponse
            console.error(error);
            return error.nextResponse();
        }

        // Otherwise, return generic internal server error
        console.error(error);
        return APP_ERRORS.internalServerError("Unexpected server error").nextResponse();
    }
}


export async function PATCH(req: NextRequest, { params }: { params: Params }) {
    try {
        const roomId = parseId(params.roomId, CustomErrorMessages.ROOM_ID_NOT_VALID);
        const hotelId = parseId(params.hotelId, CustomErrorMessages.HOTEL_ID_NOT_VALID);

        const room = await prisma.room.findUnique({ where: { id: roomId, hotelId } });

        if (!room) return APP_ERRORS.notFound(CustomErrorMessages.ROOM_NOT_FOUND).nextResponse();

        const { roles } = await getAuthContext();

        //to-do: validate update fields
        if (!canUpdateRoom({ roles, hotelId })) return APP_ERRORS.forbidden().nextResponse();

        const data = await req.json();

        const updatedRoom = await prisma.room.update({ where: { id: roomId, hotelId }, data, });

        return NextResponse.json(updatedRoom);

    } catch (error: unknown) {

        if (error instanceof HttpError) {
            // If error is a custom HttpError, return its NextResponse
            console.error(error);
            return error.nextResponse();
        }
        // Otherwise, return generic internal server error
        console.error(error);
        return APP_ERRORS.internalServerError("Unexpected server error").nextResponse();
    }
}


export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
    try {
        const roomId = parseId(params.roomId, CustomErrorMessages.ROOM_ID_NOT_VALID);
        const hotelId = parseId(params.hotelId, CustomErrorMessages.HOTEL_ID_NOT_VALID);

        const room = await prisma.room.findUnique({ where: { id: roomId, hotelId } });

        if (!room) return APP_ERRORS.notFound(CustomErrorMessages.ROOM_NOT_FOUND).nextResponse();

        const { roles } = await getAuthContext();

        if (!canDeleteRoom({ roles, hotelId })) return APP_ERRORS.forbidden().nextResponse();

        await prisma.room.delete({ where: { id: roomId, hotelId } });

        return NextResponse.json({ message: CustomSuccessMessages.ROOM_DELETED_SUCCESSFULLY });

    } catch (error: unknown) {


        if (error instanceof HttpError) {
            // If error is a custom HttpError, return its NextResponse
            console.error(error);
            return error.nextResponse();
        }

        // Otherwise, return generic internal server error
        console.error(error);
        return APP_ERRORS.internalServerError("Unexpected server error").nextResponse();
    }
}