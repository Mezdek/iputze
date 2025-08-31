import { CustomErrorMessages, HttpStatus } from "@constants/httpResponses";
import { getAuthContext } from "@helpers/getAuthContext";
import { canCreateHotel, canListHotels } from "@helpers/permissions/hotelManagement";
import { APP_ERRORS } from "@lib/errors/factories";
import { HttpError } from "@lib/errors/HttpError";
import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface CreateHotelRequest {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;

}

export async function GET(_req: NextRequest) {
    try {

        const { roles } = await getAuthContext();

        if (!canListHotels({ roles })) throw APP_ERRORS.forbidden();

        const hotels = await prisma.hotel.findMany({
            include: { _count: true }
        });

        if (hotels.length === 0) throw APP_ERRORS.notFound(CustomErrorMessages.NO_HOTEL_FOUND);

        return NextResponse.json(hotels);

    } catch (error: unknown) {
        if (error instanceof HttpError) {
            console.error(error);
            return error.nextResponse();
        }

        console.error(error);
        return APP_ERRORS.internalServerError(CustomErrorMessages.UNEXPECTED_SERVER_ERROR).nextResponse();
    }
}

export async function POST(req: NextRequest) {
    try {

        const { roles } = await getAuthContext();

        if (!canCreateHotel({ roles })) throw APP_ERRORS.forbidden();

        const data = (await req.json()) as CreateHotelRequest;

        const hotelName = data.name;
        if (!hotelName) throw APP_ERRORS.badRequest(CustomErrorMessages.HOTEL_NAME_REQUIRED);


        const newHotel = await prisma.hotel.create({ data });

        return NextResponse.json(newHotel, { status: HttpStatus.CREATED });

    } catch (error: unknown) {
        if (error instanceof HttpError) {
            console.error(error);
            return error.nextResponse();
        }

        console.error(error);
        return APP_ERRORS.internalServerError(CustomErrorMessages.UNEXPECTED_SERVER_ERROR).nextResponse();
    }
}
