import { CustomErrorMessages, CustomSuccessMessages } from "@constants/httpResponses";
import { getAuthContext } from "@helpers/getAuthContext";
import { parseId } from "@helpers/parseId";
import { canDeleteHotel, canUpdateHotel, canViewHotel } from "@helpers/permissions/hotelManagement";
import { APP_ERRORS } from "@lib/errors/factories";
import { HttpError } from "@lib/errors/HttpError";
import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";


type Params = { hotelId: string; };

export async function GET(_req: NextRequest, { params }: { params: Params }) {
    try {
        const hotelId = parseId(params.hotelId, CustomErrorMessages.HOTEL_ID_NOT_VALID);

        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

        if (!hotel) throw APP_ERRORS.notFound(CustomErrorMessages.HOTEL_NOT_FOUND);

        const { roles } = await getAuthContext();

        if (!canViewHotel({ roles, hotelId })) throw APP_ERRORS.forbidden();

        return NextResponse.json(hotel);

    } catch (error: unknown) {

        if (error instanceof HttpError) {
            // If error is a custom HttpError, return its NextResponse
            console.error(error);
            return error.nextResponse();
        }

        // Otherwise, return generic internal server error
        console.error(error);
        return APP_ERRORS.internalServerError(CustomErrorMessages.UNEXPECTED_SERVER_ERROR).nextResponse();
    }
}


export async function PATCH(req: NextRequest, { params }: { params: Params }) {
    try {
        const hotelId = parseId(params.hotelId, CustomErrorMessages.HOTEL_ID_NOT_VALID);

        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

        if (!hotel) throw APP_ERRORS.notFound(CustomErrorMessages.HOTEL_NOT_FOUND);

        const { roles } = await getAuthContext();

        //to-do: validate update fields
        if (!canUpdateHotel({ roles })) throw APP_ERRORS.forbidden();

        const data = await req.json();

        const updatedHotel = await prisma.hotel.update({ where: { id: hotelId }, data, });

        return NextResponse.json(updatedHotel);

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
        const hotelId = parseId(params.hotelId, CustomErrorMessages.HOTEL_ID_NOT_VALID);

        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

        if (!hotel) throw APP_ERRORS.notFound(CustomErrorMessages.HOTEL_NOT_FOUND);

        const { roles } = await getAuthContext();

        if (!canDeleteHotel({ roles })) throw APP_ERRORS.forbidden();

        await prisma.hotel.delete({ where: { id: hotelId } });

        return NextResponse.json({ message: CustomSuccessMessages.HOTEL_DELETED_SUCCESSFULLY });

    } catch (error: unknown) {


        if (error instanceof HttpError) {
            // If error is a custom HttpError, return its NextResponse
            console.error(error);
            return error.nextResponse();
        }

        // Otherwise, return generic internal server error
        console.error(error);
        return APP_ERRORS.internalServerError(CustomErrorMessages.UNEXPECTED_SERVER_ERROR).nextResponse();
    }
}